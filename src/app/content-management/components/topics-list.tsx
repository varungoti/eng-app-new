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
import { Topic } from "../types";
import { EditTopicDialog } from "./dialogs/edit-topic-dialog";

interface TopicsListProps {
  topics: Topic[];
  selectedTopic: Topic | null;
  onSelect: (topic: Topic) => void;
  onUpdate: () => void;
}

const supabase = createClientComponentClient({
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  });

export function TopicsList({ topics, selectedTopic, onSelect, onUpdate }: TopicsListProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (topicId: string) => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from("topics")
        .delete()
        .eq("id", topicId);

      if (error) throw error;

      toast.success("Topic deleted successfully");
      onUpdate();
    } catch (error) {
      toast.error("Failed to delete topic");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {topics.map((topic) => (
        <Card 
          key={topic.id}
          className={`cursor-pointer hover:border-primary transition-colors ${
            selectedTopic?.id === topic.id ? "border-primary" : ""
          }`}
          onClick={() => onSelect(topic)}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>{topic.title}</CardTitle>
              <CardDescription>{topic.description}</CardDescription>
            </div>
            <div className="flex gap-2">
              <EditTopicDialog topic={topic} onSuccess={onUpdate} />
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Topic</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this topic? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(e) => {
                        e.stopPropagation();
                        if (topic.id) {
                          handleDelete(topic.id);
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
export default TopicsList;