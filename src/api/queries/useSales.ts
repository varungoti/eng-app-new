import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import type { SalesLead, SalesActivity, SalesOpportunity } from '../../types/sales';

export const useSales = () => {
  const queryClient = useQueryClient();

  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ['sales_leads'],
    queryFn: () => api.get('sales_leads'),
  });

  const { data: activities = [], isLoading: activitiesLoading } = useQuery({
    queryKey: ['sales_activities'],
    queryFn: () => api.get('sales_activities'),
  });

  const { data: opportunities = [], isLoading: opportunitiesLoading } = useQuery({
    queryKey: ['sales_opportunities'],
    queryFn: () => api.get('sales_opportunities'),
  });

  const createLead = useMutation({
    mutationFn: (lead: Omit<SalesLead, 'id'>) => api.post('sales_leads', lead),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales_leads'] });
    },
  });

  const updateLead = useMutation({
    mutationFn: ({ id, ...data }: Partial<SalesLead> & { id: string }) => 
      api.put('sales_leads', id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales_leads'] });
    },
  });

  const addActivity = useMutation({
    mutationFn: (activity: Omit<SalesActivity, 'id'>) => 
      api.post('sales_activities', activity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sales_activities'] });
    },
  });

  // Calculate sales stats
  const stats = {
    totalLeads: leads.length,
    qualifiedLeads: leads.filter(l => l.status === 'qualified').length,
    wonDeals: leads.filter(l => l.status === 'won').length,
    pipelineValue: opportunities.reduce((sum, opp) => sum + (opp.amount || 0), 0),
    conversionRate: leads.length > 0 ? (leads.filter(l => l.status === 'won').length / leads.length) * 100 : 0,
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