import { NextResponse } from 'next/server';
import { Repository } from '@/lib/db/repository';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: Request) {
  try {
    console.log('GET /api/admin/lessons - Starting');
    const { searchParams } = new URL(request.url);
    const subtopicId = searchParams.get('subtopicId');

    if (!subtopicId) {
      console.log('GET /api/admin/lessons - Error: Subtopic ID is required');
      return errorResponse('Subtopic ID is required', 'VALIDATION_ERROR', 400);
    }

    console.log('GET /api/admin/lessons - Fetching lessons for subtopic:', subtopicId);
    const lessons = await Repository.getLessons(subtopicId);
    console.log('GET /api/admin/lessons - Success, found lessons:', lessons.length);
    
    return successResponse({ lessons });
  } catch (error) {
    console.error('Error fetching lessons:', error);
    if (error instanceof Error && error.message === 'Invalid subtopic ID format') {
      return errorResponse(
        'Invalid subtopic ID format',
        'VALIDATION_ERROR',
        400
      );
    }
    return errorResponse(
      'Failed to fetch lessons',
      'DATABASE_ERROR',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST /api/admin/lessons - Starting');
    const body = await request.json();
    const { title, description, subtopicId, questions, order } = body;

    if (!title || !subtopicId) {
      return errorResponse('Title and Subtopic ID are required', 'VALIDATION_ERROR', 400);
    }

    const lesson = await Repository.createLesson({
      title,
      description,
      subtopicId,
      questions: questions || [],
      order: order || 0
    });

    console.log('POST /api/admin/lessons - Success');
    return successResponse(lesson);
  } catch (error: any) {
    console.error('Error creating lesson:', error);

    if (error.code === 11000) {
      return errorResponse(
        'A lesson with this title already exists in this subtopic',
        'DUPLICATE_ERROR',
        409
      );
    }

    return errorResponse(
      'Failed to create lesson',
      'DATABASE_ERROR',
      500,
      error.message
    );
  }
} 