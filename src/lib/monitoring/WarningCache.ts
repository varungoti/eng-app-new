// Create a separate utility class for warning caching
export class WarningCache {
  private cache: Map<string, number> = new Map();
  private readonly cooldown: number;

  constructor(cooldownMs: number = 30000) {
    this.cooldown = cooldownMs;
  }

  shouldLog(key: string): boolean {
    const now = Date.now();
    const lastWarning = this.cache.get(key);
    
    if (!lastWarning || now - lastWarning > this.cooldown) {
      this.cache.set(key, now);
      return true;
    }
    
    return false;
  }

  clear() {
    this.cache.clear();
  }
}