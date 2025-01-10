import { ErrorTracker } from './ErrorTracker';
import type { ErrorSeverity } from './types';

interface NetworkError {
  message: string;
  endpoint?: string;
  statusCode?: number;
  timestamp: number;
  retryCount: number;
}

class NetworkHandler {
  private static instance: NetworkHandler;
  private errorTracker: ErrorTracker;
  private maxRetries = 3;
  private retryDelay = 1000;
  private networkErrors: Map<string, NetworkError> = new Map();

  private constructor() {
    this.errorTracker = ErrorTracker.getInstance();
    this.setupFetchInterceptor();
  }

  public static getInstance(): NetworkHandler {
    if (!NetworkHandler.instance) {
      NetworkHandler.instance = new NetworkHandler();
    }
    return NetworkHandler.instance;
  }

  private setupFetchInterceptor() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = typeof args[0] === 'string' ? args[0] : args[0].url;
      const options = args[1] || {};

      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          await this.handleNetworkError(response, url);
          // Only throw for non-Supabase requests or if throwOnError is set
          if (!url.includes(import.meta.env.VITE_SUPABASE_URL) || options.throwOnError) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
        }
        return response;
      } catch (error) {
        await this.handleNetworkError(error, url);
        throw error;
      }
    };
  }

  private async handleNetworkError(error: any, endpoint: string) {
    const existingError = this.networkErrors.get(endpoint);
    const retryCount = (existingError?.retryCount || 0) + 1;
    const statusCode = error instanceof Response ? error.status : undefined;

    const networkError: NetworkError = {
      message: error instanceof Response ? `HTTP ${error.status}` : error.message,
      endpoint,
      statusCode,
      timestamp: Date.now(),
      retryCount
    };

    this.networkErrors.set(endpoint, networkError);
    this.trackError(networkError, statusCode);

    if (retryCount < this.maxRetries) {
      await this.retryRequest(endpoint, retryCount);
    }
  }

  private async retryRequest(endpoint: string, retryCount: number) {
    await new Promise(resolve => setTimeout(resolve, this.retryDelay * retryCount));
    try {
      const response = await fetch(endpoint);
      if (response.ok) {
        this.networkErrors.delete(endpoint);
      }
    } catch (error) {
      // Error will be handled by the interceptor
    }
  }

  private trackError(error: NetworkError, statusCode?: number) {
    const severity = statusCode && statusCode >= 500 ? 'error' : 'warning';

    this.errorTracker.trackError({
      message: `Failed to fetch data from API`,
      severity,
      source: 'NetworkRequest',
      context: {
        endpoint: error.endpoint,
        statusCode: error.statusCode,
        retryCount: error.retryCount,
        timestamp: error.timestamp,
        severity
      }
    });
  }

  public getErrors(): NetworkError[] {
    return Array.from(this.networkErrors.values());
  }

  public clearErrors() {
    this.networkErrors.clear();
  }
}

export const networkHandler = NetworkHandler.getInstance();