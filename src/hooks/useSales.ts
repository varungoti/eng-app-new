import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import { api } from '../lib/api';
import { useToast } from './useToast';
import { useDataLoadTimeout } from './useDataLoadTimeout';
import { useCache } from './useCache';
import type { SalesLead, SalesActivity, SalesOpportunity } from '../types/sales';

export const useSales = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { cache } = useCache();
  const { clearTimeout } = useDataLoadTimeout({
    timeout: 30000,
    source: 'useSales',
    onTimeout: () => {
      showToast('Failed to load sales data', { type: 'error' });
    }
  });

  const mounted = React.useRef(true);
  const queryStartTime = React.useRef(Date.now());

  // Use stale time and cache time to prevent unnecessary refetches
  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['sales_leads'],
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
    meta: {
      source: 'useSales'
    },
    queryFn: async () => {
      // Check cache first
      const cached = cache.get<SalesLead[]>('sales_leads');
      if (cached) return cached;

      const { data, error } = await supabase
        .from('sales_leads')
        .select('*')
        .throwOnError()
        .order('created_at', { ascending: false });
      
      if (error) {
        logger.error('Failed to fetch sales leads', {
          context: { error },
          source: 'useSales'
        });
        throw error;
      }

      if (data) {
        cache.set('sales_leads', data, 5 * 60 * 1000); // 5 minute TTL
      }
      return (data || []).map(lead => ({
        id: lead.id,
        companyName: lead.company_name,
        contactName: lead.contact_name,
        email: lead.email,
        phone: lead.phone,
        status: lead.status,
        source: lead.source,
        assignedTo: lead.assigned_to,
        estimatedValue: lead.estimated_value,
        probability: lead.probability,
        expectedCloseDate: lead.expected_close_date ? new Date(lead.expected_close_date) : undefined,
        notes: lead.notes,
        createdAt: new Date(lead.created_at),
        updatedAt: new Date(lead.updated_at)
      }));
    }
  });

  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['sales_activities'],
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
    queryFn: async () => {
      const cached = cache.get<SalesActivity[]>('sales_activities');
      if (cached) return cached;

      const { data, error } = await supabase
        .from('sales_activities')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) {
        cache.set('sales_activities', data, 5 * 60 * 1000);
      }
      return (data || []).map(activity => ({
        id: activity.id,
        leadId: activity.lead_id,
        type: activity.type,
        subject: activity.subject,
        description: activity.description,
        status: activity.status,
        dueDate: activity.due_date ? new Date(activity.due_date) : undefined,
        completedAt: activity.completed_at ? new Date(activity.completed_at) : undefined,
        performedBy: activity.performed_by,
        createdAt: new Date(activity.created_at)
      }));
    },
    meta: {
      source: 'useSales'
    }
  });

  const { data: opportunities = [], isLoading: opportunitiesLoading } = useQuery({
    queryKey: ['sales_opportunities'], 
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 10000),
    queryFn: async () => {
      const cached = cache.get<SalesOpportunity[]>('sales_opportunities');
      if (cached) return cached;

      const { data, error } = await supabase
        .from('sales_opportunities')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      if (data) {
        cache.set('sales_opportunities', data, 5 * 60 * 1000);
      }
      return data || [];
    },
    meta: {
      source: 'useSales'
    }
  });

  // Update loading state when queries complete
  React.useEffect(() => {
    if (!leadsLoading && !activitiesLoading && !opportunitiesLoading) {
      const loadTime = Date.now() - queryStartTime.current;
      logger.info('Sales data loaded', {
        context: { loadTime },
        source: 'useSales'
      });
      clearTimeout();
    }
  }, [leadsLoading, activitiesLoading, opportunitiesLoading, clearTimeout]);

  React.useEffect(() => {
    return () => {
      mounted.current = false;
      clearTimeout();
    };
  }, [clearTimeout]);

  // Memoize stats calculation to prevent unnecessary recalculations
  const stats = useMemo(() => ({
    totalLeads: leads.length,
    qualifiedLeads: leads.filter(l => l.status === 'qualified').length,
    wonDeals: leads.filter(l => l.status === 'won').length,
    pipelineValue: opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0),
    conversionRate: leads.length > 0 ? (leads.filter(l => l.status === 'won').length / leads.length) * 100 : 0,
  }), [leads, opportunities]);

  React.useEffect(() => {
    return () => {
      if (mounted.current) {
        clearTimeout();
      }
    };
  }, [clearTimeout]);

  const createLead = useMutation({
    mutationFn: (lead: Omit<SalesLead, 'id'>) => api.post('sales_leads', lead),
    onSuccess: () => {
      // Invalidate and refetch only if needed
      queryClient.invalidateQueries({ 
        queryKey: ['sales_leads'],
        refetchType: 'active'
      });
      showToast('Lead created successfully', { type: 'success' });
      clearTimeout();
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : 'Failed to create lead', { type: 'error' });
    }
  });

  const updateLead = useMutation({
    mutationFn: ({ id, ...data }: Partial<SalesLead> & { id: string }) => 
      api.put('sales_leads', id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['sales_leads'],
        refetchType: 'active'
      });
      showToast('Lead updated successfully', { type: 'success' });
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : 'Failed to update lead', { type: 'error' });
    }
  });

  const addActivity = useMutation({
    mutationFn: (activity: Omit<SalesActivity, 'id'>) => 
      api.post('sales_activities', activity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales_activities'] });
      showToast('Activity added successfully', { type: 'success' });
    },
    onError: (error) => {
      showToast(error instanceof Error ? error.message : 'Failed to add activity', { type: 'error' });
    }
  });

  return {
    leads,
    activities,
    opportunities,
    stats,
    loading: leadsLoading || activitiesLoading || opportunitiesLoading,
    createLead,
    updateLead,
    addActivity,
  };
};