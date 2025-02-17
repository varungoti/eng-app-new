import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Lesson } from '@/app//models/Lesson';
import { Types } from 'mongoose';
import { z } from 'zod';
import mongoose from 'mongoose';
import { handleDatabaseError as handleApiError, errorResponse } from '@/lib/api-response';
import { Repository } from '@/lib/db/repository';
import { successResponse, } from '@/lib/api-response';
import { validateLesson } from '@/lib/validators';

export async function GET(
  request: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    console.log('GET /api/admin/lessons/lesson - Starting');
    const { lessonId } = params;

    if (!lessonId) {
      return errorResponse('Lesson ID is required', 'VALIDATION_ERROR', 400);
    }

    const lesson = await Repository.getLesson(lessonId);

    if (!lesson) {
      return errorResponse('Lesson not found', 'NOT_FOUND_ERROR', 404);
    }

    console.log('GET /api/admin/lessons/lesson - Success');
    return successResponse(lesson);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    return errorResponse(
      'Failed to fetch lesson',
      'DATABASE_ERROR',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    // First establish database connection
    await connectToDatabase();

    console.log('PUT /api/admin/lessons/[lessonId] - Starting', params.lessonId);
    const { lessonId } = params;
    
    // Parse request body with error handling
    let body;
    try {
      body = await request.json();
      console.log('Request body:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return errorResponse(
        'Invalid request body',
        'VALIDATION_ERROR',
        400,
        'Request body must be valid JSON'
      );
    }

    // Validate required fields
    if (!lessonId) {
      console.log('Missing lessonId');
      return errorResponse('Lesson ID is required', 'VALIDATION_ERROR', 400);
    }

    if (!Types.ObjectId.isValid(lessonId)) {
      console.log('Invalid lessonId format:', lessonId);
      return errorResponse('Invalid lesson ID format', 'VALIDATION_ERROR', 400);
    }

    // Check if lesson exists before updating
    const existingLesson = await Repository.getLesson(lessonId).catch(error => {
      console.error('Error fetching existing lesson:', error);
      throw error;
    });

    if (!existingLesson) {
      console.log('Lesson not found:', lessonId);
      return errorResponse('Lesson not found', 'NOT_FOUND_ERROR', 404);
    }

    // Validate the entire lesson data using Zod
    const validation = validateLesson(body);
    if (!validation.success) {
      console.log('Validation errors:', validation.errors);
      return errorResponse(
        'Invalid lesson data',
        'VALIDATION_ERROR',
        400,
        validation.errors
      );
    }

    // Clean and prepare the data
    const cleanData = {
      title: body.title.trim(),
      subtopicId: body.subtopicId,
      questions: body.questions.map((q: any) => ({
        type: q.type,
        data: q.data,
        exercisePrompts: (q.exercisePrompts || []).map((p: any) => ({
          text: p.text?.trim() || '',
          media: p.media || '',
          type: p.type || 'image',
          narration: p.narration?.trim() || '',
          sayText: p.sayText?.trim() || ''
        }))
      })),
      activities: (body.activities || []).map((a: any) => ({
        instructions: a.instructions?.trim() || '',
        media: (a.media || []).map((m: any) => ({
          url: m.url,
          type: m.type,
          caption: m.caption?.trim()
        }))
      }))
    };

    console.log('Cleaned data:', JSON.stringify(cleanData, null, 2));

    // Verify subtopic exists and lesson title is unique within subtopic
    if (cleanData.subtopicId !== existingLesson.subtopicId) {
      try {
        // Only check if subtopic changed
        const subtopicExists = await Repository.getSubtopic(cleanData.subtopicId);
        if (!subtopicExists) {
          console.log('Subtopic not found:', cleanData.subtopicId);
          return errorResponse('Subtopic not found', 'NOT_FOUND_ERROR', 404);
        }

        // Check for duplicate title in new subtopic
        const existingLessonWithTitle = await Repository.getLessons(cleanData.subtopicId);
        if (existingLessonWithTitle.some(lesson => 
          lesson._id.toString() !== lessonId && 
          lesson.title.toLowerCase() === cleanData.title.toLowerCase()
        )) {
          return errorResponse(
            'A lesson with this title already exists in this subtopic',
            'DUPLICATE_ERROR',
            409
          );
        }
      } catch (error) {
        console.error('Error checking subtopic:', error);
        throw error;
      }
    }

    // Update the lesson
    let updatedLesson;
    try {
      updatedLesson = await Repository.updateLesson(lessonId, cleanData);
    } catch (error) {
      console.error('Error updating lesson:', error);
      throw error;
    }

    if (!updatedLesson) {
      console.log('Failed to update lesson:', lessonId);
      return errorResponse('Failed to update lesson', 'DATABASE_ERROR', 500);
    }

    console.log('PUT /api/admin/lessons/[lessonId] - Success');
    return successResponse(updatedLesson);
  } catch (error: any) {
    console.error('Error updating lesson:', error);
    console.error('Error stack:', error.stack);

    // Handle specific error types
    if (error.name === 'ValidationError') {
      return errorResponse(
        'Invalid lesson data',
        'VALIDATION_ERROR',
        400,
        error.message
      );
    }

    if (error.code === 11000) {
      return errorResponse(
        'A lesson with this title already exists in this subtopic',
        'DUPLICATE_ERROR',
        409
      );
    }

    // Handle MongoDB errors
    if (error.name === 'MongoServerError') {
      return errorResponse(
        'Database error',
        'DATABASE_ERROR',
        500,
        error.message
      );
    }

    // Handle network or connection errors
    if (error.name === 'MongoNetworkError') {
      return errorResponse(
        'Database connection error',
        'CONNECTION_ERROR',
        503,
        error.message
      );
    }

    // Handle connection errors
    if (error.message?.includes('ECONNREFUSED') || error.message?.includes('connect ECONNREFUSED')) {
      return errorResponse(
        'Unable to connect to database',
        'CONNECTION_ERROR',
        503,
        'Database connection failed'
      );
    }

    // Generic error response
    return errorResponse(
      'Failed to update lesson',
      'SERVER_ERROR',
      500,
      error.message || 'An unexpected error occurred'
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    console.log('DELETE /api/admin/lessons/[lessonId] - Starting');
    const { lessonId } = params;

    if (!lessonId) {
      return errorResponse('Lesson ID is required', 'VALIDATION_ERROR', 400);
    }

    const deletedLesson = await Repository.deleteLesson(lessonId);

    if (!deletedLesson) {
      return errorResponse('Lesson not found', 'NOT_FOUND_ERROR', 404);
    }

    console.log('DELETE /api/admin/lessons/[lessonId] - Success');
    return successResponse(deletedLesson);
  } catch (error) {
    console.error('Error deleting lesson:', error);
    return errorResponse(
      'Failed to delete lesson',
      'DATABASE_ERROR',
      500,
      error instanceof Error ? error.message : 'Unknown error'
    );
  }
} 