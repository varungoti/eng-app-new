import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Grade } from '@/models/grade';
import { Topic } from '@/models/topic';
import { SubTopic } from '@/models/sub-topic';
import { Lesson } from '@/models/lesson';

export async function DELETE(
  request: Request,
  { params }: { params: { gradeId: string } }
) {
  try {
    await connectToDatabase();
    const { gradeId } = params;

    // First delete all associated lessons
    const topics = await Topic.find({ gradeId });
    for (const topic of topics) {
      const subtopics = await SubTopic.find({ topicId: topic._id });
      for (const subtopic of subtopics) {
        await Lesson.deleteMany({ subtopicId: subtopic._id });
      }
      // Delete subtopics
      await SubTopic.deleteMany({ topicId: topic._id });
    }
    // Delete topics
    await Topic.deleteMany({ gradeId });
    // Finally delete the grade
    await Grade.findByIdAndDelete(gradeId);

    return NextResponse.json({ message: 'Grade deleted successfully' });
  } catch (error) {
    console.error('Error deleting grade:', error);
    return NextResponse.json(
      { error: 'Failed to delete grade' },
      { status: 500 }
    );
  }
} 