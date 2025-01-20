import { monitors } from '../lib/monitoring';

export function useDataLoad() {
  const recordLoad = async (table: string, records: number, duration: number, success: boolean) => {
    await monitors.dataLoadMonitor.recordDataLoad(table, records, duration, success);
  };

  return { recordLoad };
} 