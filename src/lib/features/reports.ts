// Reports feature implementation
import { reportGenerator } from '../reports/ReportGenerator';

export interface ReportFeature {
  generateReport: (reportType: string, params: any) => Promise<string>;
  getReportStatus: (reportId: string) => Promise<string>;
}

export const reportsFeature: ReportFeature = {
  generateReport: async (reportType, params) => {
    return reportGenerator.generateReport({
      type: reportType as any,
      dateRange: params.dateRange,
      filters: params.filters,
      format: params.format || 'pdf'
    });
  },
  
  getReportStatus: async (reportId) => {
    const report = await reportGenerator.getReport(reportId);
    return report?.status || 'not_found';
  }
}; 