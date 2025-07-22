import { AlertTriangle } from 'lucide-react';
import { FC } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
  taskTitle?: string;
}

export const DeleteConfirmationDialog: FC<DeleteConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
  taskTitle,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="size-5 text-red-600" />
            </div>
            Delete Task
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-slate-600">
            Are you sure you want to delete{' '}
            {taskTitle ? (
              <>
                the task &ldquo;<strong>{taskTitle}</strong>&rdquo;
              </>
            ) : (
              'this task'
            )}
            ? This action cannot be undone.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={onConfirm}
              isLoading={isLoading}
              className="w-full sm:w-auto"
            >
              Delete Task
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
