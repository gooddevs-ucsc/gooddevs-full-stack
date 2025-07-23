import { FC } from 'react';

import { Task, TaskStatus } from '@/types/api';

import { TaskCard } from './task-card';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const getStatusTitle = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.TODO:
      return 'To Do';
    case TaskStatus.IN_PROGRESS:
      return 'In Progress';
    case TaskStatus.COMPLETED:
      return 'Completed';
    case TaskStatus.CANCELLED:
      return 'Cancelled';
    default:
      return status;
  }
};

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.TODO:
      return 'bg-slate-100 text-slate-700';
    case TaskStatus.IN_PROGRESS:
      return 'bg-blue-100 text-blue-700';
    case TaskStatus.COMPLETED:
      return 'bg-green-100 text-green-700';
    case TaskStatus.CANCELLED:
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

export const TaskList: FC<TaskListProps> = ({ tasks, onEdit, onDelete }) => {
  const tasksByStatus = {
    [TaskStatus.TODO]: tasks.filter((task) => task.status === TaskStatus.TODO),
    [TaskStatus.IN_PROGRESS]: tasks.filter(
      (task) => task.status === TaskStatus.IN_PROGRESS,
    ),
    [TaskStatus.COMPLETED]: tasks.filter(
      (task) => task.status === TaskStatus.COMPLETED,
    ),
    [TaskStatus.CANCELLED]: tasks.filter(
      (task) => task.status === TaskStatus.CANCELLED,
    ),
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* To Do Column */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            {getStatusTitle(TaskStatus.TODO)}
          </h3>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(TaskStatus.TODO)}`}
          >
            {tasksByStatus[TaskStatus.TODO].length}
          </span>
        </div>
        <div className="space-y-3">
          {tasksByStatus[TaskStatus.TODO].map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {tasksByStatus[TaskStatus.TODO].length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-slate-200 p-6 text-center">
              <p className="text-sm text-slate-500">No tasks to do</p>
            </div>
          )}
        </div>
      </div>

      {/* In Progress Column */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            {getStatusTitle(TaskStatus.IN_PROGRESS)}
          </h3>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(TaskStatus.IN_PROGRESS)}`}
          >
            {tasksByStatus[TaskStatus.IN_PROGRESS].length}
          </span>
        </div>
        <div className="space-y-3">
          {tasksByStatus[TaskStatus.IN_PROGRESS].map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {tasksByStatus[TaskStatus.IN_PROGRESS].length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-slate-200 p-6 text-center">
              <p className="text-sm text-slate-500">No tasks in progress</p>
            </div>
          )}
        </div>
      </div>

      {/* Completed Column */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">
            {getStatusTitle(TaskStatus.COMPLETED)}
          </h3>
          <span
            className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(TaskStatus.COMPLETED)}`}
          >
            {tasksByStatus[TaskStatus.COMPLETED].length}
          </span>
        </div>
        <div className="space-y-3">
          {tasksByStatus[TaskStatus.COMPLETED].map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
          {tasksByStatus[TaskStatus.COMPLETED].length === 0 && (
            <div className="rounded-lg border-2 border-dashed border-slate-200 p-6 text-center">
              <p className="text-sm text-slate-500">No completed tasks</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
