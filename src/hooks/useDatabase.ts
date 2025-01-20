import { DatabaseMonitoringService } from '../lib/monitoring/services/DatabaseMonitoringService';

export function useDatabase() {
  const getHealth = async () => {
    const monitoringService = DatabaseMonitoringService.getInstance();
    return await monitoringService.getMetrics();
  };

  return { getHealth };
} 