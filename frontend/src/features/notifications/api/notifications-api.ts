import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { NotificationsResponse } from '@/types/api';

// Query keys
export const notificationsKeys = {
  all: ['notifications'] as const,
  list: () => [...notificationsKeys.all, 'list'] as const,
  unread: () => [...notificationsKeys.all, 'unread'] as const,
  unreadCount: () => [...notificationsKeys.all, 'unread-count'] as const,
};

// API Functions
export const getNotifications = async (
  skip = 0,
  limit = 50,
): Promise<NotificationsResponse> => {
  return api.get('/notifications', { params: { skip, limit } });
};

export const getUnreadNotifications =
  async (): Promise<NotificationsResponse> => {
    return api.get('/notifications/unread');
  };

export const getUnreadCount = async (): Promise<{ count: number }> => {
  return api.get('/notifications/unread/count');
};

export const markAsRead = async (
  notificationId: string,
): Promise<{ message: string }> => {
  return api.patch(`/notifications/${notificationId}/read`);
};

export const markAllAsRead = async (): Promise<{ message: string }> => {
  return api.post('/notifications/mark-all-read');
};

// Query Options
export const getNotificationsQueryOptions = (skip = 0, limit = 50) => {
  return queryOptions({
    queryKey: [...notificationsKeys.list(), skip, limit],
    queryFn: () => getNotifications(skip, limit),
  });
};

export const getUnreadNotificationsQueryOptions = () => {
  return queryOptions({
    queryKey: notificationsKeys.unread(),
    queryFn: getUnreadNotifications,
  });
};

export const getUnreadCountQueryOptions = () => {
  return queryOptions({
    queryKey: notificationsKeys.unreadCount(),
    queryFn: getUnreadCount,
    refetchInterval: 30000, // Refetch every 30 seconds as fallback
  });
};

// Hooks
export const useNotificationsList = (skip = 0, limit = 50) => {
  return useQuery(getNotificationsQueryOptions(skip, limit));
};

export const useUnreadNotifications = () => {
  return useQuery(getUnreadNotificationsQueryOptions());
};

export const useUnreadCount = () => {
  return useQuery(getUnreadCountQueryOptions());
};

export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: notificationsKeys.all });
    },
  });
};
