// This file is kept for backward compatibility
// Projects now use Supabase instead of MongoDB
import { logger } from '../logger';

// Provide a no-op function that logs a warning when used
export async function connectToDatabase() {
  logger.warn('MongoDB connectToDatabase was called, but the project now uses Supabase', { 
    source: 'mongodb',
    context: {
      action: 'connectToDatabase'
    }
  });
  
  // Return a fake connection object to prevent errors in legacy code
  return {
    db: {
      collection: () => {
        logger.warn('Attempt to access MongoDB collection in Supabase project', {
          source: 'mongodb'
        });
        
        // Return a stub object with common MongoDB methods
        return {
          find: async () => [],
          findOne: async () => null,
          insertOne: async () => ({ insertedId: 'fake-id' }),
          updateOne: async () => ({ modifiedCount: 0 }),
          deleteOne: async () => ({ deletedCount: 0 })
        };
      }
    }
  };
}

// Mock mongoose global to prevent errors
/* eslint-disable @typescript-eslint/no-explicit-any */
const mockMongoose = {
  promise: null,
  conn: null
};

// If global object exists, set the mock mongoose
if (typeof global !== 'undefined') {
  (global as any).mongoose = mockMongoose;
}

// Export a dummy mongoose object for backward compatibility
export default {
  connect: async () => {
    logger.warn('MongoDB connect was called, but the project now uses Supabase', {
      source: 'mongodb'
    });
    return mockMongoose;
  }
}; 