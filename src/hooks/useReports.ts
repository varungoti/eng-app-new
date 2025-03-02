import { useState } from 'react';
import { reportGenerator, ReportConfig, Report } from '../lib/reports/ReportGenerator';
import { useToast } from './useToast';

export const useReports = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const generateReport = async (config: ReportConfig) => {
    try {
      setLoading(true);
      setError(null);
      const reportId = await reportGenerator.generateReport(config);
      showToast('Report generation started', { type: 'success' });
      return reportId;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate report';
      setError(message);
      showToast(message, { type: 'error' });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getReport = async (reportId: string): Promise<Report | null> => {
    try {
      setError(null);
      return await reportGenerator.getReport(reportId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get report';
      setError(message);
      showToast(message, { type: 'error' });
      return null;
    }
  };

  return {
    generateReport,
    getReport,
    loading,
    error
  };
};