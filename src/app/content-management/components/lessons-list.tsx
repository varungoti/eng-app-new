"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Edit2, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lesson } from "../types";
import { EditLessonDialog } from "./dialogs/edit-lesson-dialog";

interface LessonsListProps {
  lessons: Lesson[];
  onUpdate: () => void;
}

const supabase = createClientComponentClient({
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL, 
    supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  });

const statusColors = {
  draft: "bg-yellow-500",
  published: "bg-green-500",
  archived: "bg-gray-500",
};

export function LessonsList({ lessons, onUpdate }: LessonsListProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (lessonId: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("lessons")
        .delete()
        .eq("id", lessonId);

      if (error) throw error;

      toast.success("Lesson deleted successfully");
      onUpdate();
    } catch (error) {
      toast.error("Failed to delete lesson");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {lessons.map((lesson) => (
        <Card key={lesson.id}>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>{lesson.title}</CardTitle>
              <CardDescription>{lesson.description}</CardDescription>
            </div>
            <Badge className={statusColors[lesson.status as keyof typeof statusColors]}>
              {lesson.status}
            </Badge>
          </CardHeader>
          
          <CardContent>
            {lesson.content && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {lesson.content}
              </p>
            )}
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button variant="outline" size="icon">
              <Eye className="h-4 w-4" />
            </Button>
            <EditLessonDialog lesson={lesson} onSuccess={onUpdate} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this lesson? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => lesson.id && handleDelete(lesson.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
} 
export default LessonsList;