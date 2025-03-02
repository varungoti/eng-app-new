'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/card';
import { LoadingIndicator } from '@/components/LoadingIndicator';
//import { Badge } from '@/components/ui/badge';
//import { formatDistanceToNow } from 'date-fns';
//import { useSupabase } from '@/providers/supabase-provider';
import type { Class } from '@/types/class';

export default function MyClassesPage() {
  //const { user } = useSupabase();

  const { data: classes, isLoading } = useQuery<Class[]>({
    queryKey: ['classes'],
    queryFn: async () => {
      const response = await fetch('/api/classes');
      if (!response.ok) throw new Error('Failed to fetch classes');
      return response.json();
    }
  });

  if (isLoading) return <LoadingIndicator />;

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">My Classes</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {classes?.map((classItem) => (
          <Card key={classItem.id} className="p-4">
            <h3 className="text-lg font-semibold">{classItem.name}</h3>
            <p className="text-sm text-muted-foreground mt-2">{classItem.description}</p>
          </Card>
        ))}
      </div>
    </div>
  );
} 