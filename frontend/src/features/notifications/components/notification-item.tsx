import { formatDistanceToNow } from 'date-fns';
import {
  CheckCircle,
  Clock,
  FileText,
  MessageSquare,
  UserPlus,
  XCircle,
} from 'lucide-react';

import { NOTIFICATION_TYPES, NotificationData } from '@/types/api';
import { cn } from '@/utils/cn';

interface NotificationItemProps {
  notification: NotificationData;
  onClick: (notificationId: string, actionUrl?: string) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case NOTIFICATION_TYPES.PROJECT_APPROVED:
      return <CheckCircle className="size-5 text-green-500" />;
    case NOTIFICATION_TYPES.PROJECT_REJECTED:
      return <XCircle className="size-5 text-red-500" />;
    case NOTIFICATION_TYPES.APPLICATION_RECEIVED:
    case NOTIFICATION_TYPES.APPLICATION_APPROVED:
    case NOTIFICATION_TYPES.APPLICATION_REJECTED:
      return <UserPlus className="size-5 text-blue-500" />;
    case NOTIFICATION_TYPES.NEW_COMMENT:
    case NOTIFICATION_TYPES.NEW_REPLY:
      return <MessageSquare className="size-5 text-purple-500" />;
    case NOTIFICATION_TYPES.TASK_ASSIGNED:
      return <FileText className="size-5 text-orange-500" />;
    default:
      return <Clock className="size-5 text-slate-500" />;
  }
};

export const NotificationItem = ({
  notification,
  onClick,
}: NotificationItemProps) => {
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  return (
    <button
      onClick={() =>
        onClick(notification.id, notification.action_url || undefined)
      }
      className={cn(
        'w-full px-4 py-3 text-left transition-colors hover:bg-slate-50',
        !notification.is_read && 'bg-blue-50/50',
      )}
    >
      <div className="flex gap-3">
        {/* Icon */}
        <div className="shrink-0 pt-1">
          {getNotificationIcon(notification.type)}
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className={cn(
                'text-sm',
                !notification.is_read
                  ? 'font-semibold text-slate-900'
                  : 'font-medium text-slate-700',
              )}
            >
              {notification.title}
            </p>
            {!notification.is_read && (
              <div className="size-2 shrink-0 rounded-full bg-primary"></div>
            )}
          </div>

          <p className="mt-1 line-clamp-2 text-xs text-slate-600">
            {notification.message}
          </p>

          <p className="mt-1 text-xs text-slate-400">{timeAgo}</p>
        </div>
      </div>
    </button>
  );
};
