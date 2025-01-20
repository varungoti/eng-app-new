import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useExercise = (exerciseId: string) => {
  return useQuery({
    queryKey: ['exercise', exerciseId],
    queryFn: () => api.get(`/exercises/${exerciseId}`),
    enabled: !!exerciseId
  });
};

export const useUpdateTeacherProgress = () => {
  return useMutation({
    mutationFn: ({ teacherId, data }: { teacherId: string; data: any }) =>
      api.put<any>(`/teachers/${teacherId}/progress`, teacherId, data)
  });
}; 