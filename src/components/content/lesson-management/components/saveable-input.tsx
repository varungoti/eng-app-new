"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface SaveableInputProps {
  label: string;
  initialValue: string;
  onSave: (value: string) => Promise<void>;
  isTextArea?: boolean;
  placeholder?: string;
  className?: string;
}

export const SaveableInput: React.FC<SaveableInputProps> = ({
  label,
  initialValue,
  onSave,
  isTextArea = false,
  placeholder,
  className,
}) => {
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = async (newValue: string) => {
    setValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        await onSave(newValue);
      } catch (error) {
        console.error('Error saving value:', error);
      } finally {
        setIsSaving(false);
      }
    }, 500);
  };

  const InputComponent = isTextArea ? Textarea : Input;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <InputComponent
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "transition-colors",
          isSaving && "border-primary",
          className
        )}
      />
    </div>
  );
}; 