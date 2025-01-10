import { AuthLoader } from './AuthLoader';
import { InitializationStrategy } from './strategies/InitializationStrategy';
import { LoadingStrategy } from './strategies/LoadingStrategy';
import { RetryStrategy } from './strategies/RetryStrategy';
import { CacheStrategy } from './strategies/CacheStrategy';
import { SessionLoader } from './strategies/SessionLoader';
import { ProgressiveLoader } from './strategies/ProgressiveLoader';

// Export singleton instance
export const authLoader = AuthLoader.getInstance();

// Export types and classes
export {
  AuthLoader,
  InitializationStrategy,
  LoadingStrategy,
  RetryStrategy,
  CacheStrategy,
  SessionLoader,
  ProgressiveLoader
};

// Export auth utilities
export * from './utils';