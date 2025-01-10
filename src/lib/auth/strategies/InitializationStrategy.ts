import { logger } from '../../logger';
import { RetryStrategy } from './RetryStrategy';
import { FallbackStrategy } from './FallbackStrategy';
import { LoadingStrategy } from './LoadingStrategy';
import { CacheStrategy } from './CacheStrategy';
import { ProgressiveLoader } from './ProgressiveLoader';

const AUTH_CACHE_KEY = 'auth_session';
const AUTH_TIMEOUT = 1500; // Reduced from 2000ms

export class InitializationStrategy {
  private static retryStrategy = new RetryStrategy({
    maxAttempts: 1, // Single attempt for faster response
    baseDelay: 200,
    maxDelay: 500,
    timeout: AUTH_TIMEOUT
  });

  private static loadingStrategy = new LoadingStrategy('AuthInitializer');
  private static cacheStrategy = new CacheStrategy();

  public static async initialize(): Promise<void> {
    const loader = new ProgressiveLoader('AuthInitializer');
    
    try {
      // Try cache first - synchronously
      const cachedSession = this.cacheStrategy.get(AUTH_CACHE_KEY, true);
      if (cachedSession) {
        return;
      }

      // Start loading indicator
      loader.start();

      // Try localStorage first since it's fastest
      const localSession = FallbackStrategy.getLocalStorageSession();
      if (localSession) {
        this.cacheStrategy.set(AUTH_CACHE_KEY, localSession);
        loader.complete();
        return;
      }

      // Try fast initialization with timeout
      const result = await Promise.race([
        this.retryStrategy.execute(async () => {
          return await FallbackStrategy.getSession();
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth timeout')), AUTH_TIMEOUT)
        )
      ]).catch(err => {
        logger.debug('Auth initialization timed out, continuing with null session', {
          context: { error: err },
          source: 'InitializationStrategy'
        });
        return { data: { session: null }, error: null };
      });

      if (result.data.session) {
        this.cacheStrategy.set(AUTH_CACHE_KEY, result.data.session);
      }

      loader.complete();
    } catch (err) {
      loader.error(err instanceof Error ? err : new Error(String(err)));
      logger.debug('Auth initialization failed, continuing with null session', {
        context: { error: err },
        source: 'InitializationStrategy' 
      });
    }
  }
}