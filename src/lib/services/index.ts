import { serviceRegistry } from './ServiceRegistry';
import { ContentService } from './content/ContentService';
import { SalesService } from './sales/SalesService';
import { SchoolService } from './schools/SchoolService';

// Register services
serviceRegistry.register('content', new ContentService());
serviceRegistry.register('sales', new SalesService());
serviceRegistry.register('schools', new SchoolService());

// Export services
export const getService = <T>(name: string): T => {
  const service = serviceRegistry.get<T>(name);
  if (!service) {
    throw new Error(`Service ${name} not found`);
  }
  return service;
};

export type {
  ServiceConfig
} from './BaseService';

export {
  ContentService,
  SalesService,
  SchoolService
};