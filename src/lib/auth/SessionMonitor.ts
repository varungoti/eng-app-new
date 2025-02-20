import { supabase } from '../supabase';
import { logger } from '../logger';
import { errorTracker } from '../errorTracker';
import { Session } from '@supabase/supabase-js';
import { SessionLoader } from './strategies/SessionLoader';
import { RetryStrategy } from './strategies/RetryStrategy';
import { FallbackStrategy } from './strategies/FallbackStrategy';
import { debounce } from 'lodash';

interface SessionState {
  isAuthenticated: boolean;
  currentRole?: string;
  lastActivity: Date;
  lastRefresh: Date;
  refreshAttempts: number;
  sessionErrors: string[];
  lastOperation?: {
    type: string;
    timestamp: Date;
    success: boolean;
    error?: string;
  };
  timestamp: number;
  expiresAt: Date;
  userId: string;
  role: string;
}

export class SessionMonitor {
  private static instance: SessionMonitor;
  private static readonly STORAGE_KEY = 'sb:token'; // Match Supabase's key
  private static readonly SESSION_CHECK_INTERVAL = 60000; // 1 minute
  private static readonly TOKEN_REFRESH_THRESHOLD = 55000; // 55 seconds
  private static readonly SESSION_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minute buffer before expiry
  
  private sessionState: SessionState;
  private sessionCheckInterval?: NodeJS.Timeout;
  private readonly sessionLoader: typeof SessionLoader;
  private readonly retryStrategy: RetryStrategy;
  private stateUpdateCallbacks: Set<(state: SessionState) => void>;
  private debouncedUpdateState: ReturnType<typeof debounce>;

  private constructor() {
    this.sessionLoader = SessionLoader;
    this.retryStrategy = new RetryStrategy({
      maxAttempts: 3,
      baseDelay: 500,
      maxDelay: 2000,
      timeout: 5000
    });
    this.stateUpdateCallbacks = new Set();
    this.sessionState = {
      isAuthenticated: false,
      lastActivity: new Date(),
      lastRefresh: new Date(),
      timestamp: Date.now(),
      expiresAt: new Date(),
      userId: '',
      role: '',
      sessionErrors: [],
      refreshAttempts: 0
    };

    // Debounced state update to prevent rapid re-renders
    this.debouncedUpdateState = debounce(this.updateState.bind(this), 300, {
      leading: true,
      trailing: true
    });

    this.initializeMonitoring().catch(err => {
      logger.error('Failed to initialize session monitoring', { error: err });
    });
  }

  public static getInstance(): SessionMonitor {
    if (!SessionMonitor.instance) {
      SessionMonitor.instance = new SessionMonitor();
    }
    return SessionMonitor.instance;
  }

  private async initializeMonitoring() {
    try {
      // Try to load session using SessionLoader first
      const session = await this.sessionLoader.loadSession();
      
      if (session) {
        await this.persistSession(session);
        this.updateState({
          isAuthenticated: true,
          currentRole: session.user?.role as string | undefined,
          lastActivity: new Date(),
          lastRefresh: new Date(),
          refreshAttempts: 0,
          sessionErrors: []
        });
      }

      // Monitor auth state changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        logger.info(`Auth state changed: ${event}`, { source: 'SessionMonitor' });

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session) {
            await this.handleSignIn(session);
          }
        } else if (event === 'SIGNED_OUT') {
          await this.handleSignOut();
        }
      });

      // Clear any existing interval
      if (this.sessionCheckInterval) {
        clearInterval(this.sessionCheckInterval);
      }

      // Set up periodic session check with optimized interval
      this.sessionCheckInterval = setInterval(() => {
        this.retryStrategy.execute(() => this.checkSession());
      }, SessionMonitor.SESSION_CHECK_INTERVAL);

    } catch (err) {
      logger.error(`Session monitoring initialization failed: ${err instanceof Error ? err.message : String(err)}`, { source: 'SessionMonitor' });
    }
  }

  private async persistSession(session: Session) {
    try {
      localStorage.setItem(SessionMonitor.STORAGE_KEY, JSON.stringify({
        currentSession: session,
        expiresAt: session.expires_at,
        timestamp: Date.now()
      }));
    } catch (err) {
      logger.error(`Failed to persist session: ${err instanceof Error ? err.message : String(err)}`, { source: 'SessionMonitor' });
    }
  }

  private async verifySession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        this.handleSessionLoss();
        return false;
      }
      return true;
    } catch (err) {
      this.handleSessionLoss();
      return false;
    }
  }

  private async checkSession() {
    const now = new Date();
    const timeSinceLastRefresh = now.getTime() - this.sessionState.lastRefresh?.getTime() || 0;

    if (timeSinceLastRefresh > SessionMonitor.TOKEN_REFRESH_THRESHOLD) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          await this.handleSignIn(session);
        } else {
          await this.handleSignOut();
        }
      } catch (err) {
        logger.warn('Session check failed', { error: err });
      }
    }
  }

  private async attemptSessionRecovery() {
    try {
      // First try to refresh the session
      const { data: { session }, error } = await supabase.auth.refreshSession();
      
      if (!error && session) {
        await this.handleSignIn(session);
        logger.info('Session recovered through refresh', { source: 'SessionMonitor' });
        return true;
      }

      // If refresh fails, try to recover from storage
      const storedSession = localStorage.getItem(SessionMonitor.STORAGE_KEY);
      if (storedSession) {
        const { currentSession, timestamp } = JSON.parse(storedSession);
        
        // Check if stored session is not too old (less than 1 hour)
        if (currentSession?.refresh_token && Date.now() - timestamp < 60 * 60 * 1000) {
          const refreshResult = await supabase.auth.refreshSession({
            refresh_token: currentSession.refresh_token
          });

          if (!refreshResult.error && refreshResult.data.session) {
            await this.handleSignIn(refreshResult.data.session);
            logger.info('Session recovered from storage', { source: 'SessionMonitor' });
            return true;
          }
        }
      }

      // If all recovery attempts fail, handle session loss
      this.handleSessionLoss();
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      logger.error(`Session recovery failed: ${errorMessage}`, { source: 'SessionMonitor' });
      this.handleSessionLoss();
      return false;
    }
  }

  private handleSessionLoss() {
    this.updateState({
      isAuthenticated: false,
      currentRole: undefined,
      lastActivity: new Date(),
      refreshAttempts: this.sessionState.refreshAttempts + 1,
      sessionErrors: [
        ...this.sessionState.sessionErrors,
        'Session lost - please sign in again'
      ].slice(-5)
    });
    
    // Clear stored session
    localStorage.removeItem(SessionMonitor.STORAGE_KEY);
    
    // Track the operation
    this.trackOperation('session_loss', false);
    
    // Log the event
    logger.warn('Session lost, user needs to sign in again', { source: 'SessionMonitor' });
  }

  private async handleSignIn(session: Session) {
    try {
      await this.persistSession(session);
      this.updateState({
        isAuthenticated: true,
        currentRole: session.user?.role as string,
        lastActivity: new Date(),
        lastRefresh: new Date(),
        refreshAttempts: 0,
        sessionErrors: []
      });
    } catch (err) {
      logger.error(`Sign in handling failed: ${err instanceof Error ? err.message : String(err)}`, { source: 'SessionMonitor' });
    }
  }

  private async handleSignOut() {
    try {
      localStorage.removeItem(SessionMonitor.STORAGE_KEY);
      this.updateState({
        isAuthenticated: false,
        currentRole: undefined,
        lastActivity: new Date(),
        refreshAttempts: 0,
        sessionErrors: []
      });
    } catch (err) {
      logger.error(`Sign out handling failed: ${err instanceof Error ? err.message : String(err)}`, { source: 'SessionMonitor' });
    }
  }

  private recordSessionError(error: string) {
    this.sessionState.sessionErrors = [
      ...this.sessionState.sessionErrors,
      error
    ].slice(-5); // Keep last 5 errors

    this.notifyListeners();
  }

  private updateState(newState: Partial<SessionState>) {
    this.sessionState = { ...this.sessionState, ...newState };
    this.notifyListeners();
  }

  public subscribeToStateUpdates(callback: (state: SessionState) => void): () => void {
    this.stateUpdateCallbacks.add(callback);
    return () => this.stateUpdateCallbacks.delete(callback);
  }

  private notifyListeners() {
    this.stateUpdateCallbacks.forEach(callback => callback(this.sessionState));
  }

  public getState(): SessionState {
    return { ...this.sessionState };
  }

  public getSessionErrors(): string[] {
    return [...this.sessionState.sessionErrors];
  }

  private trackOperation(type: string, success: boolean, error?: string) {
    this.updateState({
      lastOperation: {
        type,
        timestamp: new Date(),
        success,
        error
      }
    });
  }

  public async refreshSession(): Promise<Session | null> {
    try {
      return await this.retryStrategy.execute(async () => {
        const { data: { session }, error } = await supabase.auth.refreshSession();
        
        if (error) {
          // Try fallback strategy
          const fallbackSession = await FallbackStrategy.refreshSession();
          if (fallbackSession.data.session) {
            await this.persistSession(fallbackSession.data.session);
            return fallbackSession.data.session;
          }
          throw error;
        }
        
        if (session) {
          await this.persistSession(session);
          this.updateState({
            isAuthenticated: true,
            currentRole: session.user?.role as string | undefined,
            lastActivity: new Date(),
            lastRefresh: new Date(),
            refreshAttempts: 0,
            sessionErrors: []
          });
          return session;
        }

        throw new Error('No session returned from refresh');
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      this.recordSessionError(`Session refresh failed: ${errorMessage}`);
      throw err;
    }
  }

  private isValidSession(session: any): boolean {
    if (!session || !session.user || !session.access_token) {
      return false;
    }

    // Check if session is nearing expiry with buffer time
    if (session.expires_at) {
      const expiryTime = new Date(session.expires_at).getTime();
      const timeUntilExpiry = expiryTime - Date.now();
      
      if (timeUntilExpiry <= 0) {
        logger.debug('Session expired', { source: 'SessionMonitor' });
        return false;
      }

      // Proactively refresh if within buffer period
      if (timeUntilExpiry < SessionMonitor.SESSION_EXPIRY_BUFFER) {
        logger.debug('Session nearing expiry, will refresh', { source: 'SessionMonitor' });
        return false;
      }
    }

    // Check for required user properties
    if (!session.user.id || !session.user.role) {
      logger.debug('Session missing required user properties', { source: 'SessionMonitor' });
      return false;
    }

    // Check token format (basic check)
    if (!session.access_token.startsWith('ey')) {
      logger.debug('Invalid token format', { source: 'SessionMonitor' });
      return false;
    }

    return true;
  }

  // Add cleanup method
  public cleanup() {
    if (this.sessionCheckInterval) {
      clearInterval(this.sessionCheckInterval);
    }
    this.stateUpdateCallbacks.clear();
  }
}

export const sessionMonitor = SessionMonitor.getInstance(); 