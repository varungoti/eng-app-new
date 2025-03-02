import React from 'react';
import { Filter, Search } from 'lucide-react';

interface EventFiltersProps {
  onFilterChange: (filters: EventFilters) => void;
  filters: EventFilters;
}

export interface EventFilters {
  search: string;
  type: string;
  status: string;
  dateRange: 'all' | 'upcoming' | 'past' | 'today' | 'week' | 'month';
}

const EventFilters: React.FC<EventFiltersProps> = ({ onFilterChange, filters }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search events..."
          value={filters.search}
          onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
          className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            title="Type"
            value={filters.type}
            onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Types</option>
            <option value="academic">Academic</option>
            <option value="administrative">Administrative</option>
            <option value="training">Training</option>
            <option value="meeting">Meeting</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            title="Status"
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Statuses</option>
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date Range
          </label>
          <select
            title="Date Range"
            value={filters.dateRange}
            onChange={(e) => onFilterChange({ ...filters, dateRange: e.target.value as EventFilters['dateRange'] })}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="all">All Time</option>
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default EventFilters;