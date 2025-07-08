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
import { Grade } from "../types";
import { EditGradeDialog } from "./dialogs/edit-grade-dialog";

interface GradesListProps {
  grades: Grade[];
  selectedGrade: Grade | null;
  onSelect: (grade: Grade) => void;
  onUpdate: () => void;
}

const supabase = createClientComponentClient({
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  });

export function GradesList({ grades, selectedGrade, onSelect, onUpdate }: GradesListProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (gradeId: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("grades")
        .delete()
        .eq("id", gradeId);

      if (error) throw error;

      toast.success("Grade deleted successfully");
      onUpdate();
    } catch (error) {
      toast.error("Failed to delete grade");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {grades.map((grade) => (
        <Card 
          key={grade.id}
          className={`cursor-pointer hover:border-primary transition-colors ${
            selectedGrade?.id === grade.id ? "border-primary" : ""
          }`}
          onClick={() => onSelect(grade)}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{grade.name}</CardTitle>
              <CardDescription>Level {grade.level}</CardDescription>
            </div>
            <div className="flex gap-2">
              <EditGradeDialog grade={grade} onSuccess={onUpdate} />
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Grade</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this grade? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(grade.id);
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
export default GradesList;
