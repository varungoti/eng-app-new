import { useState, useEffect } from 'react';
import { WidgetLoader } from '../lib/widgets/WidgetLoader';
import type { WidgetConfig, WidgetData } from '../lib/widgets/types';

export const useWidgets = (configs: WidgetConfig[]) => {
  const [widgetData, setWidgetData] = useState<Map<string, WidgetData>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadWidgets = async () => {
      try {
        setLoading(true);
        const loader = WidgetLoader.getInstance();
        const data = await loader.loadWidgets(configs);
        setWidgetData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load widgets');
      } finally {
        setLoading(false);
      }
    };

    loadWidgets();
  }, [configs]);

  return {
    widgetData,
    loading,
    error
  };
};