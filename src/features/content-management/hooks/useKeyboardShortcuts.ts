import { useEffect, useCallback } from 'react';

interface UseKeyboardShortcutsProps {
  onSave: () => void;
  onToggleEditMode: () => void;
  onToggleHelpTips: () => void;
  onToggleShortcuts: () => void;
  onToggleContentEditor: () => void;
  onSaveContent: () => void;
  onCollapseSidebar: () => void;
  onExpandSidebar: () => void;
  onToggleSidebarLock: () => void;
  onSwitchToQuestions: () => void;
  onSwitchToActivities: () => void;
  onAddNew: () => void;
  isContentEditorOpen?: boolean;
}

export const useKeyboardShortcuts = ({
  onSave,
  onToggleEditMode,
  onToggleHelpTips,
  onToggleShortcuts,
  onToggleContentEditor,
  onSaveContent,
  onCollapseSidebar,
  onExpandSidebar,
  onToggleSidebarLock,
  onSwitchToQuestions,
  onSwitchToActivities,
  onAddNew,
  isContentEditorOpen
}: UseKeyboardShortcutsProps) => {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Don't trigger shortcuts when typing in input fields
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      return;
    }

    // General shortcuts
    if (e.ctrlKey && e.key === 's') {
      e.preventDefault();
      onSave();
    }
    if (e.ctrlKey && e.key === 'e') {
      e.preventDefault();
      onToggleEditMode();
    }
    if (e.ctrlKey && e.key === 'h') {
      e.preventDefault();
      onToggleHelpTips();
    }
    if (e.ctrlKey && e.key === '/') {
      e.preventDefault();
      onToggleShortcuts();
    }

    // Navigation shortcuts
    if (e.altKey && e.key === 'ArrowLeft') {
      e.preventDefault();
      onCollapseSidebar();
    }
    if (e.altKey && e.key === 'ArrowRight') {
      e.preventDefault();
      onExpandSidebar();
    }
    if (e.altKey && e.key === 'l') {
      e.preventDefault();
      onToggleSidebarLock();
    }

    // Content editing shortcuts
    if (e.ctrlKey && e.key === ' ') {
      e.preventDefault();
      onToggleContentEditor();
    }
    if (e.ctrlKey && e.key === 'Enter' && isContentEditorOpen) {
      e.preventDefault();
      onSaveContent();
    }
    if (e.key === 'Escape' && isContentEditorOpen) {
      e.preventDefault();
      onToggleContentEditor();
    }

    // Questions & Activities shortcuts
    if (e.ctrlKey && e.key === 'q') {
      e.preventDefault();
      onSwitchToQuestions();
    }
    if (e.ctrlKey && e.key === 'a') {
      e.preventDefault();
      onSwitchToActivities();
    }
    if (e.ctrlKey && e.key === 'n') {
      e.preventDefault();
      onAddNew();
    }
  }, [
    onSave,
    onToggleEditMode,
    onToggleHelpTips,
    onToggleShortcuts,
    onToggleContentEditor,
    onSaveContent,
    onCollapseSidebar,
    onExpandSidebar,
    onToggleSidebarLock,
    onSwitchToQuestions,
    onSwitchToActivities,
    onAddNew,
    isContentEditorOpen
  ]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}; 