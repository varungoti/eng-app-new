import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { db } from '@/lib/db';
import { z } from 'zod';
import { UserRole } from '@/types/roles';
import { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { database } from '@/lib/db';

const createClassSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  gradeId: z.string().uuid(),
  teacherIds: z.array(z.string().uuid()),
  studentIds: z.array(z.string().uuid()),
  content: z.array(z.object({
    contentType: z.enum(['TOPIC', 'SUBTOPIC', 'LESSON', 'QUESTION', 'EXERCISE', 'ACTIVITY']),
    contentId: z.string().uuid(),
    validUntil: z.string().datetime().optional()
  }))
});

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = session.user.id;
  const role = session.user.role;

  if (!session.user.role || !['SUPER_ADMIN', 'ADMIN', 'SCHOOL_LEADER', 'SCHOOL_PRINCIPAL'].includes(session.user.role)) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  try {
    const body = await req.json();
    const validatedData = createClassSchema.parse(body);

    const { data: classRecord, error: classError } = await supabase
      .from('classes')
      .insert({
        name: validatedData.name,
        description: validatedData.description,
        grade_id: validatedData.gradeId,
        created_by: userId
      })
      .select()
      .single();

    if (classError) throw classError;

    // Insert teachers
    if (validatedData.teacherIds.length) {
      const { error: teacherError } = await supabase
        .from('class_teachers')
        .insert(
          validatedData.teacherIds.map(teacherId => ({
            class_id: classRecord.id,
            teacher_id: teacherId,
            assigned_by: userId
          }))
        );
      if (teacherError) throw teacherError;
    }

    // Assign students
    if (validatedData.studentIds.length) {
      await supabase
        .from('class_students')
        .insert(
          validatedData.studentIds.map(studentId => ({
            class_id: classRecord.id,
            student_id: studentId,
            assigned_by: userId
          }))
        );
    }

    // Assign content
    if (validatedData.content.length) {
      await supabase
        .from('assigned_content')
        .insert(
          validatedData.content.map(content => ({
            class_id: classRecord.id,
            content_type: content.contentType,
            content_id: content.contentId,
            valid_until: content.validUntil || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            assigned_by: userId
          }))
        );
    }

    return NextResponse.json(classRecord);
  } catch (error) {
    console.error('Error creating class:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = session.user.id;
    const userRole = session.user.user_metadata?.role?.toUpperCase();

    console.log('API - User Role:', userRole); // Debug log

    const allowedRoles = [
      'SUPER_ADMIN',
      'ADMIN',
      'SCHOOL_LEADER',
      'SCHOOL_PRINCIPAL',
      'TEACHER_HEAD',
      'TEACHER',
      'SALES_HEAD',
      'SALES_LEAD',
      'SALES_EXECUTIVE',
      'DEVELOPER',
      'TECHNICAL_HEAD',
      'CONTENT_HEAD'
    ];

    if (!userRole || !allowedRoles.includes(userRole)) {
      console.log('API - Role not allowed:', userRole); // Debug log
      return new NextResponse("Forbidden", { status: 403 });
    }

    // For non-teacher roles, fetch all classes
    if (userRole !== 'TEACHER') {
      const { data: classes, error: classesError } = await supabase
        .from('classes')
        .select(`
          id,
          name,
          description,
          created_at,
          grade_id,
          teacher_classes (
            teacher_id,
            teacher:teachers(id, name)
          ),
          grade:grades(id, name)
        `);

      if (classesError) {
        console.error('Classes fetch error:', classesError);
        throw classesError;
      }

      // Transform data to match expected format
      const transformedClasses = classes?.map(cls => ({
        id: cls.id,
        attributes: {
          name: cls.name,
          description: cls.description,
          courses: { data: [] } // Add empty courses array if needed
        }
      }));

      return NextResponse.json({ data: transformedClasses });
    }

    // For teachers, fetch only their assigned classes
    const { data: classes, error: classesError } = await supabase
      .from('classes')
      .select(`
        id,
        name,
        description,
        created_at,
        grade_id,
        teacher_classes!inner(teacher_id),
        grade:grades(id, name)
      `)
      .eq('teacher_classes.teacher_id', userId);

    if (classesError) {
      console.error('Classes fetch error:', classesError);
      throw classesError;
    }

    // Transform data to match expected format
    const transformedClasses = classes?.map(cls => ({
      id: cls.id,
      attributes: {
        name: cls.name,
        description: cls.description,
        courses: { data: [] } // Add empty courses array if needed
      }
    }));

    return NextResponse.json({ data: transformedClasses });
  } catch (error) {
    console.error('Error fetching classes:', error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 