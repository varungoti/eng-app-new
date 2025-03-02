//import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card } from '../../components/ui/card';
import LessonManager from '../../components/content/LessonManager';

export default function ContentManagement() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Content Management</h1>
      
      <Tabs defaultValue="lessons" className="w-full">
        <TabsList>
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="lessons">
          <Card className="p-4">
            <LessonManager lessonId={''} />
          </Card>
        </TabsContent>
        
        {/* Other tabs content will be added later */}
      </Tabs>
    </div>
  );
} 