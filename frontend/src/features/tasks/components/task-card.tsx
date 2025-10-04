import {
  Calendar,
  Clock,
  Edit,
  MoreVertical,
  Trash2,
  User,
} from 'lucide-react';
import { FC } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown';
import { useUser } from '@/lib/auth';
import { ROLES } from '@/lib/roles';
import { Task, TaskPriority } from '@/types/api';
import { formatDateOnly } from '@/utils/format';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case TaskPriority.URGENT:
      return 'bg-red-100 text-red-800 border border-red-200';
    case TaskPriority.HIGH:
      return 'bg-orange-100 text-orange-800 border border-orange-200';
    case TaskPriority.MEDIUM:
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case TaskPriority.LOW:
      return 'bg-green-100 text-green-800 border border-green-200';
    default:
      return 'bg-slate-100 text-slate-800 border border-slate-200';
  }
};

export const TaskCard: FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const user = useUser();

  const canManageTasks = user.data?.role === ROLES.VOLUNTEER;

  return (
    <div className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md">
      {/* Header */}
      <div className="mb-3 flex items-start justify-between">
        <h4 className="flex-1 text-sm font-semibold text-slate-900 group-hover:text-primary">
          {task.title}
        </h4>
        {canManageTasks && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="size-8 p-0 opacity-0 group-hover:opacity-100"
              >
                <MoreVertical className="size-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                onClick={() => onEdit(task)}
                className="cursor-pointer"
              >
                <Edit className="mr-2 size-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete(task.id)}
                className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <Trash2 className="mr-2 size-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Description */}
      {task.description && (
        <p className="mb-3 line-clamp-2 text-xs text-slate-600">
          {task.description}
        </p>
      )}

      {/* Priority Badge */}
      <div className="mb-3">
        <span
          className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(task.priority)}`}
        >
          {task.priority}
        </span>
      </div>

      {/* Meta Information */}
      <div className="space-y-2">
        {task.assignee && (
          <div className="flex items-center text-xs text-slate-500">
            <User className="mr-1 size-3" />
            Assigned to {task.assignee.firstname} {task.assignee.lastname}
          </div>
        )}
        {task.estimated_hours && (
          <div className="flex items-center text-xs text-slate-500">
            <Clock className="mr-1 size-3" />
            {task.estimated_hours}h estimated
          </div>
        )}
        {task.due_date && (
          <div className="flex items-center text-xs text-slate-500">
            <Calendar className="mr-1 size-3" />
            Due {formatDateOnly(task.due_date)}
          </div>
        )}
      </div>
    </div>
  );
};
