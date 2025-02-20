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

  static async handleError(log: any) {
    const diagnosis = this.diagnoseError(log.message);
    if (diagnosis) {
      await this.applyFix(diagnosis, log);
    }
  }

  private static diagnoseError(error: string): any {
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

  private static async applyFix(diagnosis: any, log: any) {
    const fix = diagnosis.solution(diagnosis.error);
    console.log(`🔧 Attempting to fix: ${diagnosis.diagnosis}`);
    console.log(`📝 Suggested fix: ${fix}`);

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
      console.error('Failed to send fix suggestion:', err);
    }
  }
} 