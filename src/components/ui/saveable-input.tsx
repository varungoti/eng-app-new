"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { logger } from "@/lib/logger";
import { cn } from "@/lib/utils";

interface SaveableInputProps {
  label: string;
  initialValue: string;
  onSave: (value: string) => Promise<void>;
  isTextArea?: boolean;
  placeholder?: string;
  className?: string;
  onError?: (error: Error) => void;
  debounceMs?: number;
}

export const SaveableInput: React.FC<SaveableInputProps> = ({
  label,
  initialValue,
  onSave,
  isTextArea = false,
  placeholder,
  className,
  onError,
  debounceMs = 500
}) => {
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (mounted.current) {
      setValue(initialValue);
    }
  }, [initialValue]);

  const handleChange = async (newValue: string) => {
    setValue(newValue);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        if (mounted.current) {
          setIsSaving(true);
        }
        await onSave(newValue);
        logger.debug('Value saved successfully', {
          source: 'SaveableInput'
        });
      } catch (error) {
        logger.error('Failed to save value', {
          context: { error },
          source: 'SaveableInput'
        });
        if (onError) {
          onError(error instanceof Error ? error : new Error('Failed to save'));
        }
        console.error('Error saving value:', error);
      } finally {
        if (mounted.current) {
          setIsSaving(false);
        }
      }
    }, debounceMs);
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