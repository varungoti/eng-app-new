import { NextResponse } from 'next/server';
import { successResponse, errorResponse } from '@/lib/api-response';
import { models } from '@/lib/models/database';
import { z } from 'zod';

// Validation schema for subtopic creation
const createSubtopicSchema = z.object({
  title: z.string()
    .min(2, 'Title must be at least 2 characters')
    .max(100, 'Title cannot be more than 100 characters')
    .trim(),
  description: z.string()
    .max(500, 'Description cannot be more than 500 characters')
    .optional(),
  topic_id: z.string().uuid('Topic ID must be a valid UUID'),
  order_index: z.number().min(0).optional().default(0)
});

export async function GET(request: Request) {
  try {
    console.log('GET /api/admin/subtopics - Starting');
    const { searchParams } = new URL(request.url);
    const topicId = searchParams.get('topicId');
    const includeContent = searchParams.get('includeContent') === 'true';

    if (!topicId) {
      return errorResponse('Topic ID is required', 'VALIDATION_ERROR', 400);
    }

    // Use Supabase models to get subtopics
    const subtopics = await models.SubtopicRepository.findByTopicId(topicId, includeContent);
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
    
    // Validate request body
    const validatedData = createSubtopicSchema.parse(body);
    
    // Create subtopic using Supabase models
    const subtopic = await models.SubtopicRepository.create(validatedData);

    console.log('POST /api/admin/subtopics - Success');
    return successResponse(subtopic);
  } catch (error: any) {
    console.error('Error creating subtopic:', error);

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
        'A subtopic with this title already exists in this topic',
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