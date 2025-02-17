import { logger } from '../logger';
import { LoadingMonitor, type MonitorConfig } from '../monitoring';
import { LoadingStrategy } from './strategies/LoadingStrategy';
import { CacheStrategy } from './strategies/CacheStrategy';
import { SessionLoader } from './strategies/SessionLoader';
import { supabase } from '../supabase';

const AUTH_CACHE_KEY = 'auth_state';
const INIT_TIMEOUT = 5000;

export class AuthLoader {
  private loadingMonitor: LoadingMonitor;
  private loadingStrategy: LoadingStrategy;
  private cacheStrategy: CacheStrategy<{ initialized: boolean }>;
  private initialized: boolean = false;
  private static instance: AuthLoader;
  private loadingPromise: Promise<void> | null = null;

  constructor() {
    this.loadingMonitor = new LoadingMonitor(supabase, { 
      retryCount: 3,
      retryInterval: 1000,
      timeoutMs: INIT_TIMEOUT 
    } as MonitorConfig);
    this.loadingStrategy = new LoadingStrategy('AuthLoader');
    this.cacheStrategy = new CacheStrategy<{ initialized: boolean }>(1);
  }

  public static getInstance(): AuthLoader {
    if (!AuthLoader.instance) {
      AuthLoader.instance = new AuthLoader();
    }
    return AuthLoader.instance;
  }

  public async initialize(): Promise<void> {
    if (this.initialized || this.loadingPromise) {
      return this.loadingPromise || Promise.resolve();
    }

    this.loadingStrategy.start();

    this.loadingPromise = Promise.race([
      this.initializeAuth(),
      new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Auth initialization timed out')), INIT_TIMEOUT);
      })
    ])
      .catch(err => {
        logger.error(`Auth initialization failed: ${err instanceof Error ? err.message : String(err)}`, 'AuthLoader');
        // Allow continuing with limited functionality
        this.initialized = true;
        throw err;
      })
      .finally(() => {
        this.loadingPromise = null;
        this.loadingStrategy.end();
      });

    return this.loadingPromise;
  }

  private async initializeAuth(): Promise<void> {
    try {
      const session = await SessionLoader.loadSession();
      if (session) {
        this.cacheStrategy.set(AUTH_CACHE_KEY, { initialized: true });
        this.initialized = true;
        logger.info('Auth initialized successfully', 'AuthLoader');
      }
    } catch (err) {
      logger.error(`Auth initialization error: ${err instanceof Error ? err.message : String(err)}`, 'AuthLoader');
      throw err;
    }
  }

  public isInitialized(): boolean {
    return this.initialized;
  }
}