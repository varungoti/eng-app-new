'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icons';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Class } from '@/types/class';

export default function MyClassesPage() {
  const supabase = useSupabaseClient();
  const [role, setRole] = useState<string>();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setRole(user?.user_metadata?.role);
    };
    getUser();
  }, [supabase]);

  const { data: classes, isLoading } = useQuery<Class[]>({
    queryKey: ['classes'],
    queryFn: async () => {
      const response = await fetch('/api/classes');
      if (!response.ok) throw new Error('Failed to fetch classes');
      const classData = await response.json();
      
      // Default empty arrays for assignedContent and assignedTeachers if not present
      return classData.map((classItem: any) => ({
        ...classItem,
        assignedContent: classItem.assignedContent || [],
        assignedTeachers: classItem.assignedTeachers || []
      }));
    }
  });
  
  // Function to assign content to a class
  const assignContentToClass = async (classId: string, contentId: string, contentType: 'TOPIC' | 'SUBTOPIC' | 'LESSON') => {
    try {
      const response = await fetch('/api/classes/assign-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          classId,
          contentId,
          contentType
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to assign content');
      }
      
      // Refresh data after assignment
      return response.json();
    } catch (error) {
      console.error('Error assigning content:', error);
      throw error;
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Classes</h1>
        {['SUPER_ADMIN', 'ADMIN', 'SCHOOL_LEADER', 'SCHOOL_PRINCIPAL', 'TEACHER_HEAD'].includes(role as string) && (
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
                  {classItem.gradeId}
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
                {classItem.assignedTeachers.map((t: { name: string }) => t.name).join(', ')}
              </div>
              <div className="text-sm">
                <span className="font-medium">Created:</span>{' '}
                {formatDistanceToNow(new Date(classItem.createdAt), { addSuffix: true })}
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => assignContentToClass(classItem.id, "sample-content-id", "LESSON")}
              >
                <Icon type="phosphor" name="PLUS" className="h-3 w-3 mr-1" />
                Assign Content
              </Button>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant="outline" className="w-full" 
                onClick={() => window.location.href = `/my-classes/${classItem.id}`}
              >
                <Icon type="phosphor" name="BOOK_OPEN" className="h-4 w-4 mr-2" />
                View Content
              </Button>
              {['SUPER_ADMIN', 'ADMIN', 'SCHOOL_LEADER', 'SCHOOL_PRINCIPAL'].includes(role as string) && (
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