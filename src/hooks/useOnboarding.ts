import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { logger } from '../lib/logger';
import type { OnboardingTask, OnboardingProgress, SchoolDocument, OnboardingStats } from '../types/onboarding';

export const useOnboarding = (schoolId: string) => {
  const [tasks, setTasks] = useState<OnboardingTask[]>([]);
  const [progress, setProgress] = useState<OnboardingProgress[]>([]);
  const [documents, setDocuments] = useState<SchoolDocument[]>([]);
  const [stats, setStats] = useState<OnboardingStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOnboardingData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [tasksResponse, progressResponse, documentsResponse] = await Promise.all([
        supabase.from('onboarding_tasks').select('*').order('order_index'),
        supabase.from('onboarding_progress').select('*').eq('school_id', schoolId),
        supabase.from('school_documents').select('*').eq('school_id', schoolId)
      ]);

      if (tasksResponse.error) throw tasksResponse.error;
      if (progressResponse.error) throw progressResponse.error;
      if (documentsResponse.error) throw documentsResponse.error;

      const mappedTasks = tasksResponse.data.map(task => ({
        id: task.id,
        title: task.title,
        description: task.description,
        category: task.category,
        required: task.required,
        orderIndex: task.order_index,
        createdAt: new Date(task.created_at),
        updatedAt: new Date(task.updated_at)
      }));

      const mappedProgress = progressResponse.data.map(prog => ({
        id: prog.id,
        schoolId: prog.school_id,
        taskId: prog.task_id,
        status: prog.status,
        notes: prog.notes,
        completedBy: prog.completed_by,
        completedAt: prog.completed_at ? new Date(prog.completed_at) : undefined,
        createdAt: new Date(prog.created_at),
        updatedAt: new Date(prog.updated_at)
      }));

      const mappedDocuments = documentsResponse.data.map(doc => ({
        id: doc.id,
        schoolId: doc.school_id,
        type: doc.type,
        name: doc.name,
        url: doc.url,
        status: doc.status,
        notes: doc.notes,
        uploadedBy: doc.uploaded_by,
        reviewedBy: doc.reviewed_by,
        reviewedAt: doc.reviewed_at ? new Date(doc.reviewed_at) : undefined,
        validUntil: doc.valid_until ? new Date(doc.valid_until) : undefined,
        createdAt: new Date(doc.created_at),
        updatedAt: new Date(doc.updated_at)
      }));

      // Calculate stats
      const totalTasks = mappedTasks.length;
      const completedTasks = mappedProgress.filter(p => p.status === 'completed').length;
      const pendingTasks = mappedProgress.filter(p => p.status === 'pending').length;
      const blockedTasks = mappedProgress.filter(p => p.status === 'blocked').length;
      const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      const remainingRequiredTasks = mappedTasks
        .filter(task => task.required)
        .filter(task => {
          const taskProgress = mappedProgress.find(p => p.taskId === task.id);
          return !taskProgress || taskProgress.status !== 'completed';
        });

      setTasks(mappedTasks);
      setProgress(mappedProgress);
      setDocuments(mappedDocuments);
      setStats({
        totalTasks,
        completedTasks,
        pendingTasks,
        blockedTasks,
        progress,
        remainingRequired: remainingRequiredTasks.length,
        nextTask: remainingRequiredTasks[0]
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch onboarding data';
      logger.error(message, { context: { error: err }, source: 'useOnboarding' });
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (taskId: string, updates: Partial<OnboardingProgress>) => {
    try {
      const { error } = await supabase
        .from('onboarding_progress')
        .upsert({
          school_id: schoolId,
          task_id: taskId,
          status: updates.status,
          notes: updates.notes,
          completed_by: updates.completedBy,
          completed_at: updates.completedAt?.toISOString()
        });

      if (error) throw error;
      await fetchOnboardingData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update progress';
      logger.error(message, { context: { error: err }, source: 'useOnboarding' });
      throw err;
    }
  };

  const uploadDocument = async (document: Omit<SchoolDocument, 'id' | 'schoolId' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { error } = await supabase
        .from('school_documents')
        .insert([{
          school_id: schoolId,
          type: document.type,
          name: document.name,
          url: document.url,
          status: document.status,
          notes: document.notes,
          uploaded_by: document.uploadedBy,
          reviewed_by: document.reviewedBy,
          reviewed_at: document.reviewedAt?.toISOString(),
          valid_until: document.validUntil?.toISOString()
        }]);

      if (error) throw error;
      await fetchOnboardingData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upload document';
      logger.error(message, { context: { error: err }, source: 'useOnboarding' });
      throw err;
    }
  };

  const reviewDocument = async (documentId: string, status: 'approved' | 'rejected', notes?: string) => {
    try {
      const { error } = await supabase
        .from('school_documents')
        .update({
          status,
          notes,
          reviewed_by: (await supabase.auth.getUser()).data.user?.id,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (error) throw error;
      await fetchOnboardingData();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to review document';
      logger.error(message, { context: { error: err }, source: 'useOnboarding' });
      throw err;
    }
  };

  useEffect(() => {
    if (schoolId) {
      fetchOnboardingData();
    }
  }, [schoolId]);

  return {
    tasks,
    progress,
    documents,
    stats,
    loading,
    error,
    updateProgress,
    uploadDocument,
    reviewDocument,
    refresh: fetchOnboardingData
  };
};