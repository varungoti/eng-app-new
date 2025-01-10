import { NextResponse } from 'next/server';
import { Repository } from '@/lib/db/repository';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: Request) {
  try {
    console.log('GET /api/admin/subtopics - Starting');
    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get('topicId');
    const includeContent = searchParams.get('includeContent') === 'true';

    if (!topicId) {
      return errorResponse('Topic ID is required', 'VALIDATION_ERROR', 400);
    }

    const subtopics = await Repository.getSubTopics(topicId, { includeContent });
    console.log('GET /api/admin/subtopics - Success');
    return successResponse(subtopics);
  } catch (error) {
    console.error('Error fetching subtopics:', error);
    return errorResponse(
      'Failed to fetch subtopics',
      'DATABASE_ERROR',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST /api/admin/subtopics - Starting');
    const body = await request.json();
    const { name, description, topicId, order } = body;

    if (!name || !topicId) {
      return errorResponse('Name and Topic ID are required', 'VALIDATION_ERROR', 400);
    }

    const subtopic = await Repository.createSubTopic({
      name,
      description,
      topicId,
      order: order || 0
    });

    console.log('POST /api/admin/subtopics - Success');
    return successResponse(subtopic);
  } catch (error: any) {
    console.error('Error creating subtopic:', error);

    if (error.code === 11000) {
      return errorResponse(
        'A subtopic with this name already exists in this topic',
        'DUPLICATE_ERROR',
        409
      );
    }

    return errorResponse(
      'Failed to create subtopic',
      'DATABASE_ERROR',
      500,
      error.message
    );
  }
} 