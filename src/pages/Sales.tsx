import React, { useState, useEffect } from 'react';
import { Plus, Phone, Mail, Calendar, FileText, Users, DollarSign, Table, List, TrendingUp, Target, Activity } from 'lucide-react';
import { formatCurrency, formatPercent, formatNumber } from '../lib/utils/format';
import { useSales } from '../hooks/useSales';
import { useDashboard } from '../hooks/useDashboard';
import LoadingSpinner from '../components/LoadingSpinner';
import type { SalesLead } from '../types/sales';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion';
import SalesTable from '../components/SalesTable';
import { StatsWidget, ChartWidget, ListWidget } from '../components/widgets';

const LEAD_STATUS_COLORS = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-indigo-100 text-indigo-800',
  proposal: 'bg-purple-100 text-purple-800',
  negotiation: 'bg-pink-100 text-pink-800',
  won: 'bg-green-100 text-green-800',
  lost: 'bg-red-100 text-red-800',
};

const Sales: React.FC = () => {
  // Hooks
  const { leads = [], activities = [], opportunities = [], stats, loading, createLead, updateLead, addActivity } = useSales();
  const [isAddLeadOpen, setIsAddLeadOpen] = useState<boolean>(false);
  const [selectedLead, setSelectedLead] = useState<SalesLead | null>(null); 
  const [viewMode, setViewMode] = useState<'list' | 'table'>('list');
  const [loadError, setLoadError] = useState<string | null>(null);

  if (loading) {
    return (
      <LoadingSpinner 
        message="Loading sales data..."
        timeout={30000}
        showRetry={true}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (loadError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800">Error</h3>
        <p className="mt-2 text-sm text-red-600">{loadError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Sales Pipeline</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage leads and track sales activities
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('list')}
              title="List View"
              aria-label="Switch to List View"
              className={`p-2 rounded ${
                viewMode === 'list'
                  ? 'bg-white shadow text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              aria-label="Switch to Table View"
              className={`p-2 rounded ${
                viewMode === 'table'
                  ? 'bg-white shadow text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Table className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={() => setIsAddLeadOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-6">
        <StatsWidget
          id="sales-overview"
          title="Sales Overview"
          stats={[
            {
              icon: Users,
              label: "Total Leads",
              value: stats?.totalLeads || 0,
              trend: "up",
              subtext: `${stats?.qualifiedLeads || 0} qualified`
            },
            {
              icon: DollarSign,
              label: "Pipeline Value",
              value: formatCurrency(stats?.pipelineValue || 0),
              trend: "up",
              subtext: "Current pipeline"
            },
            {
              icon: Target,
              label: "Won Deals",
              value: stats?.wonDeals || 0,
              trend: "up",
              subtext: formatCurrency(stats?.pipelineValue || 0)
            },
            {
              icon: TrendingUp,
              label: "Conversion Rate",
              value: `${(stats?.conversionRate || 0).toFixed(1)}%`,
              trend: stats?.conversionRate > 30 ? "up" : "down",
              subtext: "Last 30 days"
            }
          ]}
        />
      </div>

      {/* Activity Feed */}
      <div className="mb-8">
        <ListWidget
          id="recent-activities"
          title="Recent Activities"
          items={activities.slice(0, 5).map(activity => ({
            icon: Activity,
            title: activity.subject,
            subtitle: activity.description,
            timestamp: new Date(activity.createdAt).toLocaleDateString(),
            status: {
              label: activity.type,
              color: 'bg-blue-100 text-blue-800'
            }
          }))}
        />
      </div>

      {/* Pipeline Stages */}
      <div className="mb-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Pipeline Stages</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(LEAD_STATUS_COLORS).map(([status, colorClass]) => {
            const stageLeads = leads.filter(lead => lead.status === status);
            const stageValue = opportunities
              .filter(opp => stageLeads.some(lead => lead.id === opp.leadId))
              .reduce((sum, opp) => sum + (opp.amount || 0), 0);

            return (
              <div key={status} className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    {stageLeads.length}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {formatCurrency(stageValue)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Leads List/Table */}
      {viewMode === 'table' ? (
        <SalesTable
          leads={leads}
          opportunities={opportunities}
          onLeadClick={setSelectedLead}
        />
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Active Leads
            </h3>
          </div>
          <div className="border-t border-gray-200">
            <Accordion type="single" collapsible>
              {leads.map((lead) => (
                <AccordionItem key={lead.id} value={lead.id}>
                  <AccordionTrigger className="px-4 py-5 sm:px-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-medium text-gray-900">
                            {lead.companyName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {lead.contactName}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            LEAD_STATUS_COLORS[lead.status as keyof typeof LEAD_STATUS_COLORS]
                          }`}
                        >
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 py-5 sm:px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Contact Information
                        </h4>
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-500">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {lead.phone || 'N/A'}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            {lead.email || 'N/A'}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            {lead.expectedCloseDate
                              ? new Date(lead.expectedCloseDate).toLocaleDateString()
                              : 'N/A'}
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">
                          Lead Details
                        </h4>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500">
                            Value: {formatCurrency(lead.estimatedValue)}
                          </p>
                          {lead.expectedCloseDate && (
                            <p className="text-sm text-gray-900">
                              Expected Close: {new Date(lead.expectedCloseDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">
                          Notes
                        </h4>
                        <p className="text-sm text-gray-500">
                          {lead.notes || 'No notes available'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(lead.estimatedValue)}
                        </p>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          lead.status === 'won' ? 'bg-green-100 text-green-800' :
                          lead.status === 'lost' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sales;