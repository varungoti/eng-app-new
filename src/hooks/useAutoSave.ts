import { useState, useEffect, useCallback } from 'react';
import { debounce } from '../lib/utils';

interface AutoSaveOptions {
  onSave: (value: any) => Promise<void>;
  debounceMs?: number;
  initialValue?: any;
}

export const useAutoSave = ({ onSave, debounceMs = 1000, initialValue }: AutoSaveOptions) => {
  const [value, setValue] = useState(initialValue);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  const debouncedSave = useCallback(
    debounce(async (newValue: any) => {
      try {
        setSaveStatus('saving');
        await onSave(newValue);
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      } catch (error) {
        setSaveStatus('error');
        setTimeout(() => setSaveStatus('idle'), 3000);
      }
    }, debounceMs),
    [onSave, debounceMs]
  );

  useEffect(() => {
    if (value !== initialValue) {
      debouncedSave(value);
    }
  }, [value, initialValue, debouncedSave]);

  return {
    value,
    setValue,
    saveStatus,
  };
};