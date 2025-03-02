import { useCallback, useEffect, useRef, useState } from 'react';

interface AutoSaveOptions<T> {
  onSave: (data: T) => Promise<void>;
  interval?: number;
  enabled?: boolean;
  debounceMs?: number;
  maxRetries?: number;
  retryDelay?: number;
  saveOnUnload?: boolean;
}

type SaveStatus = 'idle' | 'pending' | 'success' | 'error';

export const useAutoSave = <T>({ 
  onSave, 
  interval = 5000, 
  enabled = true,
  debounceMs = 1000,
  maxRetries = 3,
  retryDelay = 2000,
  saveOnUnload = true
}: AutoSaveOptions<T>) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const debounceTimerRef = useRef<NodeJS.Timeout>();
  const dataRef = useRef<T | null>(null);
  const retryCountRef = useRef<number>(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [status, setStatus] = useState<SaveStatus>('idle');
  const [isDirty, setIsDirty] = useState<boolean>(false);
  
  // Core save function with retry logic
  const save = useCallback(async (data: T): Promise<boolean> => {
    if (!data) return false;
    
    try {
      setStatus('pending');
      await onSave(data);
      setStatus('success');
      setLastSaved(new Date());
      setIsDirty(false);
      retryCountRef.current = 0;
      return true;
    } catch (err) {
      console.error('Auto-save failed:', err);
      setStatus('error');
      
      // Attempt retry if under max retries
      if (retryCountRef.current < maxRetries) {
        retryCountRef.current++;
        
        // Set up retry with exponential backoff
        const retryTimeout = retryDelay * Math.pow(2, retryCountRef.current - 1);
        setTimeout(() => {
          if (isDirty) {
            save(data);
          }
        }, retryTimeout);
        
        return false;
      } else {
        retryCountRef.current = 0;
        return false;
      }
    }
  }, [onSave, maxRetries, retryDelay, isDirty]);
  
  // Function to update data and mark as dirty
  const updateData = useCallback((data: T) => {
    const hasChanged = JSON.stringify(data) !== JSON.stringify(dataRef.current);
    
    if (hasChanged) {
      dataRef.current = data;
      setIsDirty(true);
      
      // Debounce rapid changes
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      
      debounceTimerRef.current = setTimeout(() => {
        // Only auto-save if enabled and data is dirty
        if (enabled && isDirty) {
          save(data);
        }
      }, debounceMs);
    }
  }, [enabled, isDirty, debounceMs, save]);

  // Function to force an immediate save
  const forceSave = useCallback(async (data: T) => {
    // Clear any pending auto-save
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    return save(data);
  }, [save]);

  // Set up the interval-based auto-save
  useEffect(() => {
    if (!enabled) return;

    const autoSave = async () => {
      // Only auto-save if there are unsaved changes
      if (isDirty && dataRef.current) {
        await save(dataRef.current);
      }
      
      // Schedule next auto-save
      timeoutRef.current = setTimeout(autoSave, interval);
    };

    // Start the auto-save loop
    timeoutRef.current = setTimeout(autoSave, interval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [enabled, interval, save, isDirty]);

  // Save data when the window is about to unload
  useEffect(() => {
    if (!saveOnUnload) return;
    
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty && dataRef.current) {
        // Just notify the user that they have unsaved changes
        event.preventDefault();
        event.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return event.returnValue;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [saveOnUnload, isDirty]);

  return {
    save,
    updateData,
    forceSave,
    status,
    lastSaved,
    isDirty
  };
};