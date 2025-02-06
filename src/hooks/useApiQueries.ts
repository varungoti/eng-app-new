import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  roll_number: string;
  gender?: string;
  date_of_birth?: string;
  contact_number?: string;
  email?: string;
  guardian_name?: string;
  guardian_contact?: string;
}

interface ClassStudent {
  student_id: any;
  assigned_at: any;
  student: SupabaseStudent;
}

interface ClassAttributes {
  name: string;
  description?: string;
  students?: {
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
  }[];
  lessons?: any[];
  courses?: { data: any[] };
  grade?: {
    id: string;
    name: string;
  };
}

interface ClassData {
  id: string;
  attributes: ClassAttributes;
}

interface ClassesResponse {
  data: ClassData[];
}

interface SupabaseGrade {
  id: string;
  name: string;
}

interface SupabaseStudent {
  id: any;
  name: any;
  email: any;
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
  valid_until: string | null;
}

interface SupabaseClass {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  created_by: string;
  grade: SupabaseGrade;
  class_students: SupabaseClassStudent[];
  assigned_content: SupabaseContent[];
}

interface RawGrade {
  id: string;
  name: string;
}

interface RawStudent {
  id: string;
  name: string;
  email: string;
}

interface RawClassStudent {
  student_id: any;
  assigned_at: any;
  student: {
    id: any;
    name: any;
    email: any;
  }[];
}

interface RawContent {
  id: string;
  content_type: string;
  content_id: string;
  valid_until: string;
}

interface RawClass {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  created_by: string;
  grade: RawGrade | null;
  class_students: RawClassStudent[] | null;
  assigned_content: RawContent[] | null;
}

interface ClassGrade {
  id: string;
  name: string;
}

interface AssignedContent {
  id: string;
  content_type: string;
  content_id: string;
  valid_until: string;
}

interface ClassRecord {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  created_by: string;
  grade: ClassGrade | null;
  class_students: ClassStudent[] | null;
  assigned_content: AssignedContent[] | null;
}
export const useTopics = (topicID: string) => {
  return useQuery({
    queryKey: ['topics', topicID],
    queryFn: () => api.get(`/topics/${topicID}`),
    enabled: !!topicID
  });
};

export const useSubTopics = (topicID: string) => {
  return useQuery({
    queryKey: ['subtopics', topicID],
    queryFn: () => api.get(`/subtopics/${topicID}`),
    enabled: !!topicID
  });
};

export const useLesson = (lessonId: string) => {
  return useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: () => api.get(`/lessons/${lessonId}`),
    enabled: !!lessonId
  });
};

export const useQuestions = (questionsId: string) => {
  return useQuery({
    queryKey: ['questions', questionsId],
    queryFn: () => api.get(`/questions/${questionsId}`),
    enabled: !!questionsId
  });
};

export const useExercisePrompts = (exercise_promptsId: string) => {
  return useQuery({
    queryKey: ['exercise_prompts', exercise_promptsId],
    queryFn: () => api.get(`/exercise_prompts/${exercise_promptsId}`),
    enabled: !!exercise_promptsId
  });
};

export const useActivities = (activitiesId: string) => {
  return useQuery({
    queryKey: ['activities', activitiesId],
    queryFn: () => api.get(`/activities/${activitiesId}`),
    enabled: !!activitiesId
  });
};

export const useUpdateTeacherProgress = () => {
  return useMutation({
    mutationFn: ({ teacherId, data }: { teacherId: string; data: any }) =>
      api.put<any>(`/teachers/${teacherId}/progress`, teacherId, data)
  });
};

export function useClasses(userId: string) {
  return useQuery<ClassesResponse, Error>({
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

        // Base query for all roles - using explicit foreign key references
        const baseQuery = `
          id,
          name,
          description,
          created_at,
          created_by,
          grade:grades (
            id,
            name
          ),
          class_students!left (
            student_id,
            assigned_at,
            student:student_id!inner (
              id,
              name,
              email
            )
          ),
          assigned_content!left (
            id,
            content_type,
            content_id,
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
            // Type guard for grade
            const isValidGrade = (grade: any): grade is SupabaseGrade => {
              return grade && typeof grade === 'object' && 'id' in grade && 'name' in grade;
            };

            // Type guard for student
            const isValidStudent = (student: any): student is SupabaseStudent => {
              return student && typeof student === 'object' && 'id' in student && 'name' in student && 'email' in student;
            };

            // Type guard for class student
            const isValidClassStudent = (cs: any): cs is { student: SupabaseStudent } => {
              return cs && typeof cs === 'object' && cs.student && isValidStudent(cs.student);
            };

            // Type guard for content
            const isValidContent = (content: any): content is SupabaseContent => {
              return content && typeof content === 'object' && 'id' in content && 'content_type' in content && 'content_id' in content;
            };

            // Safely access grade data
            const grade = isValidGrade(cls.grade) ? {
              id: String(cls.grade.id),
              name: String(cls.grade.name)
            } : undefined;

            // Safely transform students with proper type assertions
            const students = Array.isArray(cls.class_students) 
              ? cls.class_students
                  .filter((cs): cs is RawClassStudent => 
                    cs?.student?.[0] && 'id' in cs.student[0] && 'name' in cs.student[0] && 'email' in cs.student[0]
                  )
                  .map((cs) => ({
                    id: String(cs.student[0].id),
                    firstName: String(cs.student[0].name).split(' ')[0] || '',
                    lastName: String(cs.student[0].name).split(' ')[1] || '',
                    email: String(cs.student[0].email),
                    rollNumber: String(cs.student[0].id)
                  }))
              : [];

            // Safely transform lessons with proper type assertions
            const lessons = Array.isArray(cls.assigned_content)
              ? cls.assigned_content
                  .filter(isValidContent)
                  .filter(content => content.content_type === 'LESSON')
                  .map(lesson => ({
                    id: String(lesson.content_id),
                    title: `Lesson ${lesson.id}`,
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
                courses: { data: [] }
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