import { AuthLoader } from './auth/AuthLoader';
import { signIn, signOut, getCurrentSession, AuthError } from './auth/utils';

// Export singleton instance
export const authLoader = AuthLoader.getInstance();

// Export auth utilities
export {
  signIn,
  signOut,
  getCurrentSession,
  AuthError
};

// Export types and classes
export type { UserRole } from '../types/roles';