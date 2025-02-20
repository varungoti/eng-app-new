'use client';

//import React from 'react';
import { Card } from '@/components/ui/card';
import { RoleSettings } from '@/hooks/useRoleSettings';
import { useRouter } from 'next/navigation';


interface ContentEditorDashboardProps {
  settings: RoleSettings;
}

const ContentEditorDashboard: React.FC<ContentEditorDashboardProps> = ({ settings }) => {
  const router = useRouter();


  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Content Editor Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => router.push('/content-management')}
        >
          <h2 className="text-xl font-medium mb-2">Content Management</h2>
          <p className="text-muted-foreground">
            Manage lessons, topics, and educational content
          </p>
        </Card>
      </div>
    </div>
  );
};

export default ContentEditorDashboard;