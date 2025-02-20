import { logger } from '../../logger';
import { RetryStrategy } from './RetryStrategy';
import { FallbackStrategy } from './FallbackStrategy';
import { LoadingStrategy } from './LoadingStrategy';
import { CacheStrategy } from './CacheStrategy';
import { ProgressiveLoader } from './ProgressiveLoader';

const AUTH_CACHE_KEY = 'auth_session';
const AUTH_TIMEOUT = 1500; // 1.5 seconds timeout
const INIT_DEBOUNCE = 100; // 100ms debounce for initialization

interface CachedSession {
  session: any;
  isValid: boolean;
  timestamp: number;
  windowId?: string;
  lastAuthState?: string;
  lastRoute?: string;
  sessionContext?: any;
}

interface SessionResult {
  data: {
    session: any;
  } | null;
  error: Error | null;
}

export class InitializationStrategy {
  private static retryStrategy = new RetryStrategy({
    maxAttempts: 2,
    baseDelay: 200,
    maxDelay: 500,
    timeout: AUTH_TIMEOUT
  });

  private static loadingStrategy = new LoadingStrategy('AuthInitializer');
  private static cacheStrategy = new CacheStrategy<CachedSession>();
  private static initializationPromise: Promise<void> | null = null;
  private static lastInitAttempt = 0;
  private static isChildWindow = window.opener !== null;

  private static getLastRoute(): string | undefined {
    try {
      // Try sessionStorage first for more immediate state
      const sessionRoute = sessionStorage.getItem('currentRoute');
      if (sessionRoute) return sessionRoute;

      // Fall back to localStorage for persistent state
      const localRoute = localStorage.getItem('lastRoute');
      return localRoute || undefined;
    } catch {
      return undefined;
    }
  }

  private static getSessionContext(): any {
    try {
      const lessonContext = sessionStorage.getItem('lessonContext');
      return lessonContext ? JSON.parse(lessonContext) : null;
    } catch {
      return null;
    }
  }

  public static async initialize(): Promise<void> {
    const now = Date.now();
    const lastRoute = this.getLastRoute();
    const sessionContext = this.getSessionContext();
    
    // Debounce initialization attempts
    if (now - this.lastInitAttempt < INIT_DEBOUNCE) {
      if (this.initializationPromise) {
        return this.initializationPromise;
      }
    }
    
    this.lastInitAttempt = now;
    const loader = new ProgressiveLoader('AuthInitializer');
    
    this.initializationPromise = (async () => {
      try {
        // For child windows, try to use parent's session first
        if (this.isChildWindow && window.opener) {
          try {
            const parentSession = window.opener.localStorage.getItem(AUTH_CACHE_KEY);
            if (parentSession) {
              const parsed = JSON.parse(parentSession);
              if (parsed.isValid && parsed.lastAuthState === 'SIGNED_IN') {
                const sessionState = {
                  ...parsed,
                  timestamp: now,
                  windowId: 'child',
                  lastRoute,
                  sessionContext
                };
                this.cacheStrategy.set(AUTH_CACHE_KEY, sessionState);
                
                // Also update sessionStorage
                if (lastRoute) {
                  sessionStorage.setItem('currentRoute', lastRoute);
                }
                
                logger.debug('Using parent window session', { 
                  source: 'InitializationStrategy',
                  context: { lastRoute, sessionContext }
                });
                return;
              }
            }
          } catch (err) {
            logger.warn('Failed to get parent window session', { 
              source: 'InitializationStrategy',
              context: { error: err }
            });
          }
        }

        // Try cache first - synchronously
        const cachedSession = this.cacheStrategy.get(AUTH_CACHE_KEY, true);
        if (cachedSession?.isValid) {
          // Update the cached session with the current route and context
          const sessionState = {
            ...cachedSession,
            lastRoute,
            sessionContext
          };
          this.cacheStrategy.set(AUTH_CACHE_KEY, sessionState);
          
          // Sync with sessionStorage
          if (lastRoute) {
            sessionStorage.setItem('currentRoute', lastRoute);
          }
          
          logger.debug('Using cached auth session', { 
            source: 'InitializationStrategy',
            context: { lastRoute, sessionContext }
          });
          return;
        }

        // Start loading indicator
        loader.start();
        this.loadingStrategy.start();

        // Try localStorage first since it's fastest
        const localSession = await FallbackStrategy.getLocalStorageSession();
        if (localSession?.isValid) {
          this.cacheStrategy.set(AUTH_CACHE_KEY, { 
            ...localSession,
            timestamp: now,
            lastAuthState: 'SIGNED_IN',
            lastRoute
          });
          logger.debug('Using local storage session', { 
            source: 'InitializationStrategy',
            context: { lastRoute }
          });
          return;
        }

        // Try fast initialization with timeout
        const result = await Promise.race([
          this.retryStrategy.execute(async () => {
            const session = await FallbackStrategy.getSession();
            if (session.error) {
              throw session.error;
            }
            return session;
          }),
          new Promise<SessionResult>((_, reject) => 
            setTimeout(() => reject(new Error('Auth initialization timeout')), AUTH_TIMEOUT)
          )
        ]).catch(err => {
          logger.debug(
            `Auth initialization timed out: ${err instanceof Error ? err.message : String(err)}`,
            { 
              source: 'InitializationStrategy',
              context: { error: err }
            }
          );
          return { data: { session: null }, error: null } as SessionResult;
        });

        if (result.data?.session) {
          const sessionState = {
            session: result.data.session,
            isValid: true,
            timestamp: now,
            lastAuthState: 'SIGNED_IN',
            windowId: this.isChildWindow ? 'child' : 'parent',
            lastRoute
          };

          this.cacheStrategy.set(AUTH_CACHE_KEY, sessionState);
          logger.debug('Auth session initialized', { 
            source: 'InitializationStrategy',
            context: { windowId: sessionState.windowId, lastRoute }
          });
        }

        loader.complete();
        this.loadingStrategy.end();
      } catch (err) {
        loader.error(err instanceof Error ? err : new Error(String(err)));
        this.loadingStrategy.end(err instanceof Error ? err : new Error(String(err)));
        logger.error('Auth initialization failed', {
          source: 'InitializationStrategy',
          context: { error: err, lastRoute }
        });
        throw err;
      } finally {
        this.initializationPromise = null;
      }
    })();

    return this.initializationPromise;
  }

  public static clearCache(): void {
    this.cacheStrategy.clear();
    try {
      localStorage.removeItem('lastRoute');
    } catch {
      // Ignore errors when clearing localStorage
    }
  }
}