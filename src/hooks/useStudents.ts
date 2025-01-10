import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import { useDataLoadTimeout } from './useDataLoadTimeout';
import type { Student } from '../types';

export const useStudents = () => {
  const queryClient = useQueryClient();
  const { clearTimeout } = useDataLoadTimeout({
    source: 'useStudents',
    onTimeout: () => {
      logger.error('Failed to load students data', {
        source: 'useStudents'
      });
    }
  });

  const { data: students = [], isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data: studentsData, error: fetchError } = await supabase
        .from('students')
        .select(`
          *,
          school:schools(name),
          grade:grades(name)
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      if (!studentsData) return [];

      return (studentsData || []).map(student => ({
        id: student.id,
        name: student.name,
        rollNumber: student.roll_number,
        schoolId: student.school_id,
        gradeId: student.grade_id,
        gender: student.gender,
        dateOfBirth: new Date(student.date_of_birth),
        contactNumber: student.contact_number,
        email: student.email,
        address: student.address,
        guardianName: student.guardian_name,
        guardianContact: student.guardian_contact,
        createdAt: new Date(student.created_at),
        updatedAt: new Date(student.updated_at),
        school: student.school,
        grade: student.grade
      }));
    },
    meta: { source: 'useStudents' }
  });

  const addStudent = useMutation({
    mutationFn: async (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
      const { data, error } = await supabase
        .from('students')
        .insert([{
          name: student.name,
          roll_number: student.rollNumber,
          school_id: student.schoolId,
          grade_id: student.gradeId,
          gender: student.gender,
          date_of_birth: student.dateOfBirth.toISOString(),
          contact_number: student.contactNumber,
          email: student.email,
          address: student.address,
          guardian_name: student.guardianName,
          guardian_contact: student.guardianContact
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      clearTimeout();
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });

  const updateStudent = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Student> & { id: string }) => {
      const { error } = await supabase
        .from('students')
        .update({
          name: updates.name,
          roll_number: updates.rollNumber,
          school_id: updates.schoolId,
          grade_id: updates.gradeId,
          gender: updates.gender,
          date_of_birth: updates.dateOfBirth?.toISOString(),
          contact_number: updates.contactNumber,
          email: updates.email,
          address: updates.address,
          guardian_name: updates.guardianName,
          guardian_contact: updates.guardianContact
        })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });

  const deleteStudent = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });

  return {
    students,
    loading: isLoading,
    error,
    addStudent,
    updateStudent,
    deleteStudent
  };
};