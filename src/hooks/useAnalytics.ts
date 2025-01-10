import { useState } from 'react';
import { analyticsManager, AnalyticsMetric, AnalyticsQuery } from '../lib/analytics/AnalyticsManager';
import { useToast } from './useToast';

export const useAnalytics = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const trackMetric = async (metric: Omit<AnalyticsMetric, 'id' | 'timestamp'>) => {
    try {
      setLoading(true);
      setError(null);
      await analyticsManager.trackMetric(metric);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to track metric';
      setError(message);
      showToast(message, { type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const queryMetrics = async (query: AnalyticsQuery) => {
    try {
      setLoading(true);
      setError(null);
      return await analyticsManager.queryMetrics(query);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to query metrics';
      setError(message);
      showToast(message, { type: 'error' });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getInsights = async (category: string) => {
    try {
      setLoading(true);
      setError(null);
      return await analyticsManager.getInsights(category);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get insights';
      setError(message);
      showToast(message, { type: 'error' });
      return {};
    } finally {
      setLoading(false);
    }
  };

  return {
    trackMetric,
    queryMetrics,
    getInsights,
    loading,
    error
  };
};