import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { School } from '../../types';

export const useSchools = () => {
  const queryClient = useQueryClient();

  const { data: schools = [], isLoading, error } = useQuery({
    queryKey: ['schools'],
    queryFn: () => api.get<School[]>('schools'),
  });

  const addSchool = useMutation({
    mutationFn: (school: Omit<School, 'id'>) => api.post<School>('schools', school),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });

  const updateSchool = useMutation({
    mutationFn: ({ id, ...data }: Partial<School> & { id: string }) => 
      api.put<School>('schools', id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });

  const deleteSchool = useMutation({
    mutationFn: (id: string) => api.delete('schools', id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schools'] });
    },
  });

  return {
    schools,
    loading: isLoading,
    error,
    addSchool,
    updateSchool,
    deleteSchool,
  };
};