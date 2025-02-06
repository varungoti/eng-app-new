import { supabase } from '../../supabase';
import { logger } from '../../logger';

export interface WidgetConfig {
  id: string;
  type: 'stats' | 'chart' | 'list';
  title: string;
  config: Record<string, any>;
  position: { x: number; y: number; w: number; h: number };
}

export interface Dashboard {
  id: string;
  userId: string;
  name: string;
  widgets: WidgetConfig[];
  isDefault: boolean;
}

class DashboardManager {
  private static instance: DashboardManager;
  private cache: Map<string, Dashboard> = new Map();

  private constructor() {}

  public static getInstance(): DashboardManager {
    if (!DashboardManager.instance) {
      DashboardManager.instance = new DashboardManager();
    }
    return DashboardManager.instance;
  }

  public async getDashboard(userId: string): Promise<Dashboard | null> {
    try {
      // Check cache first
      const cachedDashboard = this.cache.get(userId);
      if (cachedDashboard) {
        return cachedDashboard;
      }

      // Fetch dashboard from database
      const { data: dashboards, error: fetchError } = await supabase
        .from('dashboards')
        .select('*')
        .eq('user_id', userId)
        .eq('is_default', true);

      if (fetchError) throw fetchError;

      // If no dashboard exists, create a default one
      if (!dashboards || dashboards.length === 0) {
        return await this.createDefaultDashboard(userId);
      }

      const dashboard = this.mapDashboard(dashboards[0]);
      this.cache.set(userId, dashboard);
      return dashboard;
    } catch (err) {
      logger.error('Failed to get dashboard', {
        context: { error: err, userId },
        source: 'DashboardManager'
      });
      return null;
    }
  }

  private mapDashboard(data: any): Dashboard {
    return {
      id: data.id,
      userId: data.user_id,
      name: data.name,
      widgets: data.widgets || [],
      isDefault: data.is_default
    };
  }

  private async createDefaultDashboard(userId: string): Promise<Dashboard | null> {
    try {
      const { data, error } = await supabase
        .from('dashboards')
        .insert({
          user_id: userId,
          name: 'Default Dashboard',
          widgets: [],
          is_default: true
        })
        .select()
        .single();

      if (error) throw error;

      const dashboard = this.mapDashboard(data);
      this.cache.set(userId, dashboard);
      return dashboard;
    } catch (err) {
      logger.error('Failed to create default dashboard', {
        context: { error: err, userId },
        source: 'DashboardManager'
      });
      return null;
    }
  }

  public async saveDashboard(userId: string, dashboard: Omit<Dashboard, 'id'>): Promise<Dashboard | null> {
    try {
      const { data, error } = await supabase
        .from('dashboards')
        .upsert({
          user_id: userId,
          name: dashboard.name,
          widgets: dashboard.widgets,
          is_default: dashboard.isDefault
        })
        .select()
        .single();

      if (error) throw error;

      const savedDashboard = this.mapDashboard(data);
      this.cache.set(userId, savedDashboard);
      return savedDashboard;
    } catch (err) {
      logger.error('Failed to save dashboard', {
        context: { error: err, userId },
        source: 'DashboardManager'
      });
      return null;
    }
  }

  public clearCache(): void {
    this.cache.clear();
  }
}


export interface DashboardWidget {
  id: string;
  title: string;
  type: string;
  position: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
}

export const dashboardManager = DashboardManager.getInstance();