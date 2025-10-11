import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { NotificationsResponse } from '@/types/api';

// Query keys (scoped to this file)
export const unreadNotificationsKeys = {
  all: ['notifications'] as const,
  unread: () => [...unreadNotificationsKeys.all, 'unread'] as const,
  unreadCount: () => [...unreadNotificationsKeys.all, 'unread-count'] as const,
};

// API Functions
export const getUnreadNotifications =
  async (): Promise<NotificationsResponse> => {
    return api.get('/notifications/unread');
  };

export const getUnreadCount = async (): Promise<{ count: number }> => {
  return api.get('/notifications/unread/count');
};

// Query Options
export const getUnreadNotificationsQueryOptions = () => {
  return queryOptions({
    queryKey: unreadNotificationsKeys.unread(),
    queryFn: getUnreadNotifications,
  });
};

export const getUnreadCountQueryOptions = () => {
  return queryOptions({
    queryKey: unreadNotificationsKeys.unreadCount(),
    queryFn: getUnreadCount,
    refetchInterval: 30000, // Refetch every 30 seconds as fallback
  });
};

// Hooks
export const useUnreadNotifications = () => {
  return useQuery(getUnreadNotificationsQueryOptions());
};

export const useUnreadCount = () => {
  return useQuery(getUnreadCountQueryOptions());
};
