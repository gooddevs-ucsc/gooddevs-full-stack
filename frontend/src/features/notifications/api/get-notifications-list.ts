import { queryOptions, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { NotificationsResponse } from '@/types/api';

// Query keys (scoped to this file)
export const notificationsListKeys = {
  all: ['notifications'] as const,
  list: (skip: number, limit: number) =>
    [...notificationsListKeys.all, 'list', skip, limit] as const,
};

// API Function
export const getNotifications = async (
  skip = 0,
  limit = 50,
): Promise<NotificationsResponse> => {
  return api.get('/notifications', { params: { skip, limit } });
};

// Query Options
export const getNotificationsQueryOptions = (skip = 0, limit = 50) => {
  return queryOptions({
    queryKey: notificationsListKeys.list(skip, limit),
    queryFn: () => getNotifications(skip, limit),
  });
};

// Hook
export const useNotificationsList = (skip = 0, limit = 50) => {
  return useQuery(getNotificationsQueryOptions(skip, limit));
};
