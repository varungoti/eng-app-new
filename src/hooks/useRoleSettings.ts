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

        // Use default settings if no role
        if (!role) {
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
          setLoading(false);
          return;
        }

        // Add retry logic for fetch failures
        let attempts = 0;
        const maxAttempts = 3;

        while (attempts < maxAttempts) {
          try {
            const { data, error: fetchError } = await supabase
              .from('role_settings')
              .select('settings')
              .eq('role_key', role)
              .single();

            if (fetchError) throw fetchError;

            if (data?.settings) {
              setSettings(data.settings as RoleSettings);
              break; // Success - exit retry loop
            } else {
              logger.warn('No settings found for role', {
                context: { role },
                source: 'useRoleSettings'
              });
              // Use default settings instead of throwing error
              setSettings({
                defaultView: 'dashboard',
                notifications: {
                  email: true,
                  push: true
                },
                reports: [],
                dashboardConfig: {
                  quickStats: [],
                  charts: [],
                  recentActivities: true,
                  notifications: true
                }
              });
              break;
            }
          } catch (err) {
            attempts++;
            if (attempts === maxAttempts) throw err;
            // Exponential backoff
            await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempts), 5000)));
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load role settings';
        setError(message);
        logger.error(message, {
          context: { error: err, role },
          source: 'useRoleSettings'
        });
        // Set default settings on error
        setSettings({
          defaultView: 'dashboard',
          notifications: {
            email: true,
            push: true
          },
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

  return {
    settings,
    loading,
    error
  };
};