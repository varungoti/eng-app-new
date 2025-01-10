import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Lesson, Activity } from '@/models/Lesson';
import { Types } from 'mongoose';

interface LessonWithActivities {
  _id: Types.ObjectId;
  activities?: Activity[];
}

export async function GET(
  request: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    await connectToDatabase();
    const { lessonId } = await params;

    // Return empty activities for new lesson
    if (lessonId === 'new') {
      return NextResponse.json({
        success: true,
        data: []
      });
    }

    // Validate lessonId
    if (!Types.ObjectId.isValid(lessonId)) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid lesson ID format' } },
        { status: 400 }
      );
    }

    const result = await Lesson.findById(lessonId).select('activities').lean();
    const lesson = result as unknown as LessonWithActivities;

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: { message: 'Lesson not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: lesson.activities || []
    });
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to fetch activities' } },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    await connectToDatabase();
    const { lessonId } = params;
    const body = await request.json();

    // Validate lessonId
    if (!Types.ObjectId.isValid(lessonId)) {
      return NextResponse.json(
        { success: false, error: { message: 'Invalid lesson ID format' } },
        { status: 400 }
      );
    }

    const result = await Lesson.findByIdAndUpdate(
      lessonId,
      { $set: { activities: body.activities } },
      { new: true }
    ).select('activities').lean();
    const lesson = result as unknown as LessonWithActivities;

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: { message: 'Lesson not found' } },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: lesson.activities || []
    });
  } catch (error) {
    console.error('Error updating activities:', error);
    return NextResponse.json(
      { success: false, error: { message: 'Failed to update activities' } },
      { status: 500 }
    );
  }
}

export const config = {
  matcher: '/api/admin/:path*',
}; 