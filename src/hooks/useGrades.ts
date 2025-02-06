"use client";

import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';

export interface Grade {
  id: string;
  name: string;
  level: number;
  description?: string;
}

export function useGrades() {
  return useQuery<Grade[], PostgrestError>({
    queryKey: ['grades'],
    queryFn: async () => {
      console.log('Fetching grades from database...');
      
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .order('level', { ascending: true });
      
      if (error) {
        console.error('Error fetching grades:', error);
        throw error;
      }

      console.log('Fetched grades:', data);

      if (!data || data.length === 0) {
        console.warn('No grades found in the database');
      }

      return data as Grade[];
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2
  });
} 
