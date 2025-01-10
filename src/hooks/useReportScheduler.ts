import { useState } from 'react';
import { reportScheduler } from '../lib/features/reports/ReportScheduler';
import type { ReportConfig, ReportSchedule } from '../lib/features/reports/types';
import { useToast } from './useToast';

export const useReportScheduler = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const scheduleReport = async (
    config: ReportConfig,
    schedule: ReportSchedule['schedule']
  ) => {
    try {
      setLoading(true);
      setError(null);
      const scheduleId = await reportScheduler.scheduleReport(config, schedule);
      showToast('Report scheduled successfully', { type: 'success' });
      return scheduleId;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to schedule report';
      setError(message);
      showToast(message, { type: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (id: string, updates: Partial<ReportConfig>) => {
    try {
      setLoading(true);
      setError(null);
      await reportScheduler.updateSchedule(id, updates);
      showToast('Schedule updated successfully', { type: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update schedule';
      setError(message);
      showToast(message, { type: 'error' });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSchedule = async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await reportScheduler.deleteSchedule(id);
      showToast('Schedule deleted successfully', { type: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete schedule';
      setError(message);
      showToast(message, { type: 'error' });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    scheduleReport,
    updateSchedule,
    deleteSchedule,
    loading,
    error
  };
};