import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import { useDataLoadTimeout } from './useDataLoadTimeout';
import type { School } from '../types';

export const useSchools = () => {
  const queryClient = useQueryClient();
  const { clearTimeout } = useDataLoadTimeout({
    source: 'useSchools',
    onTimeout: () => {
      logger.warn('Schools data load timeout - retrying', {
        source: 'useSchools'
      });
    }
  });

  // Fetch schools with grades
  const { data: schools = [], isLoading, error } = useQuery({
    queryKey: ['schools'],
    meta: {
      source: 'useSchools'
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('schools')
        .select(`
          *,
          school_grades (
            grade_id
          )
        `)
        .order('name');

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      clearTimeout();
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
    onError: (error) => {
      logger.error('Failed to load schools', {
        context: { error },
        source: 'useSchools'
      });
    }
  });

  // Add school mutation
  const addSchool = useMutation({
    mutationFn: async (school: Omit<School, 'id'>) => {
      logger.info('Adding new school', {
        context: { school },
        source: 'useSchools'
      });

      // Insert school
      const { data: schoolData, error: schoolError } = await supabase
        .from('schools')
        .insert([{
          name: school.name,
          type: school.type || 'main',
          parent_id: school.parentId,
          address: school.address,
          latitude: school.latitude,
          longitude: school.longitude,
          contact_number: school.contactNumber,
          email: school.email,
          status: school.status,
          capacity: school.capacity,
          principal_name: school.principalName
        }])
        .select()
        .single();

      if (schoolError) throw schoolError;

      // Insert grade associations if provided
      if (school.grades?.length) {
        const { error: gradesError } = await supabase
          .from('school_grades')
          .insert(
            school.grades.map(gradeId => ({
              school_id: schoolData.id,
              grade_id: gradeId
            }))
          );

        if (gradesError) throw gradesError;
      }

      return schoolData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
    onError: (error) => {
      logger.error('Failed to add school', {
        context: { error },
        source: 'useSchools'
      });
    }
  });

  // Update school mutation
  const updateSchool = useMutation({
    mutationFn: async ({ id, ...updates }: School) => {
      logger.info('Updating school', {
        context: { id, updates },
        source: 'useSchools'
      });

      // Update school
      const { error: schoolError } = await supabase
        .from('schools')
        .update({
          name: updates.name,
          type: updates.type,
          parent_id: updates.parentId,
          address: updates.address,
          latitude: updates.latitude,
          longitude: updates.longitude,
          contact_number: updates.contactNumber,
          email: updates.email,
          status: updates.status,
          capacity: updates.capacity,
          principal_name: updates.principalName
        })
        .eq('id', id);

      if (schoolError) throw schoolError;

      // Update grades if provided
      if (updates.grades) {
        // Delete existing grades
        const { error: deleteError } = await supabase
          .from('school_grades')
          .delete()
          .eq('school_id', id);

        if (deleteError) throw deleteError;

        // Insert new grades
        if (updates.grades.length > 0) {
          const { error: gradesError } = await supabase
            .from('school_grades')
            .insert(
              updates.grades.map(gradeId => ({
                school_id: id,
                grade_id: gradeId
              }))
            );

          if (gradesError) throw gradesError;
        }
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
    onError: (error) => {
      logger.error('Failed to update school', {
        context: { error },
        source: 'useSchools'
      });
    }
  });

  // Delete school mutation
  const deleteSchool = useMutation({
    mutationFn: async (id: string) => {
      logger.info('Deleting school', {
        context: { id },
        source: 'useSchools'
      });

      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
    onError: (error) => {
      logger.error('Failed to delete school', {
        context: { error },
        source: 'useSchools'
      });
    }
  });

  return {
    schools,
    loading: isLoading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    addSchool,
    updateSchool,
    deleteSchool,
  };
};