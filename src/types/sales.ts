export interface SalesLead {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone?: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  source?: string;
  assignedTo?: string;
  estimatedValue?: number;
  probability?: number;
  expectedCloseDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SalesActivity {
  id: string;
  leadId: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  subject: string;
  description?: string;
  status?: 'planned' | 'completed' | 'cancelled';
  dueDate?: Date;
  completedAt?: Date;
  performedBy: string;
  createdAt: Date;
}

export interface SalesOpportunity {
  id: string;
  leadId: string;
  name: string;
  stage: 'discovery' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  amount?: number;
  closeDate?: Date;
  probability?: number;
  nextStep?: string;
  competition?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
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
  qualifiedLeads: number;
  proposalsSent: number;
  wonDeals: number;
  lostDeals: number;
  totalValue: number;
  avgDealSize: number;
  conversionRate: number;
  pipelineValue: number;
}