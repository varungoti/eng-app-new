import { supabase } from '../../supabase';
import { logger } from '../../logger';

export class FallbackStrategy {
  private static readonly LOCAL_STORAGE_KEY = 'sb-auth-token';
  private static readonly SESSION_STORAGE_KEY = 'auth_fallback_used';
  private static readonly FALLBACK_TIMEOUT = 1000; // Reduced from 2000ms

  public static async getSession() {
    try {
      // Try memory cache first (fastest)
      const memorySession = await Promise.race([
        supabase.auth.getSession(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Session fetch timeout')), this.FALLBACK_TIMEOUT)
        )
      ]);

      if (!memorySession.error && memorySession.data.session) {
        return memorySession;
      }

      // Try localStorage next
      const localSession = this.getLocalStorageSession();
      if (localSession?.user) {
        this.logFallbackUsage('localStorage');
        return { data: { session: localSession }, error: null };
      }

      // Try refreshing token as last resort
      const refreshResult = await Promise.race([
        supabase.auth.refreshSession(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Token refresh timeout')), this.FALLBACK_TIMEOUT)
        )
      ]);

      if (refreshResult.data.session) {
        return { data: { session: refreshResult.data.session }, error: null };
      }

      return { data: { session: null }, error: null };
    } catch (err) {
      logger.warn('Fallback auth strategy failed', {
        context: { error: err },
        source: 'FallbackStrategy'
      });
      return { data: { session: null }, error: null };
    }
  }

  public static getLocalStorageSession() {
    try {
      const stored = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      if (!stored) return null;

      const session = JSON.parse(stored);
      if (!session?.user?.id || !session?.access_token) {
        return null;
      }
      return session;
    } catch {
      return null;
    }
  }

  private static logFallbackUsage(method: string) {
    if (!sessionStorage.getItem(this.SESSION_STORAGE_KEY)) {
      logger.info(`Using ${method} fallback for auth session`, {
        source: 'FallbackStrategy'
      });
      sessionStorage.setItem(this.SESSION_STORAGE_KEY, 'true');
    }
  }
}