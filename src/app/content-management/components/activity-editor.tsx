"use client";

import { Activity } from "@/app/content-management/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

interface ActivityEditorProps {
  activity: Activity;
  onUpdate: (activity: Activity) => void;
  onDelete: () => void;
}

export function ActivityEditor({ activity, onUpdate, onDelete }: ActivityEditorProps) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <Input
            value={activity.title}
            onChange={(e) => onUpdate({ ...activity, title: e.target.value })}
            placeholder="Activity Title"
            className="max-w-md"
          />
          <Button variant="ghost" size="icon" onClick={onDelete}>
            <Trash className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Instructions</Label>
          <Textarea
            value={activity.instructions}
            onChange={(e) => onUpdate({ ...activity, instructions: e.target.value })}
            placeholder="Activity instructions..."
          />
        </div>
        <div>
          <Label>Teacher Script</Label>
          <Textarea
            value={activity.data?.teacher_script}
            onChange={(e) => onUpdate({
              ...activity,
              data: { 
                prompt: activity.data?.prompt || '',
                teacher_script: e.target.value,
                media: activity.data?.media || []
              }
            })}
            placeholder="Teacher script..."
          />
        </div>
      </CardContent>
    </Card>
  );
} 
export default ActivityEditor;