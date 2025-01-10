import * as React from 'react';
import { Input } from './input';
import { logger } from '@/lib/logger';

interface ControlledInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  onError?: (error: Error) => void;
}

export const ControlledInput = React.memo(({
  value,
  onChange,
  label,
  error,
  onError,
  className,
  ...props
}: ControlledInputProps) => {
  const [localValue, setLocalValue] = React.useState(value);
  const mounted = React.useRef(true);

  React.useEffect(() => {
    return () => {
      mounted.current = false;
    };
  }, []);

  React.useEffect(() => {
    if (mounted.current) {
      setLocalValue(value);
    }
  }, [value]);

  const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    try {
      if (mounted.current) {
        setLocalValue(newValue);
        onChange(newValue);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to update input');
      logger.error('Input change error', {
        context: { error },
        source: 'ControlledInput'
      });
      if (onError) {
        onError(error);
      }
    }
  }, [onChange]);

  return (
    <Input
      {...props}
      value={localValue}
      onChange={handleChange}
      className={className}
    />
  );
});

ControlledInput.displayName = 'ControlledInput'; 