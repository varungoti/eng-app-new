import { supabase } from '../supabase';
import { logger } from '../logger';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

class TaskManager {
  private static instance: TaskManager;
  private subscribers: Set<(tasks: Task[]) => void> = new Set();

  private constructor() {
    this.setupRealtimeSubscription();
  }

  public static getInstance(): TaskManager {
    if (!TaskManager.instance) {
      TaskManager.instance = new TaskManager();
    }
    return TaskManager.instance;
  }

  private setupRealtimeSubscription() {
    supabase
      .channel('tasks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        this.handleTaskChange.bind(this)
      )
      .subscribe();
  }

  private async handleTaskChange() {
    await this.fetchTasks();
  }

  public async fetchTasks(): Promise<Task[]> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('due_date', { ascending: true });

      if (error) throw error;

      const tasks = data.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        assignedTo: t.assigned_to,
        dueDate: new Date(t.due_date),
        priority: t.priority,
        status: t.status,
        tags: t.tags,
        createdAt: new Date(t.created_at),
        updatedAt: new Date(t.updated_at)
      }));

      this.notifySubscribers(tasks);
      return tasks;
    } catch (err) {
      logger.error('Failed to fetch tasks', {
        context: { error: err },
        source: 'TaskManager'
      });
      return [];
    }
  }

  public async createTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task | null> {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          title: task.title,
          description: task.description,
          assigned_to: task.assignedTo,
          due_date: task.dueDate.toISOString(),
          priority: task.priority,
          status: task.status,
          tags: task.tags
        })
        .select()
        .single();

      if (error) throw error;
      await this.fetchTasks();
      
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        assignedTo: data.assigned_to,
        dueDate: new Date(data.due_date),
        priority: data.priority,
        status: data.status,
        tags: data.tags,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at)
      };
    } catch (err) {
      logger.error('Failed to create task', {
        context: { error: err, task },
        source: 'TaskManager'
      });
      return null;
    }
  }

  public async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          title: updates.title,
          description: updates.description,
          assigned_to: updates.assignedTo,
          due_date: updates.dueDate?.toISOString(),
          priority: updates.priority,
          status: updates.status,
          tags: updates.tags
        })
        .eq('id', id);

      if (error) throw error;
      await this.fetchTasks();
    } catch (err) {
      logger.error('Failed to update task', {
        context: { error: err, taskId: id, updates },
        source: 'TaskManager'
      });
      throw err;
    }
  }

  public async deleteTask(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await this.fetchTasks();
    } catch (err) {
      logger.error('Failed to delete task', {
        context: { error: err, taskId: id },
        source: 'TaskManager'
      });
      throw err;
    }
  }

  public subscribe(callback: (tasks: Task[]) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(tasks: Task[]) {
    this.subscribers.forEach(callback => callback(tasks));
  }
}

export const taskManager = TaskManager.getInstance();