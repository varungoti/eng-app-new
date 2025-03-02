import { useCallback } from 'react';

export const useAccessibilityAnnouncer = () => {
  const announce = useCallback((message: string, type: 'polite' | 'assertive' = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', type);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
    
    // Set the message after a small delay to ensure screen readers catch it
    setTimeout(() => {
      announcer.textContent = message;
      
      // Remove the announcer after it's been read
      setTimeout(() => {
        document.body.removeChild(announcer);
      }, 1000);
    }, 100);
  }, []);

  return { announce };
}; 