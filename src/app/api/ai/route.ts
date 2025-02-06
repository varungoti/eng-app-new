import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';
import { z } from 'zod';

// Validation schemas
const conversationSchema = z.object({
  studentId: z.string().uuid(),
  teacherId: z.string().uuid().optional(),
  classId: z.string().uuid().optional(),
  conversationType: z.enum(['assessment', 'practice', 'feedback']),
  message: z.string(),
});

const contentSchema = z.object({
  teacherId: z.string().uuid(),
  contentType: z.enum(['exercise', 'question', 'lesson', 'prompt']),
  title: z.string(),
  description: z.string().optional(),
  content: z.record(z.any()),
  metadata: z.object({
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    targetAge: z.array(z.number()),
    languageSkills: z.array(z.string()),
    estimatedDuration: z.number(),
  }),
});

// API Routes
export async function POST(req: Request) {
  try {
    const supabase = createClient(cookies());
    const body = await req.json();
    const { type } = body;

    switch (type) {
      case 'conversation':
        const convData = conversationSchema.parse(body.data);
        const { data: conversation, error: convError } = await supabase
          .from('ai_conversations')
          .insert([{
            student_id: convData.studentId,
            teacher_id: convData.teacherId,
            class_id: convData.classId,
            conversation_type: convData.conversationType,
            messages: [{ role: 'user', content: convData.message }],
          }])
          .select()
          .single();

        if (convError) throw convError;
        return NextResponse.json(conversation);

      case 'content':
        const contentData = contentSchema.parse(body.data);
        const { data: content, error: contentError } = await supabase
          .from('ai_generated_content')
          .insert([{
            teacher_id: contentData.teacherId,
            content_type: contentData.contentType,
            title: contentData.title,
            description: contentData.description,
            content: contentData.content,
            metadata: contentData.metadata,
          }])
          .select()
          .single();

        if (contentError) throw contentError;
        return NextResponse.json(content);

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const supabase = createClient(cookies());
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    switch (type) {
      case 'conversation':
        const { data: conversation, error: convError } = await supabase
          .from('ai_conversations')
          .select('*')
          .eq('id', id)
          .single();

        if (convError) throw convError;
        return NextResponse.json(conversation);

      case 'content':
        const { data: content, error: contentError } = await supabase
          .from('ai_generated_content')
          .select('*')
          .eq('id', id)
          .single();

        if (contentError) throw contentError;
        return NextResponse.json(content);

      case 'student-progress':
        const { data: progress, error: progressError } = await supabase
          .from('student_ai_progress')
          .select('*')
          .eq('student_id', id);

        if (progressError) throw progressError;
        return NextResponse.json(progress);

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const supabase = createClient(cookies());
    const body = await req.json();
    const { type, id } = body;

    switch (type) {
      case 'conversation':
        const convData = conversationSchema.parse(body.data);
        const { data: conversation, error: convError } = await supabase
          .from('ai_conversations')
          .update({
            messages: body.messages,
            feedback: body.feedback,
          })
          .eq('id', id)
          .select()
          .single();

        if (convError) throw convError;
        return NextResponse.json(conversation);

      case 'content':
        const contentData = contentSchema.parse(body.data);
        const { data: content, error: contentError } = await supabase
          .from('ai_generated_content')
          .update({
            title: contentData.title,
            description: contentData.description,
            content: contentData.content,
            metadata: contentData.metadata,
            status: body.status,
          })
          .eq('id', id)
          .select()
          .single();

        if (contentError) throw contentError;
        return NextResponse.json(content);

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = createClient(cookies());
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    switch (type) {
      case 'conversation':
        const { error: convError } = await supabase
          .from('ai_conversations')
          .delete()
          .eq('id', id);

        if (convError) throw convError;
        return NextResponse.json({ success: true });

      case 'content':
        const { error: contentError } = await supabase
          .from('ai_generated_content')
          .delete()
          .eq('id', id);

        if (contentError) throw contentError;
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Invalid type' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 