import { connectToDatabase } from '@/lib/mongodb';
import { Grade } from '@/models/grade';
import { Topic } from '@/models/topic';
import { SubTopic } from '@/models/subtopic';
import { Lesson } from '@/models/lesson';
import { Types } from 'mongoose';

export class Repository {
  // Grade methods
  static async getGrades({ page = 1, pageSize = 10, includeContent = false }) {
    await connectToDatabase();
    const skip = (page - 1) * pageSize;
    const query = Grade.find().sort({ order: 1, name: 1 });

    if (includeContent) {
      query.populate({
        path: 'topics',
        populate: {
          path: 'subtopics',
          populate: {
            path: 'lessons'
          }
        }
      });
    }

    const [grades, total] = await Promise.all([
      query.skip(skip).limit(pageSize),
      Grade.countDocuments()
    ]);

    return {
      grades,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize)
      }
    };
  }

  static async findGradeByName(name: string) {
    await connectToDatabase();
    return Grade.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });
  }

  static async createGrade(data: {
    name: string;
    description?: string;
    order?: number;
  }) {
    await connectToDatabase();
    return Grade.create(data);
  }

  static async updateGrade(
    gradeId: string,
    data: {
      name?: string;
      description?: string;
      order?: number;
    }
  ) {
    await connectToDatabase();
    if (!Types.ObjectId.isValid(gradeId)) {
      throw new Error('Invalid grade ID format');
    }
    return Grade.findByIdAndUpdate(
      gradeId,
      { $set: data },
      { new: true, runValidators: true }
    );
  }

  static async deleteGrade(gradeId: string) {
    await connectToDatabase();
    if (!Types.ObjectId.isValid(gradeId)) {
      throw new Error('Invalid grade ID format');
    }
    return Grade.findByIdAndDelete(gradeId);
  }

  // Topic methods
  static async getTopics(gradeId: string, options: {
    includeContent?: boolean;
    includeBasic?: boolean;
    includeDetails?: boolean;
    includeStats?: boolean;
  } = {}) {
    try {
      console.log('Repository.getTopics - Starting with gradeId:', gradeId);
      await connectToDatabase();
      
      if (!Types.ObjectId.isValid(gradeId)) {
        console.log('Repository.getTopics - Invalid grade ID format:', gradeId);
        throw new Error('Invalid grade ID format');
      }

      const query = { gradeId: new Types.ObjectId(gradeId) };
      console.log('Repository.getTopics - Query:', JSON.stringify(query));
      
      const baseQuery = Topic.find(query).sort({ order: 1, name: 1 });
      console.log('Repository.getTopics - Created base query');

      if (options.includeContent) {
        console.log('Repository.getTopics - Including content');
        baseQuery.populate({
          path: 'subtopics',
          populate: {
            path: 'lessons'
          }
        });
      }

      console.log('Repository.getTopics - Executing query');
      const topics = await baseQuery.exec();
      console.log('Repository.getTopics - Success, found topics:', topics.length);
      return { topics };
    } catch (error) {
      console.error('Error in Repository.getTopics:', error);
      throw error;
    }
  }

  static async createTopic(data: {
    name: string;
    description?: string;
    gradeId: string;
    order?: number;
  }) {
    await connectToDatabase();
    
    if (!Types.ObjectId.isValid(data.gradeId)) {
      throw new Error('Invalid grade ID format');
    }

    const topic = await Topic.create({
      ...data,
      gradeId: new Types.ObjectId(data.gradeId)
    });

    return topic;
  }

  // SubTopic methods
  static async getSubTopics(topicId: string, options: { includeContent?: boolean } = {}) {
    await connectToDatabase();
    
    if (!Types.ObjectId.isValid(topicId)) {
      throw new Error('Invalid topic ID format');
    }

    const query = { topicId: new Types.ObjectId(topicId) };
    const baseQuery = SubTopic.find(query).sort({ order: 1, name: 1 });

    if (options.includeContent) {
      baseQuery.populate('lessons');
    }

    const subtopics = await baseQuery.exec();
    return { subtopics };
  }

  static async createSubTopic(data: {
    name: string;
    description?: string;
    topicId: string;
    order?: number;
  }) {
    await connectToDatabase();
    
    if (!Types.ObjectId.isValid(data.topicId)) {
      throw new Error('Invalid topic ID format');
    }

    const subtopic = await SubTopic.create({
      ...data,
      topicId: new Types.ObjectId(data.topicId)
    });

    return subtopic;
  }

  // Existing methods
  static async getLessons(subtopicId: string) {
    try {
      console.log('Repository.getLessons - Starting with subtopicId:', subtopicId);
      await connectToDatabase();

      if (!Types.ObjectId.isValid(subtopicId)) {
        console.log('Repository.getLessons - Invalid subtopic ID format:', subtopicId);
        throw new Error('Invalid subtopic ID format');
      }

      const query = { subtopicId: new Types.ObjectId(subtopicId) };
      console.log('Repository.getLessons - Query:', JSON.stringify(query));

      const lessons = await Lesson.find(query).sort({ order: 1, title: 1 });
      console.log('Repository.getLessons - Success, found lessons:', lessons.length);

      return lessons;
    } catch (error) {
      console.error('Error in Repository.getLessons:', error);
      throw error;
    }
  }

  static async getLesson(lessonId: string) {
    await connectToDatabase();
    if (!Types.ObjectId.isValid(lessonId)) {
      throw new Error('Invalid lesson ID format');
    }
    return Lesson.findById(lessonId);
  }

  static async getSubtopic(subtopicId: string) {
    await connectToDatabase();
    if (!Types.ObjectId.isValid(subtopicId)) {
      throw new Error('Invalid subtopic ID format');
    }
    return SubTopic.findById(subtopicId);
  }

  static async createLesson(data: {
    title: string;
    description?: string;
    subtopicId: string;
    questions: Array<{
      type: string;
      data: Record<string, any>;
      exercisePrompts: Array<{
        text: string;
        media?: string;
        type?: 'image' | 'gif' | 'video';
        narration?: string;
        sayText?: string;
      }>;
    }>;
    order?: number;
  }) {
    await connectToDatabase();
    return Lesson.create(data);
  }

  static async updateLesson(
    lessonId: string,
    data: {
      title?: string;
      description?: string;
      subtopicId?: string;
      questions?: Array<{
        type: string;
        data: Record<string, any>;
        exercisePrompts: Array<{
          text: string;
          media?: string;
          type?: 'image' | 'gif' | 'video';
          narration?: string;
          sayText?: string;
        }>;
      }>;
      order?: number;
    }
  ) {
    await connectToDatabase();
    
    if (!Types.ObjectId.isValid(lessonId)) {
      throw new Error('Invalid lesson ID format');
    }

    if (data.subtopicId && !Types.ObjectId.isValid(data.subtopicId)) {
      throw new Error('Invalid subtopic ID format');
    }

    const updateData = {
      ...data,
      subtopicId: data.subtopicId ? new Types.ObjectId(data.subtopicId) : undefined
    };

    const lesson = await Lesson.findByIdAndUpdate(
      lessonId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    return lesson;
  }

  static async deleteLesson(lessonId: string) {
    await connectToDatabase();
    
    if (!Types.ObjectId.isValid(lessonId)) {
      throw new Error('Invalid lesson ID format');
    }

    return Lesson.findByIdAndDelete(lessonId);
  }

  // Class methods
  static async getClass(classId: string) {
    await connectToDatabase();
    if (!Types.ObjectId.isValid(classId)) {
      throw new Error('Invalid class ID format');
    }
    return Grade.findById(classId).populate('topics');
  }

  static async getClassSchedule(classId: string) {
    await connectToDatabase();
    if (!Types.ObjectId.isValid(classId)) {
      throw new Error('Invalid class ID format');
    }
    // TODO: Implement schedule model and query
    // For now, return mock data
    return {
      upcomingClasses: [
        {
          id: 1,
          subject: "English Literature",
          time: "09:00 AM",
          students: 28,
          topic: "Shakespeare: Romeo & Juliet",
          room: "Room 101",
        },
        {
          id: 2,
          subject: "Creative Writing",
          time: "11:30 AM",
          students: 24,
          topic: "Character Development",
          room: "Room 203",
        },
      ]
    };
  }

  static async getTopStudents(classId: string, limit: number = 5) {
    await connectToDatabase();
    if (!Types.ObjectId.isValid(classId)) {
      throw new Error('Invalid class ID format');
    }
    // TODO: Implement student performance model and query
    // For now, return mock data
    return {
      students: [
        {
          id: 1,
          name: "Emma Thompson",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
          progress: 92,
        },
        {
          id: 2,
          name: "Michael Chen",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
          progress: 88,
        },
      ]
    };
  }
}