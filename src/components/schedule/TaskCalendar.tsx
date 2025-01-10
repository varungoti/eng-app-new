@@ .. @@
 import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
 import { Progress } from "@/components/ui/progress";
 import { Button } from "@/components/ui/button";
+import { ScheduleDialog } from './ScheduleDialog';
 import {
   ArrowRight,
   BookOpen,
   Calendar,
   CheckCircle2,
   Clock,
   Lock,
   Plus,
   RotateCcw,
   Unlock,
   Users,
   Shield,
 } from "lucide-react";

@@ .. @@
   const [selectedLesson, setSelectedLesson] = useState<ExtendedLesson>(lessonsData[0]);
   const [selectedSubLesson, setSelectedSubLesson] = useState<SubLesson | null>(null);
   const [dialogOpen, setDialogOpen] = useState(false);
+  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
   const [currentLesson, setCurrentLesson] = useState<ExtendedLesson | null>(null);
   const [isLocked, setIsLocked] = useState(true);

@@ .. @@
   return (
     <div className="max-w-6xl w-full relative">
       <div className="flex items-center justify-between mb-4">
+        <div className="flex items-center gap-4">
           <ClassHeader
             classes={classesData}
             selectedClass={selectedClass}
             onClassChange={handleClassChange}
           />
+          <Button
+            variant="outline"
+            size="sm"
+            onClick={() => setIsAddEventOpen(true)}
+            className="ml-4"
+          >
+            <Plus className="h-4 w-4 mr-2" />
+            Add Event
+          </Button>
+        </div>
         <Button
           variant="outline"
           size="sm"
@@ .. @@
           </div>
         </div>
       </div>
+      
+      {/* Add Event Dialog */}
+      <ScheduleDialog
+        open={isAddEventOpen}
+        onOpenChange={setIsAddEventOpen}
+        onSubmit={async (eventData) => {
+          try {
+            // Handle event creation here
+            console.log('Creating event:', eventData);
+            showToast('Event created successfully', { type: 'success' });
+          } catch (error) {
+            showToast('Failed to create event', { type: 'error' });
+          }
+        }}
+      />