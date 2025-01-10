import { logger } from '../logger';

export class ServiceRegistry {
  private static instance: ServiceRegistry;
  private services: Map<string, any> = new Map();

  private constructor() {}

  public static getInstance(): ServiceRegistry {
    if (!ServiceRegistry.instance) {
      ServiceRegistry.instance = new ServiceRegistry();
    }
    return ServiceRegistry.instance;
  }

  public register(name: string, service: any): void {
    if (this.services.has(name)) {
      logger.warn(`Service ${name} already registered, overwriting`, {
        source: 'ServiceRegistry'
      });
    }
    this.services.set(name, service);
  }

  public get<T>(name: string): T | undefined {
    return this.services.get(name) as T;
  }
}

export const serviceRegistry = ServiceRegistry.getInstance();