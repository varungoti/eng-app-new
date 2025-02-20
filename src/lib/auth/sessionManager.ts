import { supabase } from '../supabase';
import { logger } from '../logger';
import type { Session } from '@supabase/gotrue-js';
import { AuthLoader } from './AuthLoader';

export type UserRole = 'admin' | 'teacher' | 'student' | 'parent';

export interface SessionState {
  isAuthenticated: boolean;
  currentRole?: string;
  lastActivity: Date;
  lastRefresh: Date;
  refreshAttempts: number;
  sessionErrors: string[];
  timestamp: number;
  expiresAt: Date;
  userId: string;
  role: string;
  windowId?: string;
}

const SESSION_STORAGE_KEY = 'sb-session-state';
const SESSION_CHECK_INTERVAL = 4 * 60 * 1000; // 4 minutes
const SESSION_REFRESH_THRESHOLD = 5 * 60; // 5 minutes before expiry
const REFRESH_COOLDOWN = 1000; // 1 second cooldown between refresh attempts
const MIN_SESSION_LIFETIME = 30 * 1000; // 30 seconds minimum session lifetime

export class SessionManager {
  private static instance: SessionManager;
  private currentSession: Session | null = null;
  private refreshTimer: NodeJS.Timeout | null = null;
  private lastRefreshAttempt: number = 0;
  private refreshInProgress: boolean = false;
  private authLoader: AuthLoader;
  private isChildWindow: boolean;
  private sessionStabilityTimeout: NodeJS.Timeout | null = null;

  private constructor() {
    this.authLoader = AuthLoader.getInstance();
    this.isChildWindow = this.authLoader.isChildWindowSession();
    this.initializeSessionCheck();
    this.loadPersistedState();
  }

  private async loadPersistedState() {
    try {
      const state = this.getPersistedSessionState();
      if (state && this.isStateValid(state)) {
        // For child windows, try to use parent window's session first
        if (this.isChildWindow && window.opener) {
          try {
            const parentState = JSON.parse(window.opener.localStorage.getItem(SESSION_STORAGE_KEY) || '');
            if (parentState && this.isStateValid(parentState)) {
              this.persistSessionState(parentState);
              return;
            }
          } catch (err) {
            logger.debug('Failed to get parent window session state', { source: 'SessionManager' });
          }
        }

        const session = await this.getCurrentSession();
        if (session) {
          this.currentSession = session;
          this.stabilizeSession();
          logger.debug('Restored persisted session state', { source: 'SessionManager' });
        }
      }
    } catch (err) {
      logger.warn('Failed to load persisted state', { source: 'SessionManager' });
    }
  }

  private isStateValid(state: SessionState): boolean {
    const now = Math.floor(Date.now() / 1000);
    return (
      state.timestamp > now - 24 * 60 * 60 && // Not older than 24 hours
      (!state.expiresAt || state.expiresAt.getTime() / 1000 > now) && // Convert Date to seconds
      !!state.userId // Has user ID
    );
  }

  private initializeSessionCheck() {
    // Clear any existing timer
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }

    // Child windows don't need to refresh sessions
    if (!this.isChildWindow) {
      this.refreshTimer = setInterval(() => {
        this.checkAndRefreshSession();
      }, SESSION_CHECK_INTERVAL);
    }
  }

  public static getInstance(): SessionManager {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  public async checkAndRefreshSession(): Promise<void> {
    if (this.refreshInProgress || this.isChildWindow) {
      return;
    }

    try {
      this.refreshInProgress = true;
      const now = Math.floor(Date.now() / 1000);
      const session = await this.getCurrentSession();

      if (!session) {
        return;
      }

      // Check if session needs refresh
      if (session.expires_at && session.expires_at - now < SESSION_REFRESH_THRESHOLD) {
        const refreshedSession = await this.refreshSession();
        if (refreshedSession) {
          this.stabilizeSession();
        } else {
          logger.warn('Session refresh failed during check', { source: 'SessionManager' } );
        }
      }
    } catch (err) {
      logger.error('Session check failed', { source: 'SessionManager' } );
    } finally {
      this.refreshInProgress = false;
    }
  }

  private async getCurrentSession(): Promise<Session | null> {
    try {
      // Child windows should try to use parent's session first
      if (this.isChildWindow && window.opener) {
        try {
          const parentState = JSON.parse(window.opener.localStorage.getItem(SESSION_STORAGE_KEY) || '');
          if (parentState && this.isStateValid(parentState)) {
            return this.currentSession;
          }
        } catch (err) {
          logger.debug('Failed to get parent window session', { source: 'SessionManager' });
        }
      }

      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        throw error;
      }

      if (session) {
        this.currentSession = session;
        this.persistSessionState(session);
      }

      return session;
    } catch (err) {
      logger.error('Failed to get current session', { source: 'SessionManager' });
      return null;
    }
  }

  private persistSessionState(session: Session) {
    try {
      const state: SessionState = {
        timestamp: Date.now(),
        expiresAt: session.expires_at ? new Date(session.expires_at * 1000) : new Date(),
        userId: session.user?.id || '',
        role: session.user?.user_metadata?.role || '',
        lastRefresh: new Date(),
        isAuthenticated: true,
        lastActivity: new Date(),
        refreshAttempts: 0,
        sessionErrors: [],
        windowId: this.isChildWindow ? 'child' : 'parent'
      };
      
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      logger.warn('Failed to persist session state', { source: 'SessionManager' });
    }
  }

  public async updateUserRole(newRole: UserRole): Promise<void> {
    try {
      const session = await this.getCurrentSession();
      
      if (!session) {
        throw new Error('No active session');
      }

      const { error: updateError } = await supabase.auth.updateUser({
        data: { role: newRole }
      });

      if (updateError) throw updateError;
      
      await this.refreshSession();
      
      logger.info(`Role updated successfully: ${newRole}`, { source: 'SessionManager' });
    } catch (err) {
      logger.error('Failed to update role', { source: 'SessionManager' });
      throw err;
    }
  }

  public async refreshSession(): Promise<Session | null> {
    if (this.refreshInProgress || this.isChildWindow) {
      return this.currentSession;
    }

    try {
      this.refreshInProgress = true;
      const now = Date.now();
      
      if (now - this.lastRefreshAttempt < REFRESH_COOLDOWN) {
        return this.currentSession;
      }
      
      this.lastRefreshAttempt = now;

      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (error) {
        throw error;
      }

      if (session) {
        this.currentSession = session;
        this.persistSessionState(session);
        logger.info('Session refreshed successfully', { source: 'SessionManager' });
      }

      return session;
    } catch (err) {
      logger.error('Failed to refresh session', { source: 'SessionManager' });
      return null;
    } finally {
      this.refreshInProgress = false;
    }
  }

  public getPersistedSessionState(): SessionState | null {
    try {
      const state = localStorage.getItem(SESSION_STORAGE_KEY);
      return state ? JSON.parse(state) : null;
    } catch {
      return null;
    }
  }

  public cleanup() {
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
    localStorage.removeItem(SESSION_STORAGE_KEY);
    this.currentSession = null;
    this.authLoader.clearAuthState();
  }

  private stabilizeSession() {
    if (this.sessionStabilityTimeout) {
      clearTimeout(this.sessionStabilityTimeout);
    }

    this.sessionStabilityTimeout = setTimeout(() => {
      if (this.currentSession) {
        this.persistSessionState(this.currentSession);
      }
    }, MIN_SESSION_LIFETIME);
  }
}

export const sessionManager = SessionManager.getInstance();