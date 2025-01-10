@@ .. @@
 export interface ErrorEvent {
   id: string;
   message: string;
   severity: ErrorSeverity;
   timestamp: number;
   componentStack?: string;
   context?: Record<string, any>;
   source: string;
   resolved?: boolean;
   resolution?: string;
+  retryCount?: number;
+  endpoint?: string;
+  statusCode?: number;
 }
@@ .. @@