import { Schema, model, models, Document, Model } from 'mongoose';

export interface ILesson extends Document {
  title: string;
  description?: string;
  gradeLevel: string;
  subject: string;
  topics: Schema.Types.ObjectId[];
  content?: string;
  status: 'draft' | 'published' | 'archived';
  createdBy?: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const lessonSchema = new Schema<ILesson>({
  title: { type: String, required: true },
  description: String,
  gradeLevel: { type: String, required: true },
  subject: { type: String, required: true },
  topics: [{ type: Schema.Types.ObjectId, ref: 'Topic' }],
  content: String,
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

export const Lesson: Model<ILesson> = models.Lesson || model<ILesson>('Lesson', lessonSchema); 