import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
//import { Lesson } from '@/lib/models/lesson';
import { logger } from '@/lib/logger';

export async function GET(_request: Request) {
  try {
    const { data: lessons, error } = await supabase
      .from('lessons')
      .select()
      .order('createdAt', { ascending: false });

    if (error) {
      throw new Error('Failed to fetch lessons');
    }

    return NextResponse.json(lessons);
  } catch (error) {
    logger.error('Failed to fetch lessons', {
      context: { error },
      source: 'LessonsAPI'
    });

    return NextResponse.json(
      { error: 'Failed to fetch lessons' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { data } = await request.json();
    const { data: lesson, error } = await supabase.from('lessons').insert(data);

    if (error) {
      throw new Error('Failed to create lesson');
    }

    return NextResponse.json(lesson);
  } catch (error) {
    logger.error('Failed to create lesson', {
      context: { error },
      source: 'LessonsAPI'
    });

    return NextResponse.json(
      { error: 'Failed to create lesson' },
      { status: 500 }
    );
  }
} 