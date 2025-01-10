import { prisma } from '../db';
import { logger } from '../logger';

export class APIError extends Error {
  constructor(message: string, public statusCode: number) {
    super(message);
    this.name = 'APIError';
  }
}

export const api = {
  async get<T>(path: string, options: { where?: any; include?: any; orderBy?: any } = {}): Promise<T[]> {
    try {
      const data = await prisma[path].findMany({
        where: { deletedAt: null, ...options.where },
        include: options.include,
        orderBy: options.orderBy,
      });
      return data;
    } catch (err) {
      logger.error(`Failed to fetch ${path}`, {
        context: { error: err, options },
        source: 'api.get'
      });
      throw new APIError(`Failed to fetch ${path}`, 500);
    }
  },

  async getById<T>(path: string, id: string, options: { include?: any } = {}): Promise<T | null> {
    try {
      const data = await prisma[path].findUnique({
        where: { id, deletedAt: null },
        include: options.include,
      });
      return data;
    } catch (err) {
      logger.error(`Failed to fetch ${path} by id`, {
        context: { error: err, id, options },
        source: 'api.getById'
      });
      throw new APIError(`Failed to fetch ${path} by id`, 500);
    }
  },

  async post<T>(path: string, data: any, options: { include?: any } = {}): Promise<T> {
    try {
      const result = await prisma[path].create({
        data,
        include: options.include,
      });
      return result;
    } catch (err) {
      logger.error(`Failed to create ${path}`, {
        context: { error: err, data, options },
        source: 'api.post'
      });
      throw new APIError(`Failed to create ${path}`, 500);
    }
  },

  async put<T>(path: string, id: string, data: any, options: { include?: any } = {}): Promise<T> {
    try {
      const result = await prisma[path].update({
        where: { id },
        data,
        include: options.include,
      });
      return result;
    } catch (err) {
      logger.error(`Failed to update ${path}`, {
        context: { error: err, id, data, options },
        source: 'api.put'
      });
      throw new APIError(`Failed to update ${path}`, 500);
    }
  },

  async delete(path: string, id: string): Promise<boolean> {
    try {
      await prisma[path].delete({
        where: { id }
      });
      return true;
    } catch (err) {
      logger.error(`Failed to delete ${path}`, {
        context: { error: err, id },
        source: 'api.delete'
      });
      throw new APIError(`Failed to delete ${path}`, 500);
    }
  },

  async transaction<T>(callback: (tx: typeof prisma) => Promise<T>): Promise<T> {
    try {
      return await prisma.$transaction(callback);
    } catch (err) {
      logger.error('Transaction failed', {
        context: { error: err },
        source: 'api.transaction'
      });
      throw new APIError('Transaction failed', 500);
    }
  }
};