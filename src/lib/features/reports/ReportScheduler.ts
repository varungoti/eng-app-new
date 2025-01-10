import { supabase } from '../../supabase';
import { logger } from '../../logger';
import type { ReportConfig } from './types';

export class ReportScheduler {
  private static instance: ReportScheduler;

  private constructor() {}

  public static getInstance(): ReportScheduler {
    if (!ReportScheduler.instance) {
      ReportScheduler.instance = new ReportScheduler();
    }
    return ReportScheduler.instance;
  }

  public async scheduleReport(config: ReportConfig, schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    timezone: string;
    recipients: string[];
  }): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('report_schedules')
        .insert({
          config,
          schedule,
          next_run: this.calculateNextRun(schedule),
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return data.id;
    } catch (err) {
      logger.error('Failed to schedule report', {
        context: { error: err, config, schedule },
        source: 'ReportScheduler'
      });
      throw err;
    }
  }

  private calculateNextRun(schedule: { frequency: string; time: string; timezone: string }): Date {
    const now = new Date();
    const [hours, minutes] = schedule.time.split(':').map(Number);
    const next = new Date(now);
    
    next.setHours(hours);
    next.setMinutes(minutes);
    next.setSeconds(0);
    next.setMilliseconds(0);

    if (next <= now) {
      switch (schedule.frequency) {
        case 'daily':
          next.setDate(next.getDate() + 1);
          break;
        case 'weekly':
          next.setDate(next.getDate() + 7);
          break;
        case 'monthly':
          next.setMonth(next.getMonth() + 1);
          break;
      }
    }

    return next;
  }

  public async updateSchedule(id: string, updates: Partial<ReportConfig>): Promise<void> {
    try {
      const { error } = await supabase
        .from('report_schedules')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      logger.error('Failed to update report schedule', {
        context: { error: err, id, updates },
        source: 'ReportScheduler'
      });
      throw err;
    }
  }

  public async deleteSchedule(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('report_schedules')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      logger.error('Failed to delete report schedule', {
        context: { error: err, id },
        source: 'ReportScheduler'
      });
      throw err;
    }
  }
}

export const reportScheduler = ReportScheduler.getInstance();