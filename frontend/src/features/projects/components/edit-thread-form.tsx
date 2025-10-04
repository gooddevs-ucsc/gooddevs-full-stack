import { z } from 'zod';

import { Button } from '@/components/ui/button';
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
      {({ register, formState }) => (
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
            <Button
              type="button"
              variant="ghost"
              onClick={onCancel}
              disabled={updateThreadMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={updateThreadMutation.isPending}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              Update Thread
            </Button>
          </div>
        </div>
      )}
    </Form>
  );
};
