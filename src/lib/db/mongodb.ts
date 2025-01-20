import mongoose from 'mongoose';
import { logger } from '../logger';

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    promise: Promise<typeof mongoose> | null;
    conn: typeof mongoose | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      logger.info('Connected to MongoDB', { source: 'mongodb' });
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    logger.error('MongoDB connection error', {
      context: { error },
      source: 'mongodb'
    });
    cached.promise = null;
    throw error;
  }

  return cached.conn;
} 