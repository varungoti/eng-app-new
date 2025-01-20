import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function PUT(
  request: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { lessonId } = params;
    const body = await request.json();

    const { data, error } = await supabase
      .from('lessons')
      .update(body)
      .eq('id', lessonId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating lesson:', error);
    return NextResponse.json(
      { error: 'Failed to update lesson' },
      { status: 500 }
    );
  }
} 