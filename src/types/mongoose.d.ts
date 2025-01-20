import { Document, Model } from 'mongoose';

declare module 'mongoose' {
  interface IBaseDocument extends Document {
    createdAt: Date;
    updatedAt: Date;
  }

  export { IBaseDocument };
} 