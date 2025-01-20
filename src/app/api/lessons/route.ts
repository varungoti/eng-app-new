import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongodb';
import { Lesson } from '@/lib/models/lesson';
import { logger } from '@/lib/logger';

export async function GET(request: Request) {
  try {
    await connectToDatabase();
    const lessons = await Lesson.find().sort({ createdAt: -1 });
    return NextResponse.json(lessons);
  } catch (error) {
    logger.error('Failed to fetch lessons', {
      context: { error },
      source: 'LessonsAPI'
    });
    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const data = await request.json();
    const lesson = await Lesson.create(data);
    return NextResponse.json(lesson);
  } catch (error) {
    logger.error('Failed to create lesson', {
      context: { error },
      source: 'LessonsAPI'
    });
    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
} 