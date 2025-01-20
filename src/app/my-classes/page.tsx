'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@clerk/nextjs';
import { Class } from '@/types/class';

export default function MyClassesPage() {
  const { userId, sessionClaims } = useAuth();
  const role = sessionClaims?.role as string;

  const { data: classes, isLoading } = useQuery<Class[]>({
    queryKey: ['classes'],
    queryFn: async () => {
      const response = await fetch('/api/classes');
      if (!response.ok) throw new Error('Failed to fetch classes');
      return response.json();
    }
  });

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Classes</h1>
        {['SUPER_ADMIN', 'ADMIN', 'SCHOOL_LEADER', 'SCHOOL_PRINCIPAL'].includes(role) && (
          <Button onClick={() => window.location.href = '/my-classes/create'}>
            <Icon type="phosphor" name="PLUS" className="h-4 w-4 mr-2" />
            Create Class
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes?.map((classItem) => (
          <Card key={classItem.id} className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">{classItem.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {classItem.grade.name}
                </p>
              </div>
              <Badge variant="outline">
                {classItem.assignedContent.length} Contents
              </Badge>
            </div>

            {classItem.description && (
              <p className="text-sm text-muted-foreground mb-4">
                {classItem.description}
              </p>
            )}

            <div className="space-y-2">
              <div className="text-sm">
                <span className="font-medium">Teachers:</span>{' '}
                {classItem.assignedTeachers.map(t => t.name).join(', ')}
              </div>
              <div className="text-sm">
                <span className="font-medium">Created:</span>{' '}
                {formatDistanceToNow(new Date(classItem.createdAt), { addSuffix: true })}
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="w-full" 
                onClick={() => window.location.href = `/my-classes/${classItem.id}`}
              >
                <Icon type="phosphor" name="BOOK_OPEN" className="h-4 w-4 mr-2" />
                View Content
              </Button>
              {['SUPER_ADMIN', 'ADMIN', 'SCHOOL_LEADER', 'SCHOOL_PRINCIPAL'].includes(role) && (
                <Button variant="outline" className="w-full"
                  onClick={() => window.location.href = `/my-classes/${classItem.id}/manage`}
                >
                  <Icon type="phosphor" name="PENCIL_SIMPLE" className="h-4 w-4 mr-2" />
                  Manage
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
} 