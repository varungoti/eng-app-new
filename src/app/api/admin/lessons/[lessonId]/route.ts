import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function PUT(
  req: Request,
  { params }: { params: { lessonId: string } }
) {
  try {
    const body = await req.json();
    const { lessonId } = params;

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