import { supabase } from '../../supabase';
import type { Widget, WidgetConfig, WidgetData } from '../types';

export class StatsWidget implements Widget {
  async fetchData(config: WidgetConfig): Promise<WidgetData> {
    const { data, error } = await supabase
      .from(config.config.table)
      .select('count')
      .single();

    return {
      id: config.id,
      type: 'stats',
      data: error ? null : data,
      error: error?.message
    };
  }
}