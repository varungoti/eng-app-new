import { supabase } from '../supabase';
import { sessionMonitor } from './SessionMonitor';
import { logger } from '../logger';
import { errorTracker } from '../errorTracker';
import type { UserRole } from '../../types/roles';

export class AuthError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'AuthError';
  }
}

// Add session persistence helper
const STORAGE_KEY = 'sb-session-persist';

const persistSession = async (session: any) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        timestamp: Date.now(),
        session
      }));
    }
  } catch (err) {
    logger.error('Failed to persist session', { source: 'AuthUtils' });
  }
};

const getPersistedSession = () => {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const { timestamp, session } = JSON.parse(stored);
        // Check if session is less than 1 hour old
        if (Date.now() - timestamp < 60 * 60 * 1000) {
          return session;
        }
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    return null;
  } catch (err) {
    logger.error('Failed to get persisted session', { source: 'AuthUtils' });
    return null;
  }
};

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

    // Persist session
    await persistSession(session);

    logger.info(`Sign in successful for ${email} with role ${role}`, { source: 'AuthUtils' });
    return { session };

  } catch (err) {
    logger.error(`Sign in failed: ${err instanceof Error ? err.message : String(err)}`, { source: 'AuthUtils' });
    throw err;
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    // Clear persisted session
    localStorage.removeItem(STORAGE_KEY);
    
    logger.info('Sign out successful', { source: 'AuthUtils' });

  } catch (err) {
    logger.error(`Sign out failed: ${err instanceof Error ? err.message : String(err)}`, { source: 'Auth' });
    throw err;
  }
};

export const getCurrentSession = async () => {
  try {
    // First try to get current session
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) throw new AuthError(error.message, error.code);
    
    if (session) {
      await persistSession(session);
      return session;
    }

    // If no session, try to get persisted session
    const persistedSession = getPersistedSession();
    if (persistedSession) {
      // Validate persisted session
      const { data: { session: refreshedSession }, error: refreshError } = 
        await supabase.auth.refreshSession();

      if (!refreshError && refreshedSession) {
        await persistSession(refreshedSession);
        return refreshedSession;
      }
    }

    return null;
  } catch (err) {
    logger.error(`Failed to get current session: ${err instanceof Error ? err.message : String(err)}`, { source: 'AuthUtils' });
    return null;
  }
};

export async function updateUserRole(userId: string, newRole: string) {
  try {
    // Log the attempt
    logger.info(`Attempting role update for user ${userId} to ${newRole}`, { source: 'auth.utils' });

    const { error } = await supabase.auth.admin.updateUserById(
      userId,
      { user_metadata: { role: newRole } }
    );

    if (error) throw error;

    // Force session refresh
    await supabase.auth.refreshSession();
    
    // Verify role update
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.user?.role !== newRole) {
      throw new Error('Role update verification failed');
    }

    return true;
  } catch (err) {
    errorTracker.trackError({
      message: 'Role update failed',
      severity: 'error',
      context: { userId, newRole, error: err },
      source: 'auth.utils'
    });
    throw err;
  }
}
export { getPersistedSession,  persistSession };