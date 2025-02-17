import { supabase } from '../../supabase';
import { logger } from '../../logger';
import type { AuthResponse } from '@supabase/supabase-js';
import type { Session } from '@supabase/supabase-js';

export class FallbackStrategy {
  private static readonly LOCAL_STORAGE_KEY = 'sb-auth-token';
  private static readonly SESSION_STORAGE_KEY = 'auth_fallback_used';
  private static readonly FALLBACK_TIMEOUT = 1000; // Reduced from 2000ms

  private static async persistSession(session: Session) {
    try {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify({
        currentSession: session,
        expiresAt: session.expires_at,
        timestamp: Date.now()
      }));
    } catch (err) {
      logger.error('Failed to persist session', 'FallbackStrategy');
    }
  }

  public static async getSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (!error && session) {
        await this.persistSession(session);
        return { data: { session }, error: null };
      }

      // Try localStorage fallback
      const localSession = this.getLocalStorageSession();
      if (localSession?.currentSession) {
        const refreshResult = await supabase.auth.refreshSession();
        if (!refreshResult.error && refreshResult.data.session) {
          await this.persistSession(refreshResult.data.session);
          return refreshResult;
        }
      }

      return { data: { session: null }, error: null };
    } catch (err) {
      logger.error('Session retrieval failed', 'FallbackStrategy');
      return { data: { session: null }, error: err as Error };
    }
  }

  public static getLocalStorageSession() {
    try {
      const stored = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      if (!stored) return null;

      const session = JSON.parse(stored);
      if (!session?.currentSession) {
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  private static logFallbackUsage(method: string) {
    if (!sessionStorage.getItem(this.SESSION_STORAGE_KEY)) {
      logger.info(`Using ${method} fallback for auth session`, 'FallbackStrategy'); 
      sessionStorage.setItem(this.SESSION_STORAGE_KEY, 'true');
    }

  }

  public static async refreshSession() {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      return { data: { session: data.session }, error };
    } catch (err) {
      logger.warn(`Session refresh failed: ${err instanceof Error ? err.message : String(err)}`, 'FallbackStrategy');
      return { data: { session: null }, error: err as Error };
    }
  }
}