import React, { useState, useEffect, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { toast } from 'sonner';
import { logger } from '@/lib/logger';

interface AutoSaveInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  onSave: (value: string) => Promise<void>;
  initialValue: string;
  debounceMs?: number;
  isTextArea?: boolean;
  isCollapsible?: boolean;
  label?: string;
  showToast?: boolean;
  onError?: (error: Error) => void;
}

export function AutoSaveInput({
  onSave,
  initialValue,
  debounceMs = 2000,
  isTextArea = false,
  isCollapsible = false,
  label,
  className,
  showToast = true,
  onError,
  ...props
}: AutoSaveInputProps) {
  const [value, setValue] = useState(initialValue);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout>();
  const previousValueRef = useRef(initialValue);
  const mounted = useRef(true);

  useEffect(() => {
    return () => {
      mounted.current = false;
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (value !== previousValueRef.current) {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(async () => {
        try {
          setIsSaving(true);
          setError(null);
          await onSave(value);
          setIsSuccess(true);
          if (showToast) {
            toast.success('Changes saved');
          }
          previousValueRef.current = value;
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to save');
          if (showToast) {
            toast.error('Failed to save changes');
          }
        } finally {
          setIsSaving(false);
          setTimeout(() => setIsSuccess(false), 2000);
        }
      }, debounceMs);
    }
  }, [value, onSave, debounceMs, showToast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);

  const InputComponent = isTextArea ? Textarea : Input;

  return (
    <div className="relative">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
          <div className="flex items-center gap-2">
            {isSaving && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving...
              </div>
            )}
            {isSuccess && (
              <div className="flex items-center gap-1 text-xs text-green-500">
                <Check className="h-3 w-3" />
                Saved
              </div>
            )}
            {error && (
              <div className="flex items-center gap-1 text-xs text-destructive">
                <AlertCircle className="h-3 w-3" />
                {error}
              </div>
            )}
          </div>
        </div>
      )}
      <InputComponent
        value={value}
        onChange={handleChange}
        isCollapsible={isTextArea && isCollapsible}
        className={cn(
          "transition-colors",
          isSaving && "border-blue-200 bg-blue-50/50",
          isSuccess && "border-green-200 bg-green-50/50",
          error && "border-red-200 bg-red-50/50",
          className
        )}
        {...props}
      />
    </div>
  );
} 