import { logger } from '../logger';
import { LoadingMonitor, type MonitorConfig } from '../monitoring';
import { LoadingStrategy } from './strategies/LoadingStrategy';
import { CacheStrategy } from './strategies/CacheStrategy';
import { SessionLoader } from './strategies/SessionLoader';
import { supabase } from '../supabase';

interface AuthState {
  initialized: boolean;
  lastAuthState: string;
  error?: string;
  windowId?: string;
  timestamp: number;
}

const AUTH_CACHE_KEY = 'auth_state';
const INIT_TIMEOUT = 5000;
const STATE_DEBOUNCE_TIME = 1000;
const WINDOW_ID = `window_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
const BROADCAST_CHANNEL_NAME = 'auth_sync_channel';

export class AuthLoader {
  private loadingMonitor: LoadingMonitor;
  private loadingStrategy: LoadingStrategy;
  private cacheStrategy: CacheStrategy<AuthState>;
  private initialized: boolean = false;
  private static instance: AuthLoader;
  private loadingPromise: Promise<void> | null = null;
  private lastStateChange: number = 0;
  private stateChangeTimeout: NodeJS.Timeout | null = null;
  private broadcastChannel: BroadcastChannel | null = null;
  private isChildWindow: boolean = false;

  constructor() {
    this.loadingMonitor = new LoadingMonitor(supabase, { 
      retryCount: 3,
      retryInterval: 1000,
      timeoutMs: INIT_TIMEOUT 
    } as MonitorConfig);
    this.loadingStrategy = new LoadingStrategy('AuthLoader');
    this.cacheStrategy = new CacheStrategy<AuthState>({
      ttl: 30 * 60 * 1000,
      maxEntries: 10,
      cleanupInterval: 5 * 60 * 1000
    });

    this.setupBroadcastChannel();
    this.isChildWindow = window.opener !== null;
  }

  private setupBroadcastChannel() {
    try {
      this.broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
      this.broadcastChannel.onmessage = (event) => {
        this.handleBroadcastMessage(event.data);
      };
    } catch (err) {
      logger.warn('BroadcastChannel not supported', { source: 'AuthLoader' });
    }
  }

  private handleBroadcastMessage(data: any) {
    if (data.type === 'AUTH_STATE_CHANGE' && data.windowId !== WINDOW_ID) {
      // Don't debounce state changes from other windows
      this.cacheStrategy.set(AUTH_CACHE_KEY, {
        ...data.state,
        timestamp: Date.now()
      });
      
      if (this.isChildWindow && data.state.lastAuthState === 'SIGNED_OUT') {
        // Prevent child windows from going into signed out state
        this.broadcastChannel?.postMessage({
          type: 'CHILD_WINDOW_ACTIVE',
          windowId: WINDOW_ID,
          timestamp: Date.now()
        });
      }
    }
  }

  public static getInstance(): AuthLoader {
    if (!AuthLoader.instance) {
      AuthLoader.instance = new AuthLoader();
    }
    return AuthLoader.instance;
  }

  private debounceStateChange(callback: () => void): void {
    const now = Date.now();
    if (this.stateChangeTimeout) {
      clearTimeout(this.stateChangeTimeout);
    }

    if (now - this.lastStateChange < STATE_DEBOUNCE_TIME) {
      this.stateChangeTimeout = setTimeout(callback, STATE_DEBOUNCE_TIME);
    } else {
      callback();
      this.lastStateChange = now;
    }
  }

  private broadcastStateChange(state: AuthState) {
    if (this.broadcastChannel) {
      this.broadcastChannel.postMessage({
        type: 'AUTH_STATE_CHANGE',
        windowId: WINDOW_ID,
        state: {
          ...state,
          windowId: WINDOW_ID,
          timestamp: Date.now()
        }
      });
    }
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
        logger.error(`Auth initialization failed: ${err instanceof Error ? err.message : String(err)}`, { source: 'AuthLoader' });
        const errorState = {
          initialized: false,
          lastAuthState: 'error',
          error: err instanceof Error ? err.message : String(err),
          windowId: WINDOW_ID,
          timestamp: Date.now()
        };
        this.cacheStrategy.set(AUTH_CACHE_KEY, errorState);
        this.broadcastStateChange(errorState);
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
      
      this.debounceStateChange(() => {
        const newState = session ? 'SIGNED_IN' : 'SIGNED_OUT';
        const cachedState = this.cacheStrategy.get(AUTH_CACHE_KEY);
        
        // Don't update to SIGNED_OUT state in child windows
        if (this.isChildWindow && newState === 'SIGNED_OUT') {
          logger.debug('Preventing SIGNED_OUT state in child window', { source: 'AuthLoader' });
          return;
        }
        
        // Only update state if it's different or not cached
        if (!cachedState || cachedState.lastAuthState !== newState) {
          const state = {
            initialized: true,
            lastAuthState: newState,
            error: undefined,
            windowId: WINDOW_ID,
            timestamp: Date.now()
          };
          
          this.cacheStrategy.set(AUTH_CACHE_KEY, state);
          this.broadcastStateChange(state);
          
          logger.info(`Auth state stabilized: ${newState}`, { source: 'AuthLoader' });
        }
        
        this.initialized = true;
      });

    } catch (err) {
      logger.error(`Auth initialization error: ${err instanceof Error ? err.message : String(err)}`, { source: 'AuthLoader' });
      throw err;
    }
  }

  public isInitialized(): boolean {
    return this.initialized;
  }

  public getLastAuthState(): string | null {
    const cachedState = this.cacheStrategy.get(AUTH_CACHE_KEY);
    return cachedState?.lastAuthState || null;
  }

  public clearAuthState(): void {
    this.cacheStrategy.clear();
    this.initialized = false;
    if (this.stateChangeTimeout) {
      clearTimeout(this.stateChangeTimeout);
    }
    if (this.broadcastChannel) {
      this.broadcastChannel.close();
    }
  }

  public isChildWindowSession(): boolean {
    return this.isChildWindow;
  }
}