import { useEffect, useState } from 'react';
import { DatabaseMonitoringService } from '../../../src/lib/monitoring/services/DatabaseMonitoringService';
import type { DatabaseMetrics } from '../../../src/lib/monitoring/types';
import { Card } from '../../../src/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function DatabaseMonitor() {
  const [metrics, setMetrics] = useState<DatabaseMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const monitoringService = DatabaseMonitoringService.getInstance();
    let interval: NodeJS.Timeout;

    const fetchMetrics = async () => {
      const data = await monitoringService.getMetrics();
      setMetrics(data);
      setLoading(false);
    };

    // Initial fetch
    fetchMetrics();

    // Poll for updates
    interval = setInterval(fetchMetrics, 5000);

    return () => {
      clearInterval(interval);
      monitoringService.cleanup();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" />
        Initializing monitor...
      </div>
    );
  }

  return (
    <Card className="mt-4 p-4">
      <h4 className="text-sm font-medium mb-2">Database Metrics</h4>
      <div className="space-y-2 text-sm">
        <div>Status: {metrics?.connectionStatus}</div>
        <div>Response Time: {metrics?.responseTime}ms</div>
        <div>Error Count: {metrics?.errorCount}</div>
        <div>Last Check: {metrics?.lastCheckTime.toLocaleTimeString()}</div>
      </div>
    </Card>
  );
} 