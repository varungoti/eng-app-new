import { monitors } from '../lib/monitoring';

export function useDataFlow() {
  const recordOperation = async (operation: string, duration: number, success: boolean) => {
    await monitors.dataFlowMonitor.recordOperation(operation, duration, success);
  };

  return { recordOperation };
} 