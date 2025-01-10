import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import { logger } from '../lib/logger';
import { useDataLoadTimeout } from './useDataLoadTimeout';

export interface Dashboard {
  id: string;
  userId: string;
  name: string;
  widgets: WidgetConfig[];
  isDefault: boolean;
}

export interface WidgetConfig {
  id: string;
  type: string;
  title: string;
  config: Record<string, any>;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export const useDashboard = () => {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { showToast } = useToast();
  const { clearTimeout } = useDataLoadTimeout({
    source: 'useDashboard',
    onTimeout: () => {
      setError('Failed to load dashboard');
      setLoading(false);
    }
  });

  useEffect(() => {
    const loadDashboard = async () => {
      if (!user) return;

      try {
        setLoading(true);
        setError(null);
        
        const { data, error: fetchError } = await supabase
          .from('dashboards')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_default', true);

        if (fetchError) throw fetchError;

        // Get the most recent default dashboard or create new one
        const defaultDashboard = data && data.length > 0 
          ? data[0] 
          : null;

        if (!defaultDashboard) {
          // Create default dashboard if none exists
          const { data: newDashboard, error: createError } = await supabase
            .from('dashboards')
            .insert({
              user_id: user.id,
              name: 'Default Dashboard',
              widgets: [],
              is_default: true
            })
            .select()
            .single();

          if (createError) throw createError;
          setDashboard(newDashboard);
        } else {
          setDashboard(defaultDashboard);
          
          // Clean up duplicate default dashboards if they exist
          if (data.length > 1) {
            const duplicateIds = data
              .slice(1)
              .map(d => d.id);
              
            await supabase
              .from('dashboards')
              .delete()
              .in('id', duplicateIds);
          }
        }

        clearTimeout();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load dashboard';
        setError(message);
        showToast(message, { type: 'error' });
        logger.error(message, {
          context: { error: err },
          source: 'useDashboard'
        });
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user, showToast, clearTimeout]);

  const saveDashboard = async (updates: Partial<Dashboard>): Promise<Dashboard | null> => {
    if (!user || !dashboard) return null;

    try {
      const { data, error } = await supabase
        .from('dashboards')
        .update({
          name: updates.name,
          widgets: updates.widgets,
          is_default: updates.isDefault
        })
        .eq('id', dashboard.id)
        .select()
        .single();

      if (error) throw error;

      setDashboard(data);
      showToast('Dashboard saved successfully', { type: 'success' });
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save dashboard';
      showToast(message, { type: 'error' });
      logger.error(message, {
        context: { error: err },
        source: 'useDashboard'
      });
      return null;
    }
  };

  return {
    dashboard,
    loading,
    error,
    saveDashboard
  };
};