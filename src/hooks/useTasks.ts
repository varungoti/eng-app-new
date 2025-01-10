import { useState, useEffect } from 'react';
import { taskManager, Task } from '../lib/tasks/TaskManager';
import { useToast } from './useToast';

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await taskManager.fetchTasks();
        setTasks(data);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch tasks';
        setError(message);
        showToast(message, { type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
    return taskManager.subscribe(setTasks);
  }, [showToast]);

  const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTask = await taskManager.createTask(task);
      if (newTask) {
        showToast('Task created successfully', { type: 'success' });
      }
      return newTask;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      showToast(message, { type: 'error' });
      return null;
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      await taskManager.updateTask(id, updates);
      showToast('Task updated successfully', { type: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      showToast(message, { type: 'error' });
      throw err;
    }
  };

  const deleteTask = async (id: string) => {
    try {
      await taskManager.deleteTask(id);
      showToast('Task deleted successfully', { type: 'success' });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      showToast(message, { type: 'error' });
      throw err;
    }
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask
  };
};