import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'SCHOOL_LEADER' | 'SCHOOL_PRINCIPAL' | 'TEACHER' | 'STUDENT';
  schoolId: string | null;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        // Get the authenticated user
        const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;
        
        if (!authUser) {
          if (mounted) setUser(null);
          return;
        }

        // Get the user's profile data
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profileError) throw profileError;

        if (mounted) {
          setUser({
            id: profile.id,
            email: profile.email,
            name: profile.name,
            role: profile.role,
            schoolId: profile.school_id,
          });
        }
      } catch (err) {
        logger.error(`Failed to load user: ${err instanceof Error ? err.message : String(err)}`, {
          context: { error: err },
          source: 'useUser'
        });
        if (mounted) {
          setError(err instanceof Error ? err : new Error('Failed to load user'));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUser();

    // Subscribe to auth changes using the singleton instance
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      logger.debug(`Auth state changed: ${event}`, {
        context: { event },
        source: 'useUser'
      });
      if (mounted) await loadUser();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading, error };
} 