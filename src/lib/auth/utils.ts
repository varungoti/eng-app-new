import { supabase } from '../supabase';
import { logger } from '../logger';
import type { UserRole } from '../../types/roles';

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

export const signIn = async (email: string, password: string, role?: string) => {
  try {
    const { data: { session }, error } = await supabase.auth.signInWithPassword({ 
      email,
      password
    }); 

    if (error) throw new AuthError(error.message, error.code);
    if (!session) throw new AuthError('No session created');

    // Set initial role if provided
    if (role) {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { role }
      });

      if (updateError) throw new AuthError('Failed to set initial role', updateError.code);
    }

    logger.info('Sign in successful', {
      context: { email, role },
      source: 'Auth'
    });
    
    return { session };
  } catch (err) {
    logger.error('Sign in failed', {
      context: { error: err },
      source: 'Auth'
    });
    throw err;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    logger.info('Sign out successful', {
      source: 'Auth'
    });
  } catch (err) {
    logger.error('Sign out failed', {
      context: { error: err },
      source: 'Auth'
    });
    throw err;
  }
};

export const getCurrentSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw new AuthError(error.message, error.code);
    return session;
  } catch (err) {
    logger.error('Failed to get current session', {
      context: { error: err },
      source: 'Auth'
    });
    return null;
  }
};