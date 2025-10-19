import { User } from 'lucide-react';
import { FC } from 'react';

import { Task, TaskPriority } from '@/types/api';

interface TaskCardProps {
  task: Task;
  onViewDetails: (task: Task) => void;
  listeners?: any; // Drag listeners from @dnd-kit
  attributes?: any; // Drag attributes from @dnd-kit
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

export const TaskCard: FC<TaskCardProps> = ({
  task,
  onViewDetails,
  listeners,
  attributes,
}) => {
  return (
    <button
      type="button"
      className="group w-full rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:border-slate-300 hover:shadow-md"
      onClick={() => onViewDetails(task)}
      {...listeners}
      {...attributes}
    >
      {/* Title */}
      <h4 className="mb-1 truncate text-sm font-semibold text-slate-900 group-hover:text-primary">
        {task.title}
      </h4>

      {/* Assignee */}
      {task.assignee && (
        <div className="mb-2 flex items-center text-xs text-slate-500">
          <User className="mr-1 size-3" />
          {task.assignee.firstname} {task.assignee.lastname}
        </div>
      )}

      {/* Priority Badge */}
      <span
        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(
          task.priority,
        )}`}
      >
        {task.priority}
      </span>
    </button>
  );
};
