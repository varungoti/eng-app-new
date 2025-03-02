import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  rollNumber: string;
  gender?: string;
  dateOfBirth?: string;
  contactNumber?: string;
  email?: string;
  guardianName?: string;
  guardianContact?: string;
}

interface ClassStudent {
  student_id: string;
  assigned_at: string;
  student: SupabaseStudent;
}

interface ClassAttributes {
  name: string;
  description?: string;
  students?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    rollNumber: string;
  }[];
  lessons?: any[];
  topics?: any[];
  subtopics?: any[];
  courses?: { data: any[] };
  grade?: {
    id: string;
    name: string;
    level?: number;
  };
  created_at?: string;
  updated_at?: string;
}

interface ClassData {
  id: string;
  attributes: ClassAttributes;
}

export interface ClassesResponse {
  data: ClassData[];
}

interface SupabaseGrade {
  id: string;
  name: string;
  level: number;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

interface SupabaseStudent {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  roll_number?: string;
}

interface SupabaseClassStudent {
  student_id: string;
  assigned_at: string;
  student: SupabaseStudent;
}

interface SupabaseContent {
  id: string;
  content_type: string;
  content_id: string;
  valid_from?: string;
  valid_until?: string;
}

export interface SupabaseClass {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at?: string;
  created_by: string;
  grade_id?: string;
  grade?: SupabaseGrade;
  class_students?: SupabaseClassStudent[];
  assigned_content?: SupabaseContent[];
  max_students?: number;
}

export interface RawGrade {
  id: string;
  name: string;
}

export interface RawStudent {
  id: string;
  name: string;
  email: string;
}

export interface RawClassStudent {
  student_id: any;
  assigned_at: any;
  student: {
    id: any;
    name: any;
    email: any;
  }[];
}

export interface RawContent {
  id: string;
  content_type: string;
  content_id: string;
  valid_until: string;
}

export interface RawClass {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  created_by: string;
  grade?: SupabaseGrade;
  class_students?: any[];
  assigned_content?: any[];
}

export interface ClassGrade {
  id: string;
  name: string;
}

export interface AssignedContent {
  id: string;
  content_type: string;
  content_id: string;
  valid_until: string;
}

export interface ClassRecord {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  created_by: string;
  grade?: SupabaseGrade;
  class_students?: ClassStudent[];
  assigned_content?: SupabaseContent[];
}

export const useTopics = (gradeId: string) => {
  return useQuery({
    queryKey: ['topics', gradeId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('topics')
        .select('*')
        .eq('grade_id', gradeId)
        .order('order_index');
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!gradeId
  });
};

export const useSubTopics = (topicId: string) => {
  return useQuery({
    queryKey: ['subtopics', topicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subtopics')
        .select('*')
        .eq('topic_id', topicId)
        .order('order_index');
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!topicId
  });
};

export const useLesson = (lessonId: string) => {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select(`
          *,
          questions(*)
        `)
        .eq('id', lessonId)
        .single();
        
      if (error) throw error;
      return data;
    },
    enabled: !!lessonId
  });
};

export const useLessons = (subtopicId: string) => {
  return useQuery({
    queryKey: ['lessons', subtopicId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .eq('subtopic_id', subtopicId)
        .order('order_index');
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!subtopicId
  });
};

export const useQuestions = (lessonId: string) => {
  return useQuery({
    queryKey: ['questions', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('questions')
        .select(`
          *,
          exercise_prompts(*)
        `)
        .eq('lesson_id', lessonId)
        .order('order_index');
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!lessonId
  });
};

export const useExercisePrompts = (questionId: string) => {
  return useQuery({
    queryKey: ['exercise_prompts', questionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('exercise_prompts')
        .select('*')
        .eq('question_id', questionId)
        .order('order_index');
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!questionId
  });
};

export const useActivities = (lessonId: string) => {
  return useQuery({
    queryKey: ['activities', lessonId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('lesson_id', lessonId)
        .order('order_index');
        
      if (error) throw error;
      return data || [];
    },
    enabled: !!lessonId
  });
};

export const useUpdateTeacherProgress = () => {
  return useMutation({
    mutationFn: ({ teacherId, data }: { teacherId: string; data: any }) =>
      api.put<any>(`/teachers/${teacherId}/progress`, teacherId, data)
  });
};

export function useClasses(userId: string) {
  return useQuery<any, Error>({
    queryKey: ['classes', userId],
    queryFn: async () => {
      try {
        // First get the user's session and role
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user?.id) {
          throw new Error('No authenticated user found');
        }

        const userRole = session.user.user_metadata?.role?.toUpperCase();
        console.log('Fetching classes for role:', userRole);

        // Updated query for the new schema
        const baseQuery = `
          id,
          name,
          description,
          created_at,
          created_by,
          grade:grade_id (
            id,
            name,
            level
          ),
          class_students!left (
            student_id,
            assigned_at,
            student:students!inner (
              id,
              first_name,
              last_name,
              email,
              roll_number
            )
          ),
          assigned_content!left (
            id,
            content_type,
            content_id,
            valid_from,
            valid_until
          )
        `;

        // Execute query based on role with error handling
        let query = supabase
          .from('classes')
          .select(baseQuery);

        // Add role-based filtering
        if (userRole !== 'SUPER_ADMIN' && userRole !== 'ADMIN') {
          query = query.eq('created_by', userId);
        }

        // Add ordering
        query = query.order('created_at', { ascending: false });

        // Execute query with proper error handling
        const { data: rawData, error: classesError } = await query;

        if (classesError) {
          console.error('Error fetching classes:', classesError);
          return { data: [] };
        }

        if (!rawData || !Array.isArray(rawData)) {
          console.log('No classes data available or invalid format');
          return { data: [] };
        }

        // Transform the data to match the expected format with safe access
        const transformedData = {
          data: rawData.map(cls => {
            // Type assertions to help TypeScript understand the structure
            const gradeData = cls.grade as any;
            const classStudents = cls.class_students as any[] || [];
            
            // Safely access grade data
            const grade = gradeData ? {
              id: String(gradeData.id || ''),
              name: String(gradeData.name || ''),
              level: gradeData.level
            } : undefined;

            // Safely transform students
            const students = Array.isArray(classStudents) 
              ? classStudents
                  .filter(cs => cs?.student && typeof cs.student === 'object')
                  .map(cs => {
                    const studentData = cs.student as any;
                    return {
                      id: String(studentData.id || ''),
                      firstName: String(studentData.first_name || ''),
                      lastName: String(studentData.last_name || ''),
                      email: String(studentData.email || ''),
                      rollNumber: String(studentData.roll_number || studentData.id || '')
                    };
                  })
              : [];

            // Safely transform lessons
            const assignedContent = cls.assigned_content as any[] || [];
            const lessons = Array.isArray(assignedContent)
              ? assignedContent
                  .filter(content => content && content.content_type === 'LESSON')
                  .map(lesson => ({
                    id: String(lesson.content_id || ''),
                    title: `Lesson ${lesson.id}`,
                    validFrom: lesson.valid_from,
                    validUntil: lesson.valid_until
                  }))
              : [];

            return {
              id: String(cls.id),
              attributes: {
                name: String(cls.name),
                description: String(cls.description || ''),
                grade,
                students,
                lessons,
                courses: { data: [] },
                created_at: cls.created_at
              }
            };
          })
        };

        console.log('Successfully transformed classes data:', {
          count: transformedData.data.length,
          sample: transformedData.data[0]
        });

        return transformedData;

      } catch (error) {
        console.error('Error in useClasses:', error);
        return { data: [] };
      }
    },
    enabled: !!userId,
    retry: 2,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchOnReconnect: false,
    refetchInterval: false
  });
}

export const useCourse = (courseId: string) => {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: () => api.get(`/courses/${courseId}`),
    enabled: !!courseId
  }); 
};

export const useGrades = () => {
  return useQuery({
    queryKey: ['grades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .order('level');
        
      if (error) throw error;
      return data || [];
    }
  });
};

export const useStudents = (classId?: string) => {
  return useQuery({
    queryKey: ['students', classId],
    queryFn: async () => {
      let query = supabase
        .from('students')
        .select('*');
        
      if (classId) {
        const { data: classStudents, error: csError } = await supabase
          .from('class_students')
          .select('student_id')
          .eq('class_id', classId);
          
        if (csError) throw csError;
        
        if (classStudents && classStudents.length > 0) {
          const studentIds = classStudents.map(cs => cs.student_id);
          query = query.in('id', studentIds);
        } else {
          return [];
        }
      }
      
      const { data, error } = await query;
      if (error) throw error;
      return data || [];
    },
    enabled: true
  });
}; 