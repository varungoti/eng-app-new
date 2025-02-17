import { supabase } from '../supabase';
import { logger } from '../logger';

export interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  subject: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface Thread {
  id: string;
  participants: string[];
  subject: string;
  lastMessage: Message;
  unreadCount: number;
}

class MessageManager {
  private static instance: MessageManager;
  private subscribers: Set<(messages: Message[]) => void> = new Set();

  private constructor() {
    this.setupRealtimeSubscription();
  }

  public static getInstance(): MessageManager {
    if (!MessageManager.instance) {
      MessageManager.instance = new MessageManager();
    }
    return MessageManager.instance;
  }

  private setupRealtimeSubscription() {
    supabase
      .channel('messages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'messages' },
        this.handleMessageChange.bind(this)
      )
      .subscribe();
  }

  private async handleMessageChange() {
    await this.fetchMessages();
  }

  public async fetchMessages(): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const messages = data.map(m => ({
        id: m.id,
        senderId: m.sender_id,
        recipientId: m.recipient_id,
        subject: m.subject,
        content: m.content,
        read: m.read,
        createdAt: new Date(m.created_at)
      }));

      this.notifySubscribers(messages);
      return messages;
    } catch (err) {
      logger.error('Failed to fetch messages', 'MessageManager', err);
      return [];

    }
  }

  public async sendMessage(message: Omit<Message, 'id' | 'createdAt' | 'read'>): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from('messages')
        .insert({
          sender_id: message.senderId,
          recipient_id: message.recipientId,
          subject: message.subject,
          content: message.content,
          read: false
        })
        .select()
        .single();

      if (error) throw error;
      await this.fetchMessages();

      return {
        id: data.id,
        senderId: data.sender_id,
        recipientId: data.recipient_id,
        subject: data.subject,
        content: data.content,
        read: data.read,
        createdAt: new Date(data.created_at)
      };
    } catch (err) {
      logger.error('Failed to send message', 'MessageManager', err);
      return null;

    }
  }

  public async markAsRead(messageId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', messageId);

      if (error) throw error;
      await this.fetchMessages();
    } catch (err) {
      logger.error('Failed to mark message as read', 'MessageManager', err);

    }
  }

  public async getThreads(): Promise<Thread[]> {
    try {
      const { data, error } = await supabase
        .from('message_threads')
        .select(`
          *,
          messages:messages (*)
        `)
        .order('last_message_at', { ascending: false });

      if (error) throw error;

      return data.map(t => ({
        id: t.id,
        participants: t.participants,
        subject: t.subject,
        lastMessage: this.mapMessage(t.messages[0]),
        unreadCount: t.messages.filter((m: any) => !m.read).length
      }));
    } catch (err) {
      logger.error('Failed to get threads', 'MessageManager', err);
      return [];

    }
  }

  private mapMessage(messageData: any): Message {
    return {
      id: messageData.id,
      senderId: messageData.sender_id,
      recipientId: messageData.recipient_id,
      subject: messageData.subject,
      content: messageData.content,
      read: messageData.read,
      createdAt: new Date(messageData.created_at)
    };
  }

  public subscribe(callback: (messages: Message[]) => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  private notifySubscribers(messages: Message[]) {
    this.subscribers.forEach(callback => callback(messages));
  }
}

export const messageManager = MessageManager.getInstance();