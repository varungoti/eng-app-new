import { useState } from "react";
import { Bell } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: 'due_date' | 'new_content' | 'achievement';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'due_date': return '⏰';
      case 'new_content': return '📚';
      case 'achievement': return '🏆';
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <ScrollArea className="h-80">
          <div className="space-y-2">
            {notifications.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground p-4">
                No notifications
              </p>
            ) : (
              notifications.map((notification) => (
                <Button
                  key={notification.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-left",
                    !notification.read && "bg-muted"
                  )}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex gap-2">
                    <span>{getNotificationIcon(notification.type)}</span>
                    <div className="flex-1">
                      <p className="font-medium">{notification.title}</p>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {notification.timestamp.toRelative()}
                      </p>
                    </div>
                  </div>
                </Button>
              ))
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
} 