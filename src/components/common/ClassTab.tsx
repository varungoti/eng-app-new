'use client'

import { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";

interface ClassItem {
  id: number;
  name: string;
}

interface ClassTabsProps {
  classes: ClassItem[];
  selectedClass: ClassItem | null;
  onSelectClass: (classId: string) => void;
}

export function ClassTabs({ classes, selectedClass, onSelectClass }: ClassTabsProps) {
  return (
    <div className="mb-8 border-b border-gray-200">
      <div className="-mb-px flex space-x-2">
        {classes.map((classItem) => (
          <button
            key={classItem.id}
            onClick={() => onSelectClass(classItem.id.toString())}
            className={cn(
              "inline-flex items-center gap-2 border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              selectedClass?.id === classItem.id
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            )}
          >
            {classItem.name}
          </button>
        ))}
      </div>
    </div>
  );
}
