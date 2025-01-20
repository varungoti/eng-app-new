import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Grade } from '../types';

export function useGrades() {
  return useQuery({
    queryKey: ['grades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Grade[];
    }
  });
} 