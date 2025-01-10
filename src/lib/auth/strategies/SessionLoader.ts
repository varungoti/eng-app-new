import { supabase } from '../../supabase';
import { logger } from '../../logger';
import { RetryStrategy } from './RetryStrategy';
import { LoadingStrategy } from './LoadingStrategy';
import type { Session } from '@supabase/supabase-js';

export class SessionLoader {
  private static retryStrategy = new RetryStrategy({
    maxAttempts: 3,
    baseDelay: 500, // Reduced from 1000
    maxDelay: 2000, // Reduced from 5000
    timeout: 5000 // Reduced from 8000
  });

  private static loadingStrategy = new LoadingStrategy('SessionLoader');

  public static async loadSession(): Promise<Session | null> {
    this.loadingStrategy.start();

    try {
      const { data: { session }, error } = await this.retryStrategy.execute(() => 
        supabase.auth.getSession()
      );

      if (error) throw error;

      if (session) {
        logger.info('Session loaded successfully', {
          context: { userId: session.user?.id },
          source: 'SessionLoader'
        });
      }

      this.loadingStrategy.end();
      return session;
    } catch (err) {
      this.loadingStrategy.end(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  }
}