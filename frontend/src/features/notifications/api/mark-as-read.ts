import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api-client';

// Query keys (scoped to this file, for invalidation)
export const markAsReadKeys = {
  all: ['notifications'] as const,
};

// API Functions
export const markAsRead = async (
  notificationId: string,
): Promise<{ message: string }> => {
  return api.patch(`/notifications/${notificationId}/read`);
};

export const markAllAsRead = async (): Promise<{ message: string }> => {
  return api.post('/notifications/mark-all-read');
};

// Hooks
export const useMarkAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAsRead,
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: markAsReadKeys.all });
    },
  });
};

export const useMarkAllAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      // Invalidate all notification queries
      queryClient.invalidateQueries({ queryKey: markAsReadKeys.all });
    },
  });
};
