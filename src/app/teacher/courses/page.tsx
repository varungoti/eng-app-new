"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { CourseCard } from '@/components/common/CourseCard';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { AlertDialog, AlertDialogDescription } from '@/components/ui/alert-dialog';
import { db } from '@/lib/db';
import { Database } from '@/lib/database.types';
import { useComponentLogger } from '@/hooks/useComponentLogger';

type Course = Database['public']['Tables']['courses']['Row'];
type UserRole = 'teacher' | 'admin' | 'student';

function Courses() {
    const { logError } = useComponentLogger('Courses');
    const supabase = useSupabaseClient<Database>();
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [userRole, setUserRole] = useState<UserRole | null>(null);
    

    useEffect(() => {
        const fetchUserRoleAndCourses = async () => {
            try {
                // First fetch user role
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) throw new Error('Not authenticated');

                const { data: roleData, error: roleError } = await supabase
                    .from('user_roles')
                    .select('role')
                    .eq('user_id', user.id)
                    .single() as { data: { role: UserRole } | null, error: any };

                if (roleError) throw roleError;
                if (!roleData) throw new Error('Role not found');

                setUserRole(roleData.role as UserRole);

                // Then fetch courses based on role and permissions
                const { data: teacherProfile } = await supabase
                    .from('teacher_profiles')
                    .select('id')
                    .eq('user_id', user.id)
                    .single() as { data: { id: string } | null };

                if (!teacherProfile && roleData.role !== 'admin') {
                    throw new Error('Unauthorized access');
                }

                const query = supabase
                    .from('courses')
                    .select(`
                        *,
                        grade:grades(name),
                        topics:topics(count)
                    `);

                // Filter courses based on role
                if (roleData.role === 'teacher') {
                    if (!teacherProfile) throw new Error('Teacher profile not found');
                    query.eq('teacher_id', teacherProfile.id);
                }

                const { data: coursesData, error: coursesError } = await query;

                if (coursesError) throw coursesError;
                setCourses(coursesData);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Failed to load courses';
                setError(errorMessage);
                logError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserRoleAndCourses();
    }, [supabase, logError]);

    try {
        if (isLoading) {
            return <LoadingSpinner className="w-full h-[400px]" />;
        }

        if (error) {
            return (
                <AlertDialog>
                    <AlertDialogDescription className="text-destructive">
                        {error}
                    </AlertDialogDescription>
                </AlertDialog>
            );
        }

        return (
            <div className="container px-4 py-8 sm:px-6 lg:px-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
                    <p className="text-muted-foreground mt-2">
                        {userRole === 'admin' ? 'Manage all courses' : 'Here\'s an overview of your courses'}
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {courses.map((course) => (
                        <Link 
                            href={`/teacher/courses/${course.id}`}
                            key={course.id}
                        >
                            <CourseCard 
                                course={{
                                    id: parseInt(course.id as string, 10),
                                    title: course.title || '',
                                    description: course.description || '',
                                    imageUrl: course.image_url || '',
                                }} 
                            />
                        </Link>
                    ))}
                </div>
            </div>
        );
    } catch (error) {
        logError(error);
        return <div>Error loading courses page</div>;
    }
}

export default Courses;
