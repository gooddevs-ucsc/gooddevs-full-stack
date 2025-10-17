import { CheckCircle, Plus } from 'lucide-react';
import { FC, useState } from 'react';

import { Button } from '@/components/ui/button';
import { useNotifications } from '@/components/ui/notifications';
import { Spinner } from '@/components/ui/spinner';
import { useUser } from '@/lib/auth';
import { ROLES } from '@/lib/roles';
import type { Task } from '@/types/api';

import { useCreateTask } from '../api/create-task';
import { useDeleteTask } from '../api/delete-task';
import { useTasks } from '../api/get-tasks';
import { useUpdateTask } from '../api/update-task';

import { DeleteConfirmationDialog } from './delete-confirmation-dialog';
import { TaskList } from './task-list';
import { TaskModal, type TaskFormData } from './task-modal';

interface TasksTabProps {
  projectId: string;
}

export const TasksTab: FC<TasksTabProps> = ({ projectId }: TasksTabProps) => {
  const { addNotification } = useNotifications();
  const user = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // API Hooks
  const { data: tasksData, isLoading: isLoadingTasks } = useTasks({
    projectId,
  });

  const createTaskMutation = useCreateTask({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Task Created',
          message: 'Task has been created successfully.',
        });
        setIsModalOpen(false);
        setEditingTask(null);
      },
      onError: () => {
        addNotification({
          type: 'error',
          title: 'Creation Failed',
          message: 'Failed to create task. Please try again.',
        });
      },
    },
  });

  const updateTaskMutation = useUpdateTask({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Task Updated',
          message: 'Task has been updated successfully.',
        });
        setIsModalOpen(false);
        setEditingTask(null);
      },
      onError: () => {
        addNotification({
          type: 'error',
          title: 'Update Failed',
          message: 'Failed to update task. Please try again.',
        });
      },
    },
  });

  const deleteTaskMutation = useDeleteTask({
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Task Deleted',
          message: 'Task has been deleted successfully.',
        });
        setIsDeleteDialogOpen(false);
        setTaskToDelete(null);
      },
      onError: () => {
        addNotification({
          type: 'error',
          title: 'Deletion Failed',
          message: 'Failed to delete task. Please try again.',
        });
      },
    },
  });

  const canCreateTasks = user.data?.role === ROLES.VOLUNTEER;

  const tasks = tasksData?.data || [];

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmitTask = (data: TaskFormData) => {
    const taskData = {
      title: data.title,
      description: data.description || undefined,
      priority: data.priority,
      estimated_hours: data.estimated_hours,
      due_date: data.due_date || undefined,
      assignee_id: data.assignee_id || undefined,
      ...(editingTask && { status: data.status }),
    };

    if (editingTask) {
      updateTaskMutation.mutate({
        projectId,
        taskId: editingTask.id,
        data: taskData,
      });
    } else {
      createTaskMutation.mutate({
        projectId,
        data: taskData,
      });
    }
  };

  const handleConfirmDelete = () => {
    if (taskToDelete) {
      deleteTaskMutation.mutate({
        projectId,
        taskId: taskToDelete,
      });
    }
  };

  const taskToDeleteData = tasks.find((task) => task.id === taskToDelete);

  if (isLoadingTasks) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
            <CheckCircle className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Project Tasks
            </h2>
            <p className="text-sm text-slate-600">
              Manage and track project tasks and requirements
            </p>
          </div>
        </div>
        {canCreateTasks && (
          <Button
            onClick={handleCreateTask}
            className="flex items-center gap-2"
          >
            <Plus className="size-4" />
            Create Task
          </Button>
        )}
      </div>

      {/* Task Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-2xl font-bold text-slate-900">
            {tasks.filter((task) => task.status === 'TODO').length}
          </div>
          <div className="text-sm text-slate-600">To Do</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-2xl font-bold text-blue-600">
            {tasks.filter((task) => task.status === 'IN_PROGRESS').length}
          </div>
          <div className="text-sm text-slate-600">In Progress</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-2xl font-bold text-green-600">
            {tasks.filter((task) => task.status === 'COMPLETED').length}
          </div>
          <div className="text-sm text-slate-600">Completed</div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="text-2xl font-bold text-slate-900">
            {tasks.length}
          </div>
          <div className="text-sm text-slate-600">Total Tasks</div>
        </div>
      </div>

      {/* Task List */}
      <TaskList
        tasks={tasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
      />

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleSubmitTask}
        task={editingTask}
        isLoading={createTaskMutation.isPending || updateTaskMutation.isPending}
        projectId={projectId}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setTaskToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        isLoading={deleteTaskMutation.isPending}
        taskTitle={taskToDeleteData?.title}
      />
    </div>
  );
};
