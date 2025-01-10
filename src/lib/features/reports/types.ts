export interface ReportConfig {
  type: 'sales' | 'academic' | 'financial' | 'attendance';
  dateRange: {
    start: Date;
    end: Date;
  };
  filters?: Record<string, any>;
  format: 'pdf' | 'excel' | 'csv';
}

export interface Report {
  id: string;
  type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  url?: string;
  createdAt: Date;
}

export interface ReportSchedule {
  id: string;
  config: ReportConfig;
  schedule: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    timezone: string;
    recipients: string[];
  };
  nextRun: Date;
  status: 'active' | 'paused';
}