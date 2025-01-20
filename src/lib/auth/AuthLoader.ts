import { logger } from '../logger';
import { LoadingMonitor, type MonitoringConfig } from '../monitoring';
import { LoadingStrategy } from './strategies/LoadingStrategy';
import { CacheStrategy } from './strategies/CacheStrategy';
import { InitializationStrategy } from './strategies/InitializationStrategy';
import { supabase } from '../supabase';

const AUTH_CACHE_KEY = 'auth_state';

export class AuthLoader {
  private loadingMonitor: LoadingMonitor;
  private loadingStrategy: LoadingStrategy;
  private cacheStrategy: CacheStrategy<{ initialized: boolean }>;
  private initialized: boolean = false;
  private initializationTimeout: number = 5000;
  private static instance: AuthLoader;
  private loadingPromise: Promise<void> | null = null;

  constructor() {
    this.loadingMonitor = new LoadingMonitor(supabase, { 
      retryCount: 3,
      retryInterval: 1000,
      timeoutMs: 5000 
    } as MonitoringConfig);
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
    if (this.initialized) {
      return;
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    // Check cache first
    const cachedAuth = this.cacheStrategy.get(AUTH_CACHE_KEY);
    if (cachedAuth) {
      this.initialized = true;
      return;
    }

    this.loadingStrategy.start();

    this.loadingPromise = Promise.race([
      InitializationStrategy.initialize(),
      new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error('Auth initialization timed out'));
        }, this.initializationTimeout);
      })
    ])
      .then(() => {
        this.initialized = true;
        this.cacheStrategy.set(AUTH_CACHE_KEY, { initialized: true });
      })
      .catch(err => {
        logger.error('Auth initialization failed', {
          context: { error: err },
          source: 'AuthLoader'
        });
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

  public isInitialized(): boolean {
    return this.initialized;
  }
}