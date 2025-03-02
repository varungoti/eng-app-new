"use client";

import { ErrorSeverity } from './types';
import type { ErrorEvent, ErrorWatcherConfig } from './types';
//import type { MonitorConfig } from '../monitoring';
import { logger } from '../logger';
import { DEBUG_CONFIG } from '../config';

interface ErrorResolution {
  resolution: string;
  timestamp: number;
  attempts: number;
  resolved: boolean;
  resolvedAt?: number;
  aiSuggestion?: string;
  performanceImpact?: string;
  uiRecommendations?: string[];
}

interface ApplicationIndex {
  components: Set<string>;
  routes: Set<string>;
  apis: Set<string>;
  errorPatterns: Map<string, number>;
  performanceMetrics: Map<string, number[]>;
}

interface LoggerOptions {
  context?: Record<string, unknown>;
  source?: string;
}

export class ErrorResolver {
  private static instance: ErrorResolver;
  private resolvedErrors: Map<string, ErrorResolution> = new Map();
  private readonly MAX_RETRY_ATTEMPTS = 3;
  private readonly RETRY_DELAY = 1000;
  private consoleBuffer: string[] = [];
  private readonly CONSOLE_BUFFER_SIZE = 50;
  private applicationIndex: ApplicationIndex = {
    components: new Set(),
    routes: new Set(),
    apis: new Set(),
    errorPatterns: new Map(),
    performanceMetrics: new Map()
  };

  private constructor(_config?: ErrorWatcherConfig) {
    this.setupConsoleMonitoring();
    this.initializeApplicationIndex();
    this.interceptLogger();
  }

  public static getInstance(config?: ErrorWatcherConfig): ErrorResolver {
    if (!ErrorResolver.instance) {
      ErrorResolver.instance = new ErrorResolver(config);
    }
    return ErrorResolver.instance;
  }

  private interceptLogger() {
    // Intercept logger calls to track and resolve errors
    const originalError = logger.error;
    const originalWarn = logger.warn;
    const originalInfo = logger.info;

    logger.error = (message: string, options: LoggerOptions = {}) => {
      // Create an error event from logger call
      const errorEvent: ErrorEvent = {
        id: `error_${Date.now()}`,
        message,
        severity: ErrorSeverity.HIGH,
        timestamp: Date.now(),
        source: options.source || 'logger',
        context: options.context as Record<string, unknown>,
        componentStack: options.context?.componentStack as string | undefined
      };

      // Attempt to resolve the error
      this.resolveError(errorEvent).catch(err => {
        console.error('Failed to resolve error:', err);
      });

      // Call original logger
      originalError.call(logger, message, options);
    };

    logger.warn = (message: string, options: LoggerOptions = {}) => {
      const errorEvent: ErrorEvent = {
        id: `warn_${Date.now()}`,
        message,
        severity: ErrorSeverity.MEDIUM,
        timestamp: Date.now(),
        source: options.source || 'logger',
        context: options.context as Record<string, unknown>
      };

      this.resolveError(errorEvent).catch(err => {
        console.error('Failed to resolve warning:', err);
      });

      originalWarn.call(logger, message, options);
    };

    logger.info = (message: string, options: LoggerOptions = {}) => {
      // Only track info messages that indicate errors/issues
      if (message.toLowerCase().includes('error') || message.toLowerCase().includes('fail')) {
        const errorEvent: ErrorEvent = {
          id: `info_${Date.now()}`,
          message,
          severity: ErrorSeverity.LOW,
          timestamp: Date.now(),
          source: options.source || 'logger',
          context: options.context as Record<string, unknown>
        };

        this.resolveError(errorEvent).catch(err => {
          console.error('Failed to resolve info:', err);
        });
      }

      originalInfo.call(logger, message, options);
    };
  }

  // Rest of the class implementation remains the same...
  // (keeping all other methods unchanged)

  private initializeApplicationIndex() {
    if (typeof window === 'undefined') return;

    // Index React components from error stacks
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node instanceof HTMLElement) {
            const componentName = node.getAttribute('data-component');
            if (componentName) {
              this.applicationIndex.components.add(componentName);
            }
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Monitor route changes
    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', () => {
        this.applicationIndex.routes.add(window.location.pathname);
      });
    }

    // Track API endpoints
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const url = typeof args[0] === 'string' ? args[0] : (args[0] as Request).url;
      this.applicationIndex.apis.add(url);
      return originalFetch.apply(window, args);
    };
  }

  private setupConsoleMonitoring() {
    // eslint-disable-next-line no-console
    if (typeof window === 'undefined') return;

    // eslint-disable-next-line no-console
    const originalConsoleError = console.error;
    // eslint-disable-next-line no-console
    const originalConsoleWarn = console.warn;
    // eslint-disable-next-line no-console
    const originalConsoleInfo = console.info;

    // eslint-disable-next-line no-console
    console.error = (...args) => {
      this.handleConsoleLog('error', args);
      originalConsoleError.apply(console, args);
    };

    // eslint-disable-next-line no-console
    console.warn = (...args) => {
      this.handleConsoleLog('warning', args);
      originalConsoleWarn.apply(console, args);
    };

    // eslint-disable-next-line no-console
    console.info = (...args) => {
      this.handleConsoleLog('info', args);
      originalConsoleInfo.apply(console, args);
    };

    // Performance monitoring
    if ('PerformanceObserver' in window) {
      const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'largest-contentful-paint' || 
              entry.entryType === 'first-input' || 
              entry.entryType === 'layout-shift') {
            const metrics = this.applicationIndex.performanceMetrics.get(entry.entryType) || [];
            metrics.push(entry.startTime);
            this.applicationIndex.performanceMetrics.set(entry.entryType, metrics);
          }
        }
      });

      perfObserver.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    }
  }

  private handleConsoleLog(level: 'error' | 'warning' | 'info', args: (string | number | boolean | null | undefined | Error | object)[]) {
    const logMessage = args.map(arg => 
      arg instanceof Error ? `${arg.name}: ${arg.message}\n${arg.stack}` : String(arg)
    ).join(' ');

    this.consoleBuffer.push(`[${level.toUpperCase()}] ${logMessage}`);
    if (this.consoleBuffer.length > this.CONSOLE_BUFFER_SIZE) {
      this.consoleBuffer.shift();
    }

    // Track error patterns
    if (level === 'error') {
      const count = this.applicationIndex.errorPatterns.get(logMessage) || 0;
      this.applicationIndex.errorPatterns.set(logMessage, count + 1);
      this.analyzeErrorAndSuggestFix(logMessage);
    }
  }

  private async analyzeErrorAndSuggestFix(errorMessage: string): Promise<string> {
    try {
      const errorPatterns = new Map([
        ['undefined is not a function', {
          fix: 'Check if the function exists and is properly imported/defined',
          performance: 'Consider lazy loading functions that are not immediately needed',
          ui: ['Add loading states while functions are being initialized']
        }],
        ['Cannot read property', {
          fix: 'Implement proper null checking with optional chaining (?.) or nullish coalescing (??)',
          performance: 'Implement proper data prefetching to avoid undefined states',
          ui: ['Add skeleton loaders while data is being fetched']
        }],
        ['Maximum update depth exceeded', {
          fix: 'Check for infinite loops in useEffect or state updates',
          performance: 'Optimize render cycles by using useMemo or useCallback',
          ui: ['Implement proper loading states during heavy operations']
        }],
        ['Failed to fetch', {
          fix: 'Implement proper error boundaries and retry mechanisms',
          performance: 'Consider implementing a caching strategy',
          ui: ['Add offline support', 'Implement retry buttons in error states']
        }]
      ]);

      let suggestion = 'Unable to determine resolution';
      let _performanceImpact = '';
      const uiRecommendations: string[] = [];

      for (const [pattern, solutions] of errorPatterns) {
        if (errorMessage.includes(pattern)) {
          suggestion = solutions.fix;
          _performanceImpact = solutions.performance;
          uiRecommendations.push(...solutions.ui);
          break;
        }
      }

      if (DEBUG_CONFIG.enabled) {
        logger.info(`AI Error Analysis: ${errorMessage}`, { source: 'ErrorResolver' });
      }

      return suggestion;
    } catch (err) {
      logger.error(`Error in AI analysis: ${err instanceof Error ? err.message : 'Unknown error'}`, { source: 'ErrorResolver' });
      return 'Error analysis failed';
    }
  }

  public async resolveError(error: ErrorEvent, resolution?: string): Promise<void> {
    try {
      const aiSuggestion = await this.analyzeErrorAndSuggestFix(error.message);
      
      const errorResolution: ErrorResolution = {
        resolution: resolution || 'Auto-resolution attempted',
        timestamp: Date.now(),
        attempts: 0,
        resolved: false,
        aiSuggestion,
        performanceImpact: this.analyzePerformanceImpact(error),
        uiRecommendations: this.generateUIRecommendations(error)
      };

      if (error.severity === ErrorSeverity.CRITICAL) {
        await this.handleCriticalError(error, errorResolution);
      } else {
        await this.handleNormalError(error, errorResolution);
      }

      this.resolvedErrors.set(error.id, {
        ...errorResolution,
        resolved: true,
        resolvedAt: Date.now()
      });

      logger.info(`Error resolved: ${error.id} - ${errorResolution.resolution}`, { source: 'ErrorResolver' });

    } catch (err) {
      logger.error(`Failed to resolve error: ${err instanceof Error ? err.message : 'Unknown error'}`, { source: 'ErrorResolver' });
      throw err;
    }
  }

  private analyzePerformanceImpact(_error: ErrorEvent): string {
    const metrics = Array.from(this.applicationIndex.performanceMetrics.entries());
    const highImpactThreshold = 1000; // 1 second

    for (const [metric, values] of metrics) {
      const average = values.reduce((a, b) => a + b, 0) / values.length;
      if (average > highImpactThreshold) {
        return `High ${metric} detected (${average.toFixed(2)}ms). Consider optimization.`;
      }
    }
    return 'No significant performance impact detected';
  }

  private generateUIRecommendations(error: ErrorEvent): string[] {
    const recommendations: string[] = [];
    
    if (error.componentStack) {
      recommendations.push('Implement error boundaries for graceful degradation');
      recommendations.push('Add retry mechanisms for failed operations');
    }

    if (error.endpoint) {
      recommendations.push('Add loading states for async operations');
      recommendations.push('Implement offline support');
    }

    return recommendations;
  }

  private async handleCriticalError(error: ErrorEvent, _resolution: ErrorResolution): Promise<void> {
    logger.warn(`Critical error detected: ${error.message}`, { source: 'ErrorResolver' });

    let attempts = 0;
    while (attempts < this.MAX_RETRY_ATTEMPTS) {
      try {
        await this.attemptErrorRecovery(error);
        break;
      } catch (_err) {
        attempts++;
        if (attempts === this.MAX_RETRY_ATTEMPTS) {
          throw new Error(`Failed to resolve critical error after ${attempts} attempts`);
        }
        await new Promise(resolve => setTimeout(resolve, this.RETRY_DELAY * attempts));
      }
    }
  }

  private async handleNormalError(error: ErrorEvent, _resolution: ErrorResolution): Promise<void> {
    if (error.retryCount && error.retryCount > 0) {
      await this.attemptErrorRecovery(error);
    }
  }

  private async attemptErrorRecovery(error: ErrorEvent): Promise<void> {
    if (error.endpoint) {
      await this.retryNetworkRequest(error);
    } else if (error.componentStack) {
      this.handleComponentError(error);
    }
  }

  private async retryNetworkRequest(error: ErrorEvent): Promise<void> {
    if (error.endpoint) {
      try {
        const response = await fetch(error.endpoint);
        if (!response.ok) throw new Error(`Network request failed: ${response.status}`);
      } catch (err) {
        throw new Error(`Failed to retry network request: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    }
  }

  private handleComponentError(error: ErrorEvent): void {
    if (error.componentStack) {
      logger.warn(`Component error detected: ${error.message}`, { source: 'ErrorResolver' });
    }
  }

  public getApplicationInsights(): ApplicationIndex {
    return this.applicationIndex;
  }

  public isResolved(errorId: string): boolean {
    return this.resolvedErrors.has(errorId);
  }

  public getResolution(errorId: string): ErrorResolution | undefined {
    return this.resolvedErrors.get(errorId);
  }

  public clearResolutions(): void {
    this.resolvedErrors.clear();
    this.consoleBuffer = [];
  }
}

export const errorResolver = ErrorResolver.getInstance();