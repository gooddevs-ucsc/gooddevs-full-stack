import { useDraggable } from '@dnd-kit/core';
import { FC } from 'react';

import { Task } from '@/types/api';

import { TaskCard } from './task-card';

interface DraggableTaskCardProps {
  task: Task;
  onViewDetails: (task: Task) => void;
}

export const DraggableTaskCard: FC<DraggableTaskCardProps> = ({
  task,
  onViewDetails,
}) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    opacity: isDragging ? 0.5 : 1, // Optional: fade during drag
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCard
        task={task}
        onViewDetails={onViewDetails}
        listeners={listeners}
        attributes={attributes}
      />
    </div>
  );
};
