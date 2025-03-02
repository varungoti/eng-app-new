import { Check, Pencil, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState, useCallback, useEffect, useRef } from 'react';

interface InlineEditProps {
  value: string;
  onSave: (value: string) => void;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  placeholder?: string;
  className?: string;
}

export const InlineEdit = ({
  value,
  onSave,
  isEditing,
  setIsEditing,
  placeholder = 'Enter value',
  className = ''
}: InlineEditProps) => {
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset temp value when value prop changes
  useEffect(() => {
    setTempValue(value);
  }, [value]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = useCallback(() => {
    if (tempValue.trim() !== '') {
      onSave(tempValue);
    }
    setIsEditing(false);
  }, [tempValue, onSave, setIsEditing]);

  const handleCancel = useCallback(() => {
    setTempValue(value);
    setIsEditing(false);
  }, [value, setIsEditing]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          ref={inputRef}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleSave}
          placeholder={placeholder}
          className={cn("flex-1", className)}
        />
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleSave}
            className="h-8 w-8 p-0"
          >
            <Check className="h-4 w-4 text-green-500" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCancel}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "group flex items-center gap-2 cursor-pointer",
        "hover:bg-accent/50 rounded px-2 py-1 -mx-2 transition-colors",
        className
      )}
      onClick={() => setIsEditing(true)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsEditing(true);
        }
      }}
    >
      <span className={cn(
        "flex-1",
        !value && "text-muted-foreground italic"
      )}>
        {value || placeholder}
      </span>
      <Pencil className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
}; 