import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useCache } from './useCache';
import { useAuth } from './useAuth';
import { measurePerformance } from '../lib/utils/performance';
import type { CustomNotification } from '../types/notifications';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<CustomNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { cache } = useCache();

  const CACHE_TTL = 60 * 1000; // 1 minute
  const CACHE_KEY = 'notifications';

  const fetchNotifications = useCallback(async () => {
    try {
      if (!user) return;

      const endMetric = measurePerformance('fetchNotifications');
      setLoading(true);
      
      // Check cache first
      const cachedNotifications = cache.get<CustomNotification[]>(CACHE_KEY);
      if (cachedNotifications) {
        setNotifications(cachedNotifications);
        endMetric();
        setLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      const mappedNotifications = (data || []).map((n: any) => ({
        id: n.id,
        userId: n.user_id,
        type: n.type,
        title: n.title,
        message: n.message,
        read: n.read,
        createdAt: new Date(n.created_at)
      }));

      setNotifications(mappedNotifications as CustomNotification[]);
      cache.set(CACHE_KEY, mappedNotifications, CACHE_TTL);
      endMetric();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [cache, user]);

  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    // Subscribe to notifications changes
    const subscription = supabase
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
          fetchNotifications();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchNotifications, user]);

  const markAsRead = async (id: string) => {
    try {
      const { error: updateError } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);

      if (updateError) throw updateError;
      
      await fetchNotifications();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
    }
  };

  return {
    notifications,
    loading,
    error,
    markAsRead,
    unreadCount: notifications.filter((n: any) => !n.read).length
  };
};