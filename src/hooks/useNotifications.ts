import { useCallback, useEffect, useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { useCache } from './useCache';
import { useAuth } from './useAuth';
import { measurePerformance } from '../lib/utils/performance';
//import type { CustomNotification } from '../types/notifications';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  createdAt: Date;
  read?: boolean;
}

// Define type for the raw database notification
interface DbNotification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  created_at: string;
  read: boolean;
  user_id: string;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY = 'notifications';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { cache } = useCache();
  const isMounted = useRef(true);
  const lastFetchTimeRef = useRef<number>(0);

  const fetchNotifications = useCallback(async () => {
    // Prevent multiple rapid fetches
    const now = Date.now();
    if (now - lastFetchTimeRef.current < 2000) return; // Debounce 2 seconds
    lastFetchTimeRef.current = now;

    try {
      if (!user || !isMounted.current) return;

      const endMetric = measurePerformance('fetchNotifications');
      setIsLoading(true);
      
      // Check cache first
      const cachedNotifications = cache.get<DbNotification[]>(CACHE_KEY);
      if (cachedNotifications) {
        setNotifications(cachedNotifications.map(n => ({
          id: n.id,
          message: n.message,
          type: n.type,
          createdAt: new Date(n.created_at),
          read: n.read
        })));
        endMetric();
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      if (isMounted.current) {
        const mappedNotifications = (data || []).map((n: DbNotification) => ({
          id: n.id,
          message: n.message,
          type: n.type,
          createdAt: new Date(n.created_at),
          read: n.read
        }));

        setNotifications(mappedNotifications);
        cache.set(CACHE_KEY, data, CACHE_TTL);
        setError(null);
      }
      
      endMetric();
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [cache, user]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    isMounted.current = true;
    
    if (user) {
      fetchNotifications();
    }

    let refreshInterval: NodeJS.Timeout | null = null;
    
    if (user) {
      // Set up interval for refreshing
      refreshInterval = setInterval(() => {
        if (isMounted.current && user) {
          fetchNotifications();
        }
      }, CACHE_TTL);
    }

    // Set up subscription only if we have a user
    let subscription: ReturnType<typeof supabase.channel> | null = null;
    if (user) {
      subscription = supabase
        .channel('notifications')
        .on(
          'postgres_changes',
          { 
            event: '*', 
            schema: 'public', 
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          },
          () => {
            if (isMounted.current) {
              fetchNotifications();
            }
          }
        )
        .subscribe();
    }

    return () => {
      isMounted.current = false;
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [fetchNotifications, user]); // Include fetchNotifications in dependencies

  const markAsRead = useCallback(async (id: string) => {
    try {
      if (!user) return;

      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (updateError) throw updateError;
      
      // Update local state to avoid refetching
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
    }
  }, [user]);

  return {
    notifications,
    isLoading,
    error,
    markAsRead,
    unreadCount: notifications.filter(n => !n.read).length,
    clearNotifications,
    refreshNotifications: fetchNotifications,
  };
};