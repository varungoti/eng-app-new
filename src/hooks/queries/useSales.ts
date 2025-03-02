import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { SalesLead, SalesActivity, SalesOpportunity } from '../../types/sales';

export const useSales = () => {
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['sales_leads'],
    queryFn: () => api.get<SalesLead[]>('sales_leads'),
  });
  
  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['sales_activities'],
    queryFn: () => api.get<SalesActivity[]>('sales_activities'),
  });
  
  const { data: opportunities = [], isLoading: opportunitiesLoading } = useQuery({
    queryKey: ['sales_opportunities'],
    queryFn: () => api.get<SalesOpportunity[]>('sales_opportunities'),
  });

  const createLead = useMutation({
    mutationFn: (lead: Omit<SalesLead, 'id'>) => api.post<SalesLead>('sales_leads', lead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales_leads'] });
    },
  });

  const updateLead = useMutation({
    mutationFn: ({ id, ...data }: Partial<SalesLead> & { id: string }) => 
      api.put<SalesLead>('sales_leads', id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales_leads'] });
    },
  });

  const addActivity = useMutation({
    mutationFn: (activity: Omit<SalesActivity, 'id'>) => 
      api.post<SalesActivity>('sales_activities', activity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales_activities'] });
    },
  });

  // Calculate sales stats - using type assertions for safety
  const stats = {
    totalLeads: (leads as any[]).length,
    qualifiedLeads: (leads as any[]).filter(l => l?.status === 'qualified').length,
    wonDeals: (leads as any[]).filter(l => l?.status === 'won').length,
    pipelineValue: (opportunities as any[]).reduce((sum, opp) => sum + (opp?.amount || 0), 0),
    conversionRate: (leads as any[]).length > 0 
      ? ((leads as any[]).filter(l => l?.status === 'won').length / (leads as any[]).length) * 100 
      : 0,
  };

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