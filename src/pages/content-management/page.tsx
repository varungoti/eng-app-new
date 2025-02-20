'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { UseQueryResult } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorBoundary from '@/components/ErrorBoundary';
import type { Grade } from './types';
import { useQuery } from '@tanstack/react-query';

export default function ContentManagementPage() {
  const [selectedGrade, setSelectedGrade] = React.useState<string>('');

  const { data: grades, isLoading, error } = useQuery<Grade[]>({
    queryKey: ['grades'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('grades')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Grade[];
    }
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error loading grades</div>;
  }

  return (
    <ErrorBoundary source="ContentManagementPage">
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Content Management</h1>
          <p className="text-muted-foreground">Manage your educational content</p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <Card className="col-span-3 p-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Grade</label>
                <Select 
                  value={selectedGrade} 
                  onValueChange={setSelectedGrade}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades?.map((grade: Grade) => (
                      <SelectItem key={grade.id} value={grade.id}>
                        {grade.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Main Content Area */}
          <div className="col-span-9">
            <Card className="p-6">
              <div className="space-y-4">
                {selectedGrade ? (
                  <p>Selected Grade: {grades?.find((g: Grade) => g.id === selectedGrade)?.name}</p>
                ) : (
                  <p className="text-muted-foreground">Please select a grade to view content</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
} 