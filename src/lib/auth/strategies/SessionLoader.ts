import { supabase } from '../../supabase';
import { logger } from '../../logger';
import { RetryStrategy } from './RetryStrategy';
import { LoadingStrategy } from './LoadingStrategy';
import type { Session } from '@supabase/supabase-js';

export class SessionLoader {
  private static retryStrategy = new RetryStrategy({
    maxAttempts: 3,
    baseDelay: 500,
    maxDelay: 2000,
    timeout: 5000
  });

  private static loadingStrategy = new LoadingStrategy('SessionLoader');
  private static readonly STORAGE_KEY = 'sb-auth-token'; // Match Supabase's key exactly
  private static readonly SESSION_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days

  private static get auth() {
    return supabase.auth;
  }

  public static async loadSession(): Promise<Session | null> {
    this.loadingStrategy.start();

    try {
      // First try to get current session from Supabase
      const { data: { session }, error } = await this.retryStrategy.execute(() => 
        this.auth.getSession()
      );

      if (session) {
        await this.persistSession(session);
        logger.info(`Session loaded successfully for user ${session.user?.id}`, 'SessionLoader');
        this.loadingStrategy.end();
        return session;
      }

      if (error) {
        logger.warn(`Failed to get current session: ${error.message}`, 'SessionLoader');
      }

      // Try to recover from storage if no current session
      const storedSession = await this.getStoredSession();
      if (storedSession) {
        logger.info('Session recovered from storage', 'SessionLoader');
        this.loadingStrategy.end();
        return storedSession;
      }

      this.loadingStrategy.end();
      return null;
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      logger.error(`Session loading failed: ${error.message}`, 'SessionLoader');
      this.loadingStrategy.end(error);
      throw error;
    }
  }

  private static async getStoredSession(): Promise<Session | null> {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return null;

      const { currentSession, expiresAt } = JSON.parse(stored);
      
      if (!currentSession?.refresh_token) {
        localStorage.removeItem(this.STORAGE_KEY);
        return null;
      }

      // Check if session is expired
      if (expiresAt && new Date(expiresAt).getTime() < Date.now()) {
        logger.debug('Stored session expired, attempting refresh', 'SessionLoader');
      }

      // Try to refresh the session
      const { data, error } = await this.auth.refreshSession({
        refresh_token: currentSession.refresh_token
      });

      if (error) {
        logger.warn(`Session refresh failed: ${error.message}`, 'SessionLoader');
        localStorage.removeItem(this.STORAGE_KEY);
        return null;
      }

      if (data.session) {
        await this.persistSession(data.session);
        return data.session;
      }

      return null;
    } catch (err) {
      logger.error(`Failed to get stored session: ${err instanceof Error ? err.message : String(err)}`, 'SessionLoader');
      localStorage.removeItem(this.STORAGE_KEY);
      return null;
    }
  }

  private static async persistSession(session: Session): Promise<void> {
    try {
      // Set expiry to 7 days from now
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + this.SESSION_EXPIRY);

      const sessionData = {
        currentSession: session,
        expiresAt: expiryDate.toISOString(),
        timestamp: Date.now()
      };

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(sessionData));
    } catch (err) {
      logger.error(`Failed to persist session: ${err instanceof Error ? err.message : String(err)}`, 'SessionLoader');
    }
  }

  public static async refreshSession(): Promise<Session | null> {
    try {
      const { data, error } = await this.auth.refreshSession();
      
      if (error) {
        // Try to recover using stored refresh token
        const storedSession = await this.getStoredSession();
        if (storedSession) {
          return storedSession;
        }
        throw error;
      }

      if (data.session) {
        await this.persistSession(data.session);
        return data.session;
      }

      return null;
    } catch (err) {
      logger.error(`Session refresh failed: ${err instanceof Error ? err.message : String(err)}`, 'SessionLoader');
      throw err;
    }
  }
}