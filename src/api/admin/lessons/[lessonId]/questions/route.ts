import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Lesson, Question } from '@/models/lesson';
import { handleDatabaseError as handleApiError, errorResponse } from '@/lib/api-response';

export async function POST(
  request: NextRequest,
  context: { params: { lessonId: string } }
) {
  try {
    await connectToDatabase();
    const { lessonId } = context.params;
    const body = await request.json();

    // Validate the request body
    if (!body.type) {
      return new Response(
        JSON.stringify({
          error: { message: 'Missing required field: type' }
        }),
        { status: 400 }
      );
    }

    // Find the lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return new Response(
        JSON.stringify({
          error: { message: 'Lesson not found' }
        }),
        { status: 404 }
      );
    }

    // Add the new question with minimal required fields
    const newQuestion: Question = {
      type: body.type,
      data: {
        prompt: '',
        teacherScript: '',
        sampleAnswer: '',
        ...(body.data || {})
      },
      exercisePrompts: []
    };

    // Add the question to the lesson
    lesson.questions.push(newQuestion);

    // Save the lesson with validation
    await lesson.validate();
    await lesson.save();

    return new Response(
      JSON.stringify({
        success: true,
        data: lesson
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in POST /questions:', error);
    return error instanceof Error 
      ? handleApiError(error)
      : errorResponse('An unknown error occurred');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    await connectToDatabase();
    const { lessonId } = params;
    const body = await request.json();
    const { questionId, field, value } = body;

    if (typeof questionId !== 'number' || !field || value === undefined) {
      return new Response(
        JSON.stringify({
          error: { message: 'Missing required fields: questionId, field, and value' }
        }),
        { status: 400 }
      );
    }

    // Find the lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return new Response(
        JSON.stringify({
          error: { message: 'Lesson not found' }
        }),
        { status: 404 }
      );
    }

    // Update the specific field in the question
    if (!lesson.questions[questionId]) {
      return new Response(
        JSON.stringify({
          error: { message: 'Question not found' }
        }),
        { status: 404 }
      );
    }

    // Update the field in the question's data
    lesson.questions[questionId].data[field] = value;

    // Save the lesson
    await lesson.save();

    return new Response(
      JSON.stringify({
        success: true,
        data: lesson
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in PATCH /questions:', error);
    return error instanceof Error 
      ? handleApiError(error)
      : errorResponse('An unknown error occurred');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { lessonId: string } }
) {
  try {
    await connectToDatabase();
    const { lessonId } = params;
    const searchParams = new URL(request.url).searchParams;
    const questionId = searchParams.get('questionId');

    if (!questionId) {
      return new Response(
        JSON.stringify({
          error: { message: 'Missing required parameter: questionId' }
        }),
        { status: 400 }
      );
    }

    // Find the lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return new Response(
        JSON.stringify({
          error: { message: 'Lesson not found' }
        }),
        { status: 404 }
      );
    }

    // Remove the question
    lesson.questions.splice(parseInt(questionId), 1);

    // Save the lesson
    await lesson.save();

    return new Response(
      JSON.stringify({
        success: true,
        data: lesson
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /questions:', error);
    return error instanceof Error 
      ? handleApiError(error)
      : errorResponse('An unknown error occurred');
  }
} 