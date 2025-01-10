import { NextRequest } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Lesson } from '@/models/lesson';
import { handleDatabaseError as handleApiError, errorResponse } from '@/lib/api-response';

export async function POST(
  request: NextRequest,
  { params }: { params: { lessonId: string; questionId: string } }
) {
  try {
    await connectToDatabase();
    const { lessonId, questionId } = params;
    const body = await request.json();

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

    // Find the question
    const question = lesson.questions[parseInt(questionId)];
    if (!question) {
      return new Response(
        JSON.stringify({
          error: { message: 'Question not found' }
        }),
        { status: 404 }
      );
    }

    // Add the new prompt
    if (!question.exercisePrompts) {
      question.exercisePrompts = [];
    }
    question.exercisePrompts.push(body);

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
    console.error('Error in POST /prompts:', error);
    return error instanceof Error 
      ? handleApiError(error)
      : errorResponse('An unknown error occurred');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { lessonId: string; questionId: string } }
) {
  try {
    await connectToDatabase();
    const { lessonId, questionId } = params;
    const searchParams = new URL(request.url).searchParams;
    const promptId = searchParams.get('promptId');
    const body = await request.json();

    if (!promptId) {
      return new Response(
        JSON.stringify({
          error: { message: 'Missing required parameter: promptId' }
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

    // Find the question
    const question = lesson.questions[parseInt(questionId)];
    if (!question) {
      return new Response(
        JSON.stringify({
          error: { message: 'Question not found' }
        }),
        { status: 404 }
      );
    }

    // Find and update the prompt
    const prompt = question.exercisePrompts[parseInt(promptId)];
    if (!prompt) {
      return new Response(
        JSON.stringify({
          error: { message: 'Prompt not found' }
        }),
        { status: 404 }
      );
    }

    // Update the prompt fields
    Object.assign(prompt, body);

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
    console.error('Error in PATCH /prompts:', error);
    return error instanceof Error 
      ? handleApiError(error)
      : errorResponse('An unknown error occurred');
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { lessonId: string; questionId: string } }
) {
  try {
    await connectToDatabase();
    const { lessonId, questionId } = params;
    const searchParams = new URL(request.url).searchParams;
    const promptId = searchParams.get('promptId');

    if (!promptId) {
      return new Response(
        JSON.stringify({
          error: { message: 'Missing required parameter: promptId' }
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

    // Find the question
    const question = lesson.questions[parseInt(questionId)];
    if (!question) {
      return new Response(
        JSON.stringify({
          error: { message: 'Question not found' }
        }),
        { status: 404 }
      );
    }

    // Remove the prompt
    question.exercisePrompts.splice(parseInt(promptId), 1);

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
    console.error('Error in DELETE /prompts:', error);
    return error instanceof Error 
      ? handleApiError(error)
      : errorResponse('An unknown error occurred');
  }
} 