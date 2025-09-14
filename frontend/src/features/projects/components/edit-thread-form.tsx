import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { Form, Input, Textarea } from '@/components/ui/form';
import { ProjectThread } from '@/types/api';

import {
  updateThreadInputSchema,
  useUpdateThread,
} from '../api/get-project-thread';

type EditThreadFormProps = {
  thread: ProjectThread;
  onCancel: () => void;
  onSuccess?: () => void;
};

export const EditThreadForm = ({
  thread,
  onCancel,
  onSuccess,
}: EditThreadFormProps) => {
  const updateThreadMutation = useUpdateThread({
    threadId: thread.id,
    config: {
      onSuccess: () => {
        onSuccess?.();
      },
    },
  });

  const handleSubmit = (data: z.infer<typeof updateThreadInputSchema>) => {
    updateThreadMutation.mutate({
      threadId: thread.id,
      data,
    });
  };

  return (
    <Form
      onSubmit={handleSubmit}
      schema={updateThreadInputSchema}
      options={{
        defaultValues: {
          title: thread.title,
          body: thread.body,
        },
      }}
    >
      {({ register, formState, watch }) => {
        const title = watch('title');
        const body = watch('body');

        const hasUnsavedChanges =
          title !== thread.title || body !== thread.body;

        return (
          <div className="space-y-4">
            <Input
              label="Title"
              registration={register('title')}
              error={formState.errors.title}
            />
            <Textarea
              label="Body"
              registration={register('body')}
              error={formState.errors.body}
              rows={8}
            />
            <div className="flex items-center justify-end gap-2">
              {hasUnsavedChanges ? (
                <ConfirmationDialog
                  icon="danger"
                  title="Discard Changes"
                  body="You have unsaved changes to the thread. Are you sure you want to discard them?"
                  triggerButton={
                    <Button type="button" variant="ghost">
                      Cancel
                    </Button>
                  }
                  confirmButton={
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={onCancel}
                    >
                      Discard Changes
                    </Button>
                  }
                />
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onCancel}
                  disabled={updateThreadMutation.isPending}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                isLoading={updateThreadMutation.isPending}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                Update Thread
              </Button>
            </div>
          </div>
        );
      }}
    </Form>
  );
};
