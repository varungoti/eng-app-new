import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import { useDataLoadTimeout } from './useDataLoadTimeout';
//import type { Student } from '../types';

type DatabaseStudent = {
  id: string;
  name: string;
  roll_number: string;
  school_id: string;
  grade_id: string;
  gender: string;
  date_of_birth: string;
  contact_number: string;
  email: string;
  address: string;
  guardian_name: string;
  guardian_contact: string;
  created_at: string;
  updated_at: string;
  school: { name: string };
  grade: { name: string };
};

type StudentInput = {
  name: string;
  rollNumber: string;
  schoolId: string;
  gradeId: string;
  gender: string;
  dateOfBirth: Date;
  contactNumber: string;
  email: string;
  studentAddress: string;
  guardianName: string;
  guardianContact: string;
};

type StudentUpdate = {
  id: string;
  name?: string;
  rollNumber?: string;
  schoolId?: string;
  gradeId?: string;
  gender?: string;
  dateOfBirth?: Date;
  contactNumber?: string;
  email?: string;
  studentAddress?: string;
  guardianName?: string;
  guardianContact?: string;
};

export const useStudents = () => {
  const queryClient = useQueryClient();
  const { clearTimeout } = useDataLoadTimeout({
    source: 'useStudents',
    onTimeout: () => {
      logger.error('Failed to load students data', { source: 'useStudents' });
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

      return (studentsData as unknown as DatabaseStudent[]).map((student) => ({
        id: student.id,
        name: student.name,
        rollNumber: student.roll_number,
        schoolId: student.school_id,
        gradeId: student.grade_id,
        gender: student.gender,
        dateOfBirth: new Date(student.date_of_birth),
        contactNumber: student.contact_number,
        email: student.email,
        studentAddress: student.address,
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
    mutationFn: async (student: StudentInput) => {
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
          address: student.studentAddress,
          guardian_name: student.guardianName,
          guardian_contact: student.guardianContact
        }])
        .select()
        .single();

      if (error) throw error;
      return data as unknown as DatabaseStudent;
    },
    onSuccess: () => {
      clearTimeout();
      queryClient.invalidateQueries({ queryKey: ['students'] });
    }
  });

  const updateStudent = useMutation({
    mutationFn: async ({ id, ...updates }: StudentUpdate) => {
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
          address: updates.studentAddress,
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