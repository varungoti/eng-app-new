import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../supabase';
import type { MonitoringConfig, DataLoadMetrics } from './types';

interface LoadMetric {
  duration: number;
  operation: string;
  source: string;
  success: boolean;
}

interface AggregateMetrics {
  recordCount: number;
  averageDuration: number;
  errorCount: number;
}

export class DataLoadMonitor {
  private client: SupabaseClient;
  private metrics: LoadMetric[] = [];
  private aggregateMetrics: AggregateMetrics = {
    recordCount: 0,
    averageDuration: 0,
    errorCount: 0
  };

  private loads: Map<string, { 
    startTime: number;
    source: string;
    operation: string;
    queryKey?: string[];
  }> = new Map();

  constructor(
    private config: MonitoringConfig
  ) {
    this.client = supabase;
  }

  async recordDataLoad(table: string, records: number, duration: number, success: boolean) {
    try {
      this.aggregateMetrics.recordCount += records;
      this.aggregateMetrics.averageDuration = (this.aggregateMetrics.averageDuration + duration) / 2;
      
      if (!success) {
        this.aggregateMetrics.errorCount++;
      }

      if (this.config.enableLogging) {
        console.log(`Data load: ${table}, Records: ${records}, Duration: ${duration}ms`);
      }
    } catch (error) {
      console.warn('Failed to record data load:', error);
    }
  }

  getMetrics(): LoadMetric[] {
    return this.metrics;
  }

  startLoad(source: string, operation: string, queryKey?: string[]): string {
    const loadId = crypto.randomUUID();
    this.loads.set(loadId, {
      startTime: Date.now(),
      source,
      operation,
      queryKey
    });
    return loadId;
  }

  endLoad(loadId: string, success: boolean): void {
    const load = this.loads.get(loadId);
    if (load) {
      const duration = Date.now() - load.startTime;
      this.loads.delete(loadId);
      this.metrics.push({
        duration,
        operation: load.operation,
        source: load.source,
        success
      });
    }
  }
}