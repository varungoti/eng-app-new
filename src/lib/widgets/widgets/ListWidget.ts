import { supabase } from '../../supabase';
import type { Widget, WidgetConfig, WidgetData } from '../types';

export class ListWidget implements Widget {
  async fetchData(config: WidgetConfig): Promise<WidgetData> {
    const { data, error } = await supabase
      .from(config.config.table)
      .select(config.config.columns.join(','))
      .order(config.config.orderBy || 'created_at')
      .limit(config.config.limit || 10);

    return {
      id: config.id,
      type: 'list',
      data: error ? null : data,
      error: error?.message
    };
  }
}