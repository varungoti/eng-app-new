import { ErrorEvent, ErrorResolution, ErrorWatcherConfig } from './types';
import { logger } from '../logger';

export class ErrorResolver {
  private config: Required<ErrorWatcherConfig>;

  constructor(config: Required<ErrorWatcherConfig>) {
    this.config = config;
  }

  public async attemptResolution(error: ErrorEvent): Promise<ErrorResolution | null> {
    const resolutionId = crypto.randomUUID();
    let attempts = 0;

    while (attempts < this.config.retryAttempts) {
      try {
        const resolution = await this.resolveError(error);
        return {
          id: resolutionId,
          errorId: error.id,
          action: resolution.action,
          timestamp: Date.now(),
          successful: true,
          details: resolution.details,
        };
      } catch (err) {
        attempts++;
        if (attempts < this.config.retryAttempts) {
          await this.delay(this.config.retryDelay * attempts);
        }
      }
    }

    return {
      id: resolutionId,
      errorId: error.id,
      action: 'max_retries_exceeded',
      timestamp: Date.now(),
      successful: false,
      details: `Failed after ${attempts} attempts`,
    };
  }

  private async resolveError(error: ErrorEvent): Promise<{ action: string; details: string }> {
    switch (error.severity) {
      case 'fatal':
        return this.resolveFatalError(error);
      case 'error':
        return this.resolveStandardError(error);
      case 'warning':
        return this.resolveWarning(error);
      default:
        return { action: 'logged', details: 'Error logged without resolution' };
    }
  }

  private async resolveFatalError(error: ErrorEvent): Promise<{ action: string; details: string }> {
    logger.error('Fatal error detected', {
      context: { error },
      source: 'ErrorResolver'
    });

    if (this.config.router) {
      this.config.router.push('/error');
      return { 
        action: 'redirected_to_error_page',
        details: 'User redirected to error page'
      };
    }

    return {
      action: 'fatal_error_logged',
      details: 'Fatal error logged without redirect'
    };
  }

  private async resolveStandardError(error: ErrorEvent): Promise<{ action: string; details: string }> {
    // Handle network errors
    if (error.message.toLowerCase().includes('network') || 
        error.message.toLowerCase().includes('failed to fetch')) {
      return {
        action: 'retry_request',
        details: 'Network request will be retried'
      };
    }

    // Handle auth errors
    if (error.message.toLowerCase().includes('auth') || 
        error.message.toLowerCase().includes('unauthorized') ||
        error.message.toLowerCase().includes('unauthenticated')) {
      window.location.href = '/login';
      return {
        action: 'redirected_to_login',
        details: 'User redirected to login page'
      };
    }

    // Handle component errors
    if (error.componentStack) {
      return {
        action: 'component_error_logged',
        details: 'Component error boundary caught error'
      };
    }

    return {
      action: 'standard_error_logged',
      details: 'Standard error logged without specific resolution'
    };
  }

  private async resolveWarning(_error: ErrorEvent): Promise<{ action: string; details: string }> {
    return {
      action: 'warning_logged',
      details: 'Warning logged for monitoring'
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}