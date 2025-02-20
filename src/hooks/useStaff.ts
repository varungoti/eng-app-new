import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import { useAuth } from './useAuth';
import { useToast } from './useToast';
import type { Staff } from '../types';

export function useStaff() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { showToast } = useToast();

  // Fetch staff members
  const { data: staff = [], isLoading: loading, error } = useQuery({
    queryKey: ['staff'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('staff')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          logger.error('Failed to fetch staff', {
            context: { error },
            source: 'useStaff'
          });
          throw error;
        }

        return data || [];
      } catch (err) {
        logger.error('Error in staff query', {
          context: { error: err },
          source: 'useStaff'
        });
        throw err;
      }
    },
    enabled: !!user
  });

  // Add staff mutation
  const addStaff = useMutation({
    mutationFn: async (newStaff: Omit<Staff, 'id'>) => {
      try {
        // Get current auth session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (!session) throw new Error('No active session');

        // Add authorization header
        const { data, error } = await supabase
          .from('staff')
          .insert([{
            name: newStaff.name,
            email: newStaff.email,
            role: newStaff.role,
            department: newStaff.department,
            school_id: newStaff.school_id,
            status: 'active'
          }])
          .select()
          .single();

        if (error) {
          logger.error('Failed to add staff member', {
            context: { error, newStaff },
            source: 'useStaff'
          });
          throw error;
        }

        return data;
      } catch (err) {
        logger.error('Error in add staff mutation', {
          context: { error: err },
          source: 'useStaff'
        });
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      showToast('Staff member added successfully', { type: 'success' });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to add staff member';
      showToast(message, { type: 'error' });
      logger.error(message, {
        context: { error },
        source: 'useStaff'
      });
    }
  });

  // Update staff mutation
  const updateStaff = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Staff> }) => {
      try {
        const { error } = await supabase
          .from('staff')
          .update(updates)
          .eq('id', id);

        if (error) throw error;
        return true;
      } catch (err) {
        logger.error('Failed to update staff member', {
          context: { error: err },
          source: 'useStaff'
        });
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      showToast('Staff member updated successfully', { type: 'success' });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to update staff member';
      showToast(message, { type: 'error' });
    }
  });

  // Delete staff mutation
  const deleteStaff = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('staff')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return true;
      } catch (err) {
        logger.error('Failed to delete staff member', {
          context: { error: err },
          source: 'useStaff'
        });
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      showToast('Staff member deleted successfully', { type: 'success' });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : 'Failed to delete staff member';
      showToast(message, { type: 'error' });
    }
  });

  // Invite staff member
  const inviteStaff = async (email: string, role: string) => {
    try {
      // First check if user already exists
      const { data: existingStaff, error: checkError } = await supabase
        .from('staff')
        .select('*')
        .eq('email', email)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingStaff) {
        throw new Error('Staff member with this email already exists');
      }

      // Send invitation through Supabase Auth
      const { data, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(email, {
        data: {
          role,
          invited_by: user?.id
        }
      });

      if (inviteError) throw inviteError;

      return data;
    } catch (err) {
      logger.error('Failed to invite staff member', {
        context: { error: err },
        source: 'useStaff'
      });
      throw err;
    }
  };

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: ['staff'] });
  };

  return {
    staff,
    loading,
    error: error instanceof Error ? error.message : error ? String(error) : null,
    addStaff,
    updateStaff,
    deleteStaff,
    inviteStaff,
    refresh
  };
}