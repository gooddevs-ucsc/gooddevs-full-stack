import { Bell, CheckCheck } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { paths } from '@/config/paths';

import {
  useMarkAllAsRead,
  useMarkAsRead,
  useUnreadNotifications,
} from '../api/notifications-api';

import { NotificationItem } from './notification-item';

interface NotificationsListProps {
  onClose: () => void;
}

export const NotificationsList = ({ onClose }: NotificationsListProps) => {
  const navigate = useNavigate();
  const { data, isLoading } = useUnreadNotifications();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const notifications = data?.data || [];
  const hasUnread = notifications.some((n) => !n.is_read);

  const handleNotificationClick = (
    notificationId: string,
    actionUrl?: string,
  ) => {
    // Mark as read
    markAsReadMutation.mutate(notificationId);

    // Navigate if there's an action URL
    if (actionUrl) {
      navigate(actionUrl);
      onClose();
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex max-h-[600px] flex-col">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <h3 className="text-lg font-semibold text-slate-900">Notifications</h3>
        {hasUnread && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleMarkAllAsRead}
            disabled={markAllAsReadMutation.isPending}
            className="text-xs text-primary hover:text-primary/80"
          >
            <CheckCheck className="mr-1 size-4" />
            Mark all read
          </Button>
        )}
      </div>

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-slate-500">
            <Bell className="mb-3 size-12 text-slate-300" />
            <p className="text-sm font-medium">No notifications</p>
            <p className="text-xs">You&apos;re all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onClick={handleNotificationClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-slate-200 px-4 py-3">
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-primary hover:text-primary/80"
            onClick={() => {
              navigate(paths.app.notifications.getHref());
              onClose();
            }}
          >
            View all notifications
          </Button>
        </div>
      )}
    </div>
  );
};
