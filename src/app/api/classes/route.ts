import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { db } from '@/lib/db';
import { z } from 'zod';

const createClassSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  gradeId: z.string().uuid(),
  teacherIds: z.array(z.string().uuid()),
  studentIds: z.array(z.string().uuid()),
  content: z.array(z.object({
    contentType: z.enum(['TOPIC', 'SUBTOPIC', 'LESSON']),
    contentId: z.string().uuid(),
    validUntil: z.string().datetime().optional()
  }))
});

export async function POST(req: Request) {
  try {
    const { userId, sessionClaims } = auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const role = sessionClaims?.role as string;
    if (!['SUPER_ADMIN', 'ADMIN', 'SCHOOL_LEADER', 'SCHOOL_PRINCIPAL'].includes(role)) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const body = await req.json();
    const validatedData = createClassSchema.parse(body);

    const result = await db.transaction(async (trx) => {
      // Create class
      const [classRecord] = await trx('classes')
        .insert({
          name: validatedData.name,
          description: validatedData.description,
          grade_id: validatedData.gradeId,
          created_by: userId
        })
        .returning('*');

      // Assign teachers
      if (validatedData.teacherIds.length) {
        await trx('class_teachers').insert(
          validatedData.teacherIds.map(teacherId => ({
            class_id: classRecord.id,
            teacher_id: teacherId,
            assigned_by: userId
          }))
        );
      }

      // Assign students
      if (validatedData.studentIds.length) {
        await trx('class_students').insert(
          validatedData.studentIds.map(studentId => ({
            class_id: classRecord.id,
            student_id: studentId,
            assigned_by: userId
          }))
        );
      }

      // Assign content
      if (validatedData.content.length) {
        await trx('assigned_content').insert(
          validatedData.content.map(content => ({
            class_id: classRecord.id,
            content_type: content.contentType,
            content_id: content.contentId,
            valid_until: content.validUntil || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            assigned_by: userId
          }))
        );
      }

      return classRecord;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating class:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId, sessionClaims } = auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const role = sessionClaims?.role as string;
    const { searchParams } = new URL(req.url);
    
    let query = db('classes')
      .select(
        'classes.*',
        db.raw(`
          json_agg(DISTINCT jsonb_build_object(
            'id', users.id,
            'name', users.name,
            'email', users.email
          )) FILTER (WHERE class_teachers.teacher_id IS NOT NULL) as teachers
        `)
      )
      .leftJoin('class_teachers', 'classes.id', 'class_teachers.class_id')
      .leftJoin('users', 'class_teachers.teacher_id', 'users.id')
      .groupBy('classes.id');

    // Apply role-based filters
    switch (role) {
      case 'STUDENT':
        query = query
          .innerJoin('class_students', 'classes.id', 'class_students.class_id')
          .where('class_students.student_id', userId);
        break;
      case 'TEACHER':
        query = query
          .where('class_teachers.teacher_id', userId);
        break;
      case 'SCHOOL_PRINCIPAL':
      case 'TEACHER_HEAD':
        const schoolId = searchParams.get('schoolId');
        if (!schoolId) return new NextResponse('School ID required', { status: 400 });
        query = query.where('classes.school_id', schoolId);
        break;
      // Super admins and admins can see all classes
    }

    const classes = await query;
    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error fetching classes:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
} 