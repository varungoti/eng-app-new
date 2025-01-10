@@ .. @@
 import { ErrorEvent, ErrorResolution, ErrorWatcherConfig } from './types';
 import { ErrorResolver } from './ErrorResolver';
 import { logger } from '../logger';
+import { DEBUG_CONFIG } from '../config';
 
 export class ErrorWatcher {
   private static instance: ErrorWatcher;
@@ .. @@
     maxErrors: 100,
     autoResolve: true,
     retryAttempts: 3,
     retryDelay: 1000,
-    logToConsole: import.meta.env.DEV,
+    logToConsole: DEBUG_CONFIG.enabled,
     router: null,
   };
 
@@ .. @@
     this.errors = [errorEvent, ...this.errors].slice(0, this.config.maxErrors);
     
     if (this.config.logToConsole) {
-      logger.error(error.message, {
+      const logLevel = error.severity === 'fatal' ? 'error' :
+                      error.severity === 'error' ? 'error' :
+                      error.severity === 'warning' ? 'warn' : 'info';
+      
+      logger[logLevel](error.message, {
         context: {
           ...error.context,
           severity: error.severity,
           componentStack: error.componentStack,
+          timestamp: new Date(errorEvent.timestamp).toISOString(),
+          errorId: errorEvent.id
         },
         source: error.source,
       });
     }