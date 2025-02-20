"use client";

'use client'

import React from 'react';
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

interface Class {
  id: string;
  attributes: {
    name: string;
    description: string;
  };
}

interface ClassTabsProps {
  classes?: Array<{ name: string; id: string; [key: string]: any }>;
  selectedClass?: { id: string } | null;
  onSelectClass?: (id: string) => void;
}

export function ClassTabs({ 
  classes = [], 
  selectedClass = null,
  onSelectClass = () => {} 
}: ClassTabsProps) {
  if (!Array.isArray(classes)) {
    return <div>No classes available</div>;
  }

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {classes.map((classItem) => (
        <Card
          key={classItem?.id || Math.random()}
          className={cn(
            "flex-shrink-0 cursor-pointer p-4 transition-all hover:shadow-md",
            selectedClass?.id === classItem.id ? "border-primary" : "border-transparent"
          )}
          onClick={() => onSelectClass(classItem.id)}
        >
          <div className="flex items-center gap-3">
            <Avatar
              name={classItem?.name || 'Unnamed Class'}
              size="md"
            />
            <div>
              <h3 className="font-medium">{classItem?.name || 'Unnamed Class'}</h3>
              <p className="text-sm text-muted-foreground">
                {classItem?.description || 'No description available'}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
