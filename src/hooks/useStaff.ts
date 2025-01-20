import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useToast } from './useToast';
import { logger } from '../lib/logger';
import type { Staff } from '../types/staff';
import { useMutation } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';

export const useStaff = () => {
  const [staff, setStaff] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      setError(null);
      
      // Add retry logic
      let attempts = 0;
      const maxAttempts = 3;
      
      while (attempts < maxAttempts) {
        try {
          const { data, error: fetchError } = await supabase
            .from('staff')
            .select('*, schools (name)')
            .order('created_at', { ascending: false });

          if (fetchError) throw fetchError;
          setStaff(data as unknown as Staff[] || []);
          break; // Success - exit retry loop
        } catch (err) {
          attempts++;
          if (attempts === maxAttempts) throw err;
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.min(1000 * Math.pow(2, attempts), 5000)));
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch staff';
      setError(message);
      logger.error(message, {
        context: { error: err },
        source: 'useStaff'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const addStaff = async (staffData: Omit<Staff, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error: createError } = await supabase
        .from('staff')
        .insert([staffData])
        .select()
        .single();

      if (createError) throw createError;
      
      setStaff(prev => [data as unknown as Staff, ...prev]);
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add staff member';
      logger.error(message, {
        context: { error: err, staffData },
        source: 'useStaff'
      });
      throw err;
    }
  };

  const updateStaff = useMutation({
    mutationFn: async (data: { id: string; updates: Partial<Staff> }) => {
      const { data: updatedStaff, error } = await supabase
        .from('staff')
        .update(data.updates)
        .eq('id', data.id)
        .select()
        .single();
      
      if (error) throw error;
      return void 0; // Return void instead of the data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    }
  });

  const deleteStaff = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return void 0;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
    }
  });

  const inviteStaff = async (email: string, role: string) => {
    try {
      // Create user with Supabase auth
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { role }
      });

      if (authError) throw authError;

      // Create staff record
      const { data: staffData, error: staffError } = await supabase
        .from('staff')
        .insert([{
          user_id: authData.user.id,
          email,
          role,
          status: 'pending'
        }])
        .select()
        .single();

      if (staffError) throw staffError;

      setStaff(prev => [staffData as unknown as Staff, ...prev]);
      return staffData;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to invite staff member';
      logger.error(message, {
        context: { error: err, email, role },
        source: 'useStaff'
      });
      throw err;
    }
  };

  return {
    staff,
    loading,
    error,
    addStaff,
    updateStaff,
    deleteStaff,
    inviteStaff,
    refresh: fetchStaff
  };
};