import { logger } from "@/lib/logger";

// Define interfaces for better type safety
interface ErrorLog {
  message: string;
  stack?: string;
  source?: string;
  timestamp?: number;
}

interface ErrorDiagnosis {
  pattern: string;
  diagnosis: string;
  solution: (error: string) => string;
  error: string;
}

export class ErrorResolver {
  private static errorPatterns = new Map([
    ['TypeError: Cannot read property', {
      diagnosis: 'Null or undefined object access',
      solution: (error: string) => {
        const match = error.match(/property '(.+)' of/);
        if (match) {
          return `Add null check for ${match[1]}`;
        }
        return 'Add null checks';
      }
    }],
    ['ReferenceError: (\\w+) is not defined', {
      diagnosis: 'Undefined variable',
      solution: (error: string) => {
        const match = error.match(/ReferenceError: (\w+) is not defined/);
        if (match) {
          return `Define variable ${match[1]} before use`;
        }
        return 'Define missing variable';
      }
    }]
  ]);

  static async handleError(log: ErrorLog) {
    const diagnosis = this.diagnoseError(log.message);
    if (diagnosis) {
      await this.applyFix(diagnosis, log);
    }
  }

  private static diagnoseError(error: string): ErrorDiagnosis | null {
    for (const [pattern, handler] of this.errorPatterns) {
      if (new RegExp(pattern).test(error)) {
        return {
          pattern,
          ...handler,
          error
        };
      }
    }
    return null;
  }

  private static async applyFix(diagnosis: ErrorDiagnosis, log: ErrorLog) {
    const fix = diagnosis.solution(diagnosis.error);
    logger.info(`🔧 Attempting to fix: ${diagnosis.diagnosis}`);
    logger.info(`📝 Suggested fix: ${fix}`);

    // Send fix suggestion to server
    try {
      await fetch('/api/auto-fix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: log,
          diagnosis,
          suggestedFix: fix
        })
      });
    } catch (err) {
      logger.error('Failed to send fix suggestion:', { context: { error: err } });
    }
  }
} 