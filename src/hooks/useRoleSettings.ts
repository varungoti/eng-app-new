import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';

export interface RoleSettings {
  defaultView: string;
  notifications: {
    email: boolean;
    push: boolean;
    systemAlerts?: boolean;
    [key: string]: boolean | undefined;
  };
  reports: string[];
  dashboardConfig: {
    quickStats: string[];
    charts: string[];
    recentActivities: boolean;
    notifications: boolean;
    [key: string]: any;
  };
  testData?: Record<string, any>;
}

export const useRoleSettings = (role: string) => {
  const [settings, setSettings] = useState<RoleSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error: fetchError } = await supabase
          .from('role_settings')
          .select('settings')
          .eq('role_key', role)
          .maybeSingle(); // Use maybeSingle() instead of single()

        if (fetchError) {
          throw fetchError;
        }

        const defaultSettings: RoleSettings = {
          defaultView: 'dashboard',
          notifications: { email: true, push: true },
          reports: [],
          dashboardConfig: {
            quickStats: [],
            charts: [],
            recentActivities: true,
            notifications: true
          }
        };

        setSettings(data?.settings || defaultSettings);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load role settings';
        logger.error(message, {
          context: { error: err, role },
          source: 'useRoleSettings'
        });
        setError(message);
        // Set default settings even on error
        setSettings({
          defaultView: 'dashboard',
          notifications: { email: true, push: true },
          reports: [],
          dashboardConfig: {
            quickStats: [],
            charts: [],
            recentActivities: true,
            notifications: true
          }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [role]);

  return { settings, loading, error };
};

// Add default settings type and value
interface DefaultSettings {
  // Add your default settings structure here
  canManageUsers?: boolean;
  canManageRoles?: boolean;
  // ... other settings
}

const defaultSettings: DefaultSettings = {
  canManageUsers: false,
  canManageRoles: false,
  // ... other default settings
};