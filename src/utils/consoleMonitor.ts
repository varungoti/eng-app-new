import { ErrorResolver } from './errorResolver';
import { PerformanceMonitor } from './performanceMonitor';
import { DatabaseMonitor } from './databaseMonitor';
import { SessionMonitor } from './sessionMonitor';

interface CursorLog {
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: string;
  metadata: {
    performance?: any;
    database?: any;
    session?: any;
    stack?: string;
  };
}

export class ConsoleMonitor {
  private static instance: ConsoleMonitor;
  private originalConsole: any = {};
  private performanceMonitor!: PerformanceMonitor;
  private databaseMonitor!: DatabaseMonitor;
  private sessionMonitor!: SessionMonitor;
  private cursorLogs: CursorLog[] = [];

  private constructor() {
    this.initializeMonitors();
    this.setupPerformanceObserver();
    this.interceptConsoleMethods();
    this.interceptFetch();
    this.interceptXHR();
    this.startCursorSync();  // Start Cursor sync
  }

  private initializeMonitors() {
    this.performanceMonitor = new PerformanceMonitor();
    this.databaseMonitor = new DatabaseMonitor();
    this.sessionMonitor = new SessionMonitor();
  }

  private setupPerformanceObserver() {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        this.handlePerformanceEntry(entry);
      }
    });

    observer.observe({
      entryTypes: ['navigation', 'resource', 'paint', 'largest-contentful-paint', 'layout-shift']
    });
  }

  private interceptConsoleMethods() {
    this.originalConsole = {
      log: console.log,
      error: console.error,
      warn: console.warn
    };

    console.log = (...args) => this.handleLog('log', ...args);
    console.error = (...args) => this.handleLog('error', ...args);
    console.warn = (...args) => this.handleLog('warn', ...args);
  }

  private interceptFetch() {
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      try {
        const response = await originalFetch(...args);
        this.logAPICall(args[0].toString(), 'fetch', startTime, response.status);
        return response;
      } catch (error) {
        this.logAPIError(args[0].toString(), 'fetch', error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    };
  }

  private interceptXHR() {
    const originalXHR = window.XMLHttpRequest;
    window.XMLHttpRequest = function() {
      const xhr = new originalXHR();
      const startTime = performance.now();
      
      xhr.addEventListener('load', () => 
        ConsoleMonitor.getInstance().logAPICall(xhr.responseURL, 'xhr', startTime, xhr.status)
      );
      
      xhr.addEventListener('error', () => 
        ConsoleMonitor.getInstance().logAPIError(xhr.responseURL, 'xhr', new Error('XHR failed'))
      );

      return xhr;
    } as any;
  }

  private handlePerformanceEntry(entry: PerformanceEntry) {
    if (entry.entryType === 'largest-contentful-paint') {
      this.performanceMonitor.checkLCP(entry as any);
    } else if (entry.entryType === 'layout-shift') {
      this.performanceMonitor.checkCLS(entry as any);
    }
  }

  private async processLog(type: string, args: any[]) {
    const log: CursorLog = {
      type: type as CursorLog['type'],
      message: args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' '),
      timestamp: new Date().toISOString(),
      metadata: {
        performance: this.performanceMonitor.getMetrics(),
        database: await this.databaseMonitor.getMetrics(),
        session: this.sessionMonitor.getSessionInfo(),
        stack: new Error().stack
      }
    };

    this.cursorLogs.push(log);
    await this.sendToCursor(log);
  }

  private async sendToCursor(log: CursorLog) {
    try {
      await fetch('/api/cursor/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log)
      });
    } catch (err) {
      this.originalConsole.error('Failed to send log to Cursor:', err);
    }
  }

  private async analyzeAndOptimize(log: any) {
    // Check performance thresholds
    if (log.performance.lcp > 2500) {
      await this.performanceMonitor.optimizeLCP();
    }
    if (log.performance.fid > 100) {
      await this.performanceMonitor.optimizeInteractivity();
    }

    // Check database performance
    if (log.database.queryTime > 1000) {
      await this.databaseMonitor.optimizeQueries();
    }
  }

  private startCursorSync() {
    // Sync logs with Cursor every 5 seconds
    setInterval(() => {
      if (this.cursorLogs.length > 0) {
        this.syncWithCursor();
      }
    }, 5000);
  }

  

  
  private async syncWithCursor() {
    try {
      const logs = [...this.cursorLogs];
      this.cursorLogs = []; // Clear the queue

      // Check session health
      if (!this.sessionMonitor.isHealthy()) {
        await this.sessionMonitor.refresh();
      }
      
      await fetch('/api/cursor/bulk-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs })
      });
    } catch (err) {
      this.originalConsole.error('Failed to sync logs with Cursor:', err);
      // Restore logs to queue if sync failed
      this.cursorLogs.unshift(...this.cursorLogs);
    }
  }

  private logAPICall(url: string, type: string, startTime: number, status: number) {
    const duration = performance.now() - startTime;
    this.processLog('info', [`${type.toUpperCase()} ${url} - ${status} (${duration.toFixed(2)}ms)`]);
    
    if (duration > 1000) {
      this.performanceMonitor.reportSlowAPI(url, duration);
    }
  }

  private logAPIError(url: string, type: string, error: Error) {
    this.processLog('error', [`${type.toUpperCase()} ${url} failed: ${error.message}`]);
  }

  private handleLog(type: 'log' | 'error' | 'warn', ...args: any[]) {
    // Call original console method
    this.originalConsole[type].apply(console, args);

    // Process the log
    this.processLog(type, args);
  }

  private storeLogs(log: any) {
    // Store in localStorage for persistence
    const logs = JSON.parse(localStorage.getItem('console_logs') || '[]');
    logs.push(log);
    localStorage.setItem('console_logs', JSON.stringify(logs));

    // You could also send to a server endpoint
    this.sendToServer(log);
  }

  private async sendToServer(log: any) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log)
      });
    } catch (err) {
      this.originalConsole.error('Failed to send log to server:', err);
    }
  }

  static getInstance() {
    if (!ConsoleMonitor.instance) {
      ConsoleMonitor.instance = new ConsoleMonitor();
    }
    return ConsoleMonitor.instance;
  }
} 