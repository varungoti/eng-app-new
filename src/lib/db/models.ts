
// Interfaces
export interface IGrade extends Document {
  name: string;
  description?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITopic extends Document {
  name: string;
  description?: string;
  gradeId: mongoose.Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISubTopic extends Document {
  name: string;
  description?: string;
  topicId: mongoose.Types.ObjectId;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExercisePrompt extends Document {
  text: string;
  narration?: string;
  sayText?: string;
  media?: string;
  type?: 'image' | 'gif' | 'video';
}

export interface IQuestion extends Document {
  type: string;
  prompt: string;
  teacherScript?: string;
  exercisePrompts: IExercisePrompt[];
}

export interface ILesson extends Document {
  title: string;
  description?: string;
  subtopicId: mongoose.Types.ObjectId;
  questions: IQuestion[];
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema Options
const schemaOptions = {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
};

// Schemas
const gradeSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    unique: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  order: {
    type: Number,
    default: 0,
    min: [0, 'Order must be a non-negative number']
  }
}, schemaOptions);

const topicSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  gradeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Grade',
    required: [true, 'Grade ID is required']
  },
  order: {
    type: Number,
    default: 0
  }
}, schemaOptions);

const subtopicSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: [true, 'Topic ID is required']
  },
  order: {
    type: Number,
    default: 0
  }
}, schemaOptions);

const exercisePromptSchema = new Schema({
  text: {
    type: String,
    required: [true, 'Exercise prompt text is required'],
    trim: true
  },
  narration: {
    type: String,
    default: 'Your turn',
    trim: true
  },
  sayText: {
    type: String,
    trim: true
  },
  media: {
    type: String,
    default: '',
    trim: true
  },
  type: {
    type: String,
    enum: ['image', 'gif', 'video'],
    default: 'image'
  }
});

const questionSchema = new Schema({
  type: {
    type: String,
    required: [true, 'Question type is required'],
    trim: true
  },
  prompt: {
    type: String,
    required: [true, 'Question prompt is required'],
    trim: true
  },
  teacherScript: {
    type: String,
    default: '',
    trim: true
  },
  exercisePrompts: {
    type: [exercisePromptSchema],
    default: [],
    validate: {
      validator: function(prompts: any[]) {
        return Array.isArray(prompts);
      },
      message: 'Exercise prompts must be an array'
    }
  }
});

const lessonSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  subtopicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubTopic',
    required: [true, 'Subtopic ID is required']
  },
  questions: {
    type: [questionSchema],
    default: [],
    validate: {
      validator: function(questions: any[]) {
        return Array.isArray(questions);
      },
      message: 'Questions must be an array'
    }
  },
  order: {
    type: Number,
    default: 0
  }
}, schemaOptions);

// Add virtual relationships
gradeSchema.virtual('topics', {
  ref: 'Topic',
  localField: '_id',
  foreignField: 'gradeId',
  options: { sort: { order: 1 } }
});

topicSchema.virtual('subtopics', {
  ref: 'SubTopic',
  localField: '_id',
  foreignField: 'topicId'
});

subtopicSchema.virtual('lessons', {
  ref: 'Lesson',
  localField: '_id',
  foreignField: 'subtopicId'
});

// Initialize models
let Grade: Model<IGrade>;
let Topic: Model<ITopic>;
let SubTopic: Model<ISubTopic>;
let Lesson: Model<ILesson>;
let ExercisePrompt: Model<IExercisePrompt>;

try {
  // Try to get existing models
  Grade = mongoose.model<IGrade>('Grade');
  Topic = mongoose.model<ITopic>('Topic');
  SubTopic = mongoose.model<ISubTopic>('SubTopic');
  Lesson = mongoose.model<ILesson>('Lesson');
  ExercisePrompt = mongoose.model<IExercisePrompt>('ExercisePrompt');
} catch {
  // If models don't exist, create them
  Grade = mongoose.model<IGrade>('Grade', gradeSchema);
  Topic = mongoose.model<ITopic>('Topic', topicSchema);
  SubTopic = mongoose.model<ISubTopic>('SubTopic', subtopicSchema);
  Lesson = mongoose.model<ILesson>('Lesson', lessonSchema);
  ExercisePrompt = mongoose.model<IExercisePrompt>('ExercisePrompt', exercisePromptSchema);
}

// Export models
export const models = {
  Grade,
  Topic,
  SubTopic,
  Lesson,
  ExercisePrompt
};

// Add indexes
Grade.collection.createIndex({ name: 1 }, { unique: true, background: true });
Grade.collection.createIndex({ order: 1 }, { background: true });

Topic.collection.createIndex({ gradeId: 1, name: 1 }, { unique: true, background: true });
Topic.collection.createIndex({ gradeId: 1, order: 1 }, { background: true });

SubTopic.collection.createIndex({ topicId: 1, name: 1 }, { unique: true, background: true });
SubTopic.collection.createIndex({ topicId: 1, order: 1 }, { background: true });

Lesson.collection.createIndex({ subtopicId: 1, title: 1 }, { unique: true, background: true });
Lesson.collection.createIndex({ subtopicId: 1, order: 1 }, { background: true });

// Remove unique constraint from ExercisePrompt text index
ExercisePrompt.collection.createIndex({ text: 1 }, { background: true });
// Add a compound index for better query performance
ExercisePrompt.collection.createIndex({ text: 1, type: 1 }, { background: true }); 