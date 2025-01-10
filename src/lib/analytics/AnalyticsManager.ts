import { supabase } from '../supabase';
import { logger } from '../logger';

export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  category: string;
  tags: Record<string, string>;
}

export interface AnalyticsQuery {
  metrics: string[];
  timeRange: {
    start: Date;
    end: Date;
  };
  interval?: 'hour' | 'day' | 'week' | 'month';
  filters?: Record<string, any>;
}

class AnalyticsManager {
  private static instance: AnalyticsManager;

  private constructor() {}

  public static getInstance(): AnalyticsManager {
    if (!AnalyticsManager.instance) {
      AnalyticsManager.instance = new AnalyticsManager();
    }
    return AnalyticsManager.instance;
  }

  public async trackMetric(metric: Omit<AnalyticsMetric, 'id' | 'timestamp'>): Promise<void> {
    try {
      const { error } = await supabase
        .from('analytics_metrics')
        .insert({
          name: metric.name,
          value: metric.value,
          unit: metric.unit,
          category: metric.category,
          tags: metric.tags
        });

      if (error) throw error;
    } catch (err) {
      logger.error('Failed to track metric', {
        context: { error: err, metric },
        source: 'AnalyticsManager'
      });
    }
  }

  public async queryMetrics(query: AnalyticsQuery): Promise<AnalyticsMetric[]> {
    try {
      let dbQuery = supabase
        .from('analytics_metrics')
        .select('*')
        .in('name', query.metrics)
        .gte('timestamp', query.timeRange.start.toISOString())
        .lte('timestamp', query.timeRange.end.toISOString());

      if (query.filters) {
        Object.entries(query.filters).forEach(([key, value]) => {
          dbQuery = dbQuery.eq(key, value);
        });
      }

      const { data, error } = await dbQuery;

      if (error) throw error;

      return data.map(m => ({
        id: m.id,
        name: m.name,
        value: m.value,
        unit: m.unit,
        timestamp: new Date(m.timestamp),
        category: m.category,
        tags: m.tags
      }));
    } catch (err) {
      logger.error('Failed to query metrics', {
        context: { error: err, query },
        source: 'AnalyticsManager'
      });
      return [];
    }
  }

  public async getInsights(category: string): Promise<Record<string, any>> {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

      const metrics = await this.queryMetrics({
        metrics: ['users', 'revenue', 'engagement'],
        timeRange: {
          start: thirtyDaysAgo,
          end: new Date()
        },
        interval: 'day',
        filters: { category }
      });

      return this.calculateInsights(metrics);
    } catch (err) {
      logger.error('Failed to get insights', {
        context: { error: err, category },
        source: 'AnalyticsManager'
      });
      return {};
    }
  }

  private calculateInsights(metrics: AnalyticsMetric[]): Record<string, any> {
    // Group metrics by name
    const groupedMetrics = metrics.reduce((acc, metric) => {
      if (!acc[metric.name]) acc[metric.name] = [];
      acc[metric.name].push(metric);
      return acc;
    }, {} as Record<string, AnalyticsMetric[]>);

    // Calculate insights for each metric
    const insights: Record<string, any> = {};
    
    Object.entries(groupedMetrics).forEach(([name, values]) => {
      const sortedValues = values.sort((a, b) => 
        a.timestamp.getTime() - b.timestamp.getTime()
      );

      const total = values.reduce((sum, m) => sum + m.value, 0);
      const average = total / values.length;
      const min = Math.min(...values.map(m => m.value));
      const max = Math.max(...values.map(m => m.value));
      
      // Calculate trend
      const firstValue = sortedValues[0].value;
      const lastValue = sortedValues[sortedValues.length - 1].value;
      const trend = ((lastValue - firstValue) / firstValue) * 100;

      insights[name] = {
        total,
        average,
        min,
        max,
        trend,
        unit: values[0].unit
      };
    });

    return insights;
  }
}

export const analyticsManager = AnalyticsManager.getInstance();