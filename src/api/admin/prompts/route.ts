import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { models } from '@/lib/db/models';
import { z } from 'zod';

// Schema for validating prompt data
const promptSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  narration: z.string().optional(),
  sayText: z.string().optional(),
  media: z.string().optional(),
  type: z.enum(['image', 'gif', 'video']).default('image')
});

export async function POST(req: Request) {
  try {
    // Connect to database
    await connectToDatabase();

    // Parse and validate request body
    const body = await req.json();
    const validatedData = promptSchema.parse(body);

    // Create new prompt
    const prompt = await models.ExercisePrompt.create(validatedData);

    return NextResponse.json({
      success: true,
      data: prompt
    });
  } catch (error) {
    console.error('Error saving prompt:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: {
          message: 'Invalid prompt data',
          details: error.errors
        }
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: {
        message: error instanceof Error ? error.message : 'Failed to save prompt'
      }
    }, { status: 500 });
  }
} 