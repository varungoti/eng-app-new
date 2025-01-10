import { supabase } from '../../supabase';
import type { Widget, WidgetConfig, WidgetData } from '../types';

export class ChartWidget implements Widget {
  async fetchData(config: WidgetConfig): Promise<WidgetData> {
    const { data, error } = await supabase
      .from(config.config.table)
      .select(config.config.columns.join(','))
      .order(config.config.orderBy || 'created_at');

    return {
      id: config.id,
      type: 'chart',
      data: error ? null : data,
      error: error?.message
    };
  }
}