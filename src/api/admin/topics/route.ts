import { NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';
import { models } from '@/lib/models/database';
import { z } from 'zod';

// Validation schema for topic creation
const createTopicSchema = z.object({
  title: z.string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title cannot be more than 100 characters')
    .trim(),
  description: z.string()
    .max(500, 'Description cannot be more than 500 characters')
    .optional(),
  grade_id: z.string().uuid('Grade ID must be a valid UUID'),
  order_index: z.number().min(0).optional().default(0)
});

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
    
    // Use Supabase models to get topics
    const topics = await models.TopicRepository.findByGradeId(gradeId, { 
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
    
    // Validate request body
    const validatedData = createTopicSchema.parse(body);
    
    // Create topic using Supabase models
    const topic = await models.TopicRepository.create(validatedData);

    return successResponse(topic);
  } catch (error: any) {
    console.error('Error creating topic:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return errorResponse(
        error.errors[0].message,
        'VALIDATION_ERROR',
        400
      );
    }

    // Handle database errors - PostgreSQL unique violation
    if (error.code === '23505') {
      return errorResponse(
        'A topic with this title already exists in this grade',
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