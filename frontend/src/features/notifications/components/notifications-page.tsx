import { Bell, CheckCheck } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';

import { ContentLayout } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/utils/cn';

import {
  useMarkAllAsRead,
  useMarkAsRead,
  useNotificationsList,
} from '../api/notifications-api';

import { NotificationItem } from './notification-item';

export const NotificationsPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const { data, isLoading } = useNotificationsList();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const notifications = data?.data || [];
  const filteredNotifications =
    filter === 'unread'
      ? notifications.filter((n) => !n.is_read)
      : notifications;
  const hasUnread = notifications.some((n) => !n.is_read);

  const handleNotificationClick = (
    notificationId: string,
    actionUrl?: string,
  ) => {
    markAsReadMutation.mutate(notificationId);
    if (actionUrl) {
      navigate(actionUrl);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  return (
    <ContentLayout title="Notifications">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              All Notifications
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Stay updated with your projects and applications
            </p>
          </div>

          {hasUnread && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isPending}
            >
              <CheckCheck className="mr-2 size-4" />
              Mark all read
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="mb-4 flex gap-2 border-b border-slate-200">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              filter === 'all'
                ? 'border-b-2 border-primary text-primary'
                : 'text-slate-600 hover:text-slate-900',
            )}
          >
            All
            <span className="ml-2 text-xs text-slate-500">
              ({notifications.length})
            </span>
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={cn(
              'px-4 py-2 text-sm font-medium transition-colors',
              filter === 'unread'
                ? 'border-b-2 border-primary text-primary'
                : 'text-slate-600 hover:text-slate-900',
            )}
          >
            Unread
            <span className="ml-2 text-xs text-slate-500">
              ({notifications.filter((n) => !n.is_read).length})
            </span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <Spinner size="lg" />
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center text-slate-500">
              <Bell className="mb-3 size-12 text-slate-300" />
              <p className="text-sm font-medium">
                {filter === 'unread'
                  ? 'No unread notifications'
                  : 'No notifications'}
              </p>
              <p className="text-xs">
                {filter === 'unread'
                  ? "You're all caught up!"
                  : 'Notifications will appear here'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onClick={handleNotificationClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </ContentLayout>
  );
};
