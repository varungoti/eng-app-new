import { NextResponse } from 'next/server';
import { Repository } from '@/lib/db/repository';
import { successResponse, errorResponse } from '@/lib/api-response';
import { z } from 'zod';

// Validation schema for grade creation
const createGradeSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name cannot be more than 50 characters')
    .trim(),
  description: z.string()
    .max(500, 'Description cannot be more than 500 characters')
    .optional(),
  order: z.number().min(0).optional()
});

export async function GET(request: Request) {
  try {
    console.log('GET /api/admin/grades - Starting');
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const pageSize = parseInt(searchParams.get('pageSize') || '10');
    const includeContent = searchParams.get('includeContent') === 'true';

    if (isNaN(page) || page < 1) {
      return errorResponse('Invalid page number', 'VALIDATION_ERROR', 400);
    }

    if (isNaN(pageSize) || pageSize < 1) {
      return errorResponse('Invalid page size', 'VALIDATION_ERROR', 400);
    }

    const result = await Repository.getGrades({ page, pageSize, includeContent });
    console.log('GET /api/admin/grades - Success:', {
      gradesCount: result.grades.length,
      pagination: result.pagination
    });
    
    return successResponse({
      grades: result.grades,
      pagination: result.pagination
    });
  } catch (error: any) {
    console.error('Error fetching grades:', error);
    return errorResponse(
      error.message || 'Failed to fetch grades',
      'DATABASE_ERROR',
      500,
      error.stack
    );
  }
}

export async function POST(request: Request) {
  try {
    console.log('POST /api/admin/grades - Starting');
    const body = await request.json();
    
    // Validate request body
    const validatedData = createGradeSchema.parse(body);
    
    // Check if grade with same name exists
    const existingGrade = await Repository.findGradeByName(validatedData.name);
    if (existingGrade) {
      return errorResponse(
        'A grade with this name already exists',
        'DUPLICATE_ERROR',
        409
      );
    }

    // Create grade
    const grade = await Repository.createGrade(validatedData);
    
    console.log('POST /api/admin/grades - Success:', {
      gradeId: grade.id,
      name: grade.name
    });
    
    return successResponse(grade);
  } catch (error: any) {
    console.error('Error creating grade:', error);

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return errorResponse(
        error.errors[0].message,
        'VALIDATION_ERROR',
        400
      );
    }

    // Handle duplicate key errors from MongoDB
    if (error.code === 11000) {
      return errorResponse(
        'A grade with this name already exists',
        'DUPLICATE_ERROR',
        409
      );
    }

    // Handle other errors
    return errorResponse(
      error.message || 'Failed to create grade',
      'DATABASE_ERROR',
      500,
      error.stack
    );
  }
} 