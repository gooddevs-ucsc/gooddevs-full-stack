import { zodResolver } from '@hookform/resolvers/zod';
import { Calendar, Clock, User } from 'lucide-react';
import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Task, TaskPriority } from '@/types/api';
import { formatDateOnly } from '@/utils/format';

interface TaskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onDelete: (taskId: string) => void;
  onUpdate: (taskId: string, data: any) => void;
  canManageTasks: boolean;
}

const updateTaskSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  due_date: z.string().optional(),
  actual_hours: z.string().optional(),
});

type UpdateTaskForm = z.infer<typeof updateTaskSchema>;

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

const getStatusColor = (status: string) => {
  switch (status) {
    case 'TODO':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'IN_PROGRESS':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case 'COMPLETED':
      return 'bg-green-100 text-green-800 border border-green-200';
    case 'CANCELLED':
      return 'bg-red-100 text-red-800 border border-red-200';
    default:
      return 'bg-slate-100 text-slate-800 border border-slate-200';
  }
};

export const TaskDetailsModal: FC<TaskDetailsModalProps> = ({
  isOpen,
  onClose,
  task,
  onDelete,
  onUpdate,
  canManageTasks,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  useEffect(() => {
    if (isOpen) {
      setIsEditing(false);
    }
  }, [isOpen]);

  const { register, handleSubmit, reset, watch } = useForm<UpdateTaskForm>({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      status: task?.status,
      due_date: task?.due_date
        ? new Date(task.due_date).toISOString().split('T')[0]
        : '',
      actual_hours: task?.actual_hours?.toString() || '',
    },
  });

  const watchedStatus = watch('status');

  const onSubmit = (data: UpdateTaskForm) => {
    if (!task) return;
    const updateData: any = {};
    if (task.status === 'COMPLETED') {
      updateData.actual_hours = data.actual_hours
        ? Number(data.actual_hours)
        : undefined;
    } else {
      updateData.status = data.status;
      updateData.due_date = data.due_date;
    }
    onUpdate(task.id, updateData);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    reset({
      status: task?.status,
      due_date: task?.due_date
        ? new Date(task.due_date).toISOString().split('T')[0]
        : '',
      actual_hours: task?.actual_hours?.toString() || '',
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!task) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="mb-4 flex items-center justify-center border-b border-slate-200 pb-2 text-xl text-slate-900">
            {isEditing ? 'Edit Task Details' : 'Task Details'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Title */}
          <div className="mb-4">
            <span className="text-sm font-medium text-slate-700">Title</span>
            <p className="break-all text-sm text-slate-900">{task.title}</p>
          </div>

          {/* Description and Assignee in same row */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-slate-700">
                Description
              </span>
              <p className="mt-1 break-words text-sm text-slate-600">
                {task.description}
              </p>
            </div>
            {task.assignee && (
              <div>
                <span className="text-sm font-medium text-slate-700">
                  Assignee
                </span>
                <div className="mt-1 flex items-center text-sm text-slate-600">
                  <User className="mr-1 size-3" />
                  {task.assignee.firstname} {task.assignee.lastname}
                </div>
              </div>
            )}
          </div>

          {/* Status and Priority in same row */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-700">Status</span>
              {isEditing && task.status !== 'COMPLETED' ? (
                <select
                  {...register('status')}
                  className="mt-1 rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="TODO">TODO</option>
                  <option value="IN_PROGRESS">IN_PROGRESS</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="CANCELLED">CANCELLED</option>
                </select>
              ) : (
                <span
                  className={`mt-1 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
                    task.status,
                  )}`}
                >
                  {task.status}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium text-slate-700">
                Priority
              </span>
              <span
                className={`mt-1 inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getPriorityColor(
                  task.priority,
                )}`}
              >
                {task.priority}
              </span>
            </div>
          </div>

          {/* Estimated Hours and Due Date in same row */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-slate-700">
                Estimated Hours
              </span>
              <div className="mt-1 flex items-center text-sm text-slate-600">
                <Clock className="mr-1 size-3" />
                {task.estimated_hours}h
              </div>
            </div>
            <div>
              <span className="text-sm font-medium text-slate-700">
                Due Date
              </span>
              {isEditing && task.status !== 'COMPLETED' ? (
                <Input type="date" {...register('due_date')} className="mt-1" />
              ) : (
                <div className="mt-1 flex items-center text-sm text-slate-600">
                  <Calendar className="mr-1 size-3" />
                  {task.due_date
                    ? formatDateOnly(task.due_date)
                    : 'No due date'}
                </div>
              )}
            </div>
          </div>

          {/* Created At and Updated At in same row */}
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <span className="text-sm font-medium text-slate-700">
                Created At
              </span>
              <p className="mt-1 text-sm text-slate-600">
                {new Date(task.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-slate-700">
                Updated At
              </span>
              <p className="mt-1 text-sm text-slate-600">
                {new Date(task.updated_at).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Actual Hours - only show if status is COMPLETED */}
          {!isEditing && task.status === 'COMPLETED' && task.actual_hours && (
            <div>
              <span className="text-sm font-medium text-slate-700">
                Actual Hours
              </span>
              <div className="flex items-center text-sm text-slate-600">
                <Clock className="mr-1 size-3" />
                {task.actual_hours}h
              </div>
            </div>
          )}

          {/* Actual Hours Input - only show if status is COMPLETED in edit mode */}
          {isEditing && watchedStatus === 'COMPLETED' && (
            <div>
              <span className="text-sm font-medium text-slate-700">
                Actual Hours
              </span>
              <Input
                type="number"
                {...register('actual_hours')}
                className="mt-1"
                placeholder="Enter actual hours"
              />
            </div>
          )}

          {/* Buttons */}
          <div className="mt-6 flex justify-end gap-3">
            {isEditing ? (
              <>
                <Button type="submit">Update</Button>
                <Button type="button" variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
              </>
            ) : (
              <>
                {canManageTasks && (
                  <>
                    <Button variant="outline" onClick={handleEdit}>
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => onDelete(task.id)}
                    >
                      Delete
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
