"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Subtopic } from "../types";
import { EditSubtopicDialog } from "./dialogs/edit-subtopic-dialog";

interface SubtopicsListProps {
  subtopics: Subtopic[];
  selectedSubtopic: Subtopic | null;
  onSelect: (subtopic: Subtopic) => void;
  onUpdate: () => void;
}

const supabase = createClientComponentClient({
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL, 
    supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
});

export function SubtopicsList({ subtopics, selectedSubtopic, onSelect, onUpdate }: SubtopicsListProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (subtopicId: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("subtopics")
        .delete()
        .eq("id", subtopicId);

      if (error) throw error;

      toast.success("Subtopic deleted successfully");
      onUpdate();
    } catch (error) {
      toast.error("Failed to delete subtopic");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {subtopics.map((subtopic) => (
        <Card 
          key={subtopic.id}
          className={`cursor-pointer hover:border-primary transition-colors ${
            selectedSubtopic?.id === subtopic.id ? "border-primary" : ""
          }`}
          onClick={() => onSelect(subtopic)}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{subtopic.title}</CardTitle>
              <CardDescription>{subtopic.description}</CardDescription>
            </div>
            <div className="flex gap-2">
              <EditSubtopicDialog subtopic={subtopic} onSuccess={onUpdate} />
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Subtopic</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this subtopic? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.stopPropagation();
                        if (subtopic.id) {
                          handleDelete(subtopic.id);
                        }
                      }}
                      disabled={isDeleting}
                    >
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
} 
export default SubtopicsList;