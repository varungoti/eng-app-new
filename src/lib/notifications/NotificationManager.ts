import { supabase } from '../supabase';
import { logger } from '../logger';

export interface Notification {
  id: string;
  userId: string;
  type: 'system' | 'event' | 'task' | 'message';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

class NotificationManager {
  private static instance: NotificationManager;
  private subscribers: Set<(notifications: Notification[]) => void> = new Set();

  private constructor() {
    this.setupRealtimeSubscription();
  }

  public static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }

  private setupRealtimeSubscription() {
    supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        this.handleNotificationChange.bind(this)
      )
      .subscribe();
  }

  private async handleNotificationChange() {
    await this.fetchNotifications();
  }

  public async fetchNotifications(): Promise<Notification[]> {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const notifications = data.map(n => ({
        id: n.id,
        userId: n.user_id,
        type: n.type,
        title: n.title,
        message: n.message,
        read: n.read,
        createdAt: new Date(n.created_at)
      }));

      this.notifySubscribers(notifications);
      return notifications;
    } catch (err) {
      logger.error('Failed to fetch notifications', {
        context: { error: err },
        source: 'NotificationManager'
      });
      return [];
    }
  }

  public async markAsRead(notificationId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
      await this.fetchNotifications();
    } catch (err) {
      logger.error('Failed to mark notification as read', {
        context: { error: err, notificationId },
        source: 'NotificationManager'
      });
    }
  }

  public subscribe(callback: (notifications: Notification[]) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(notifications: Notification[]) {
    this.subscribers.forEach(callback => callback(notifications));
  }
}

export const notificationManager = NotificationManager.getInstance();