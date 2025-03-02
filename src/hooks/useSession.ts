import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface UseSessionReturn {
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

export const useSession = (): UseSessionReturn => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession()
      .then(({ data: { session }, error }) => {
        if (error) {
          setError(error);
        } else {
          setSession(session);
        }
        setLoading(false);
      });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { session, loading, error };
}; 