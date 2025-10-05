import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef } from 'react';

import { useNotifications } from '@/components/ui/notifications';
import { NotificationData } from '@/types/api';

import { notificationsKeys } from '../api/notifications-api';

export const useNotificationStream = (enabled: boolean = true) => {
  const eventSourceRef = useRef<EventSource | null>(null);
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!enabled) return;

    // Create SSE connection
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const eventSource = new EventSource(
      `${baseUrl}/api/v1/notifications/stream`,
      {
        withCredentials: true,
      },
    );

    eventSourceRef.current = eventSource;

    // Handle connection open
    eventSource.onopen = () => {
      console.log('✅ SSE Connection established');
    };

    // Handle incoming messages
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        // Handle different message types
        if (data.type === 'connected') {
          console.log('📡 SSE Connected:', data);
          return;
        }

        if (data.type === 'keepalive') {
          console.log('💓 SSE Keepalive');
          return;
        }

        // Handle real notification
        const notification: NotificationData = data;

        // Show toast notification
        addNotification({
          type: 'info',
          title: notification.title,
          message: notification.message,
        });

        // Update queries
        queryClient.invalidateQueries({ queryKey: notificationsKeys.unread() });
        queryClient.invalidateQueries({
          queryKey: notificationsKeys.unreadCount(),
        });

        console.log('🔔 New notification:', notification);
      } catch (error) {
        console.error('❌ Error parsing SSE message:', error);
      }
    };

    // Handle errors
    eventSource.onerror = (error) => {
      console.error('❌ SSE Error:', error);
      // EventSource will automatically try to reconnect
    };

    // Cleanup on unmount
    return () => {
      console.log('🔌 Closing SSE connection');
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, [enabled, queryClient, addNotification]);

  return {
    isConnected: eventSourceRef.current?.readyState === EventSource.OPEN,
  };
};
