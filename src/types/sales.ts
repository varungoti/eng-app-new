export interface SalesLead {
  id: string;
  name: string;
  company: string;
  schoolname: string;
  location: string;
  branch: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed';
  source: string;
  createdAt: string;
  updatedAt: string;
}


export interface SalesTask {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  due_date: string;
  assigned_to?: string;
  lead_id?: string;
  opportunity_id?: string;
  contact_id?: string;
  created_at: string;
}
export interface SalesActivity {
  id: string;
  leadId: string;
  type: 'call' | 'email' | 'meeting' | 'note';
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesOpportunity {
  id: string;
  leadId: string;
  name: string;
  value: number;
  probability: number;
  status: 'open' | 'won' | 'lost';
  expectedCloseDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalesContact {
  id: string;
  leadId: string;
  name: string;
  title?: string;
  email?: string;
  phone?: string;
  isPrimary: boolean;
  department?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalesStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  qualifiedLeads: number;
  proposalLeads: number;
  closedLeads: number;
  lostLeads: number;
  totalValue: number;
  avgDealSize: number;
  conversionRate: number;
  pipelineValue: number;
}