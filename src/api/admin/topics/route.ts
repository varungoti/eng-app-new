import { NextResponse } from 'next/server';
import { Repository } from '@/lib/db/repository';
import { successResponse, errorResponse } from '@/lib/api-response';

export async function GET(request: Request) {
  try {
    console.log('GET /api/admin/topics - Starting');
    const { searchParams } = new URL(request.url);
    const gradeId = searchParams.get('gradeId');
    const includeContent = searchParams.get('includeContent') === 'true';
    const includeBasic = searchParams.get('includeBasic') === 'true';
    const includeDetails = searchParams.get('includeDetails') === 'true';
    const includeStats = searchParams.get('includeStats') === 'true';

    if (!gradeId) {
      console.log('GET /api/admin/topics - Error: Grade ID is required');
      return errorResponse('Grade ID is required', 'VALIDATION_ERROR', 400);
    }

    console.log('GET /api/admin/topics - Fetching topics for grade:', gradeId);
    const topics = await Repository.getTopics(gradeId, { 
      includeContent,
      includeBasic,
      includeDetails,
      includeStats
    });

    console.log('GET /api/admin/topics - Success:', {
      topicsCount: topics.topics.length
    });
    return successResponse(topics);
  } catch (error) {
    console.error('Error in GET /api/admin/topics:', error);
    if (error instanceof Error && error.message === 'Invalid grade ID format') {
      return errorResponse(
        'Invalid grade ID format',
        'VALIDATION_ERROR',
        400
      );
    }
    return errorResponse(
      'Failed to fetch topics',
      'DATABASE_ERROR',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST /api/admin/topics - Starting');
    const body = await request.json();
    const { name, description, gradeId, order } = body;

    if (!name || !gradeId) {
      return errorResponse('Name and Grade ID are required', 'VALIDATION_ERROR', 400);
    }

    const topic = await Repository.createTopic({
      name,
      description,
      gradeId,
      order: order || 0
    });

    return successResponse(topic);
  } catch (error: any) {
    console.error('Error creating topic:', error);

    if (error.code === 11000) {
      return errorResponse(
        'A topic with this name already exists in this grade',
        'DUPLICATE_ERROR',
        409
      );
    }

    return errorResponse(
      'Failed to create topic',
      'DATABASE_ERROR',
      500,
      error.message
    );
  }
} 