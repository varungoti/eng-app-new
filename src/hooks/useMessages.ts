import { useState, useEffect } from 'react';
import { messageManager, Message, Thread } from '../lib/messaging/MessageManager';
import { useToast } from './useToast';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [messagesData, threadsData] = await Promise.all([
          messageManager.fetchMessages(),
          messageManager.getThreads()
        ]);
        setMessages(messagesData);
        setThreads(threadsData);
        setError(null);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch messages';
        setError(message);
        showToast(message, { type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return messageManager.subscribe(setMessages);
  }, [showToast]);

  const sendMessage = async (message: Omit<Message, 'id' | 'createdAt' | 'read'>) => {
    try {
      const newMessage = await messageManager.sendMessage(message);
      if (newMessage) {
        showToast('Message sent successfully', { type: 'success' });
      }
      return newMessage;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send message';
      showToast(message, { type: 'error' });
      return null;
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await messageManager.markAsRead(messageId);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to mark message as read';
      showToast(message, { type: 'error' });
    }
  };

  return {
    messages,
    threads,
    loading,
    error,
    sendMessage,
    markAsRead,
    unreadCount: messages.filter(m => !m.read).length
  };
};