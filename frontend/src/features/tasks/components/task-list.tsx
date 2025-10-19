import {
  DndContext,
  DragEndEvent,
  useDroppable,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from '@dnd-kit/core';
import { FC } from 'react';

import { Task, TaskStatus } from '@/types/api';

import { DraggableTaskCard } from './draggable-task-card';

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onViewDetails: (task: Task) => void;
  onUpdateTask: (taskId: string, data: any) => void; // Added for drag updates
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

interface DroppableColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onViewDetails: (task: Task) => void;
}

const DroppableColumn: FC<DroppableColumnProps> = ({
  status,
  tasks,
  onViewDetails,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status, // Unique ID for the droppable area
  });

  return (
    <div
      ref={setNodeRef}
      className={`space-y-4 ${isOver ? 'bg-slate-50' : ''}`} // Optional: highlight on hover
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">
          {getStatusTitle(status)}
        </h3>
        <span
          className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(
            status,
          )}`}
        >
          {tasks.length}
        </span>
      </div>
      <div className="min-h-[200px] space-y-3">
        {' '}
        {/* Ensure minimum height for dropping */}
        {tasks.map((task) => (
          <DraggableTaskCard
            key={task.id}
            task={task}
            onViewDetails={onViewDetails}
          />
        ))}
        {tasks.length === 0 && (
          <div className="rounded-lg border-2 border-dashed border-slate-200 p-6 text-center">
            <p className="text-sm text-slate-500">
              {status === TaskStatus.TODO
                ? 'No tasks to do'
                : status === TaskStatus.IN_PROGRESS
                  ? 'No tasks in progress'
                  : status === TaskStatus.COMPLETED
                    ? 'No completed tasks'
                    : 'No cancelled tasks'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export const TaskList: FC<TaskListProps> = ({
  tasks,
  onViewDetails,
  onUpdateTask,
}) => {
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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;

    // Find the task and check if status changed
    const task = tasks.find((t) => t.id === taskId);
    if (task && task.status !== newStatus) {
      onUpdateTask(taskId, { status: newStatus });
    }
  };

  // useSensors + useSensor with activationConstraint delays drag start,
  // allowing quick clicks to fire the button onClick (open details).
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5, // <- add tolerance to satisfy the type (required)
      },
    }),
  );

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <div className="grid gap-6 lg:grid-cols-3">
        <DroppableColumn
          status={TaskStatus.TODO}
          tasks={tasksByStatus[TaskStatus.TODO]}
          onViewDetails={onViewDetails}
        />
        <DroppableColumn
          status={TaskStatus.IN_PROGRESS}
          tasks={tasksByStatus[TaskStatus.IN_PROGRESS]}
          onViewDetails={onViewDetails}
        />
        <DroppableColumn
          status={TaskStatus.COMPLETED}
          tasks={tasksByStatus[TaskStatus.COMPLETED]}
          onViewDetails={onViewDetails}
        />
        {/* Note: Cancelled column is hidden in the original grid; add if needed */}
      </div>
    </DndContext>
  );
};
