import { useNavigate, useParams } from 'react-router';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormDrawer, Input, Textarea } from '@/components/ui/form';
import { useUser } from '@/lib/auth';

import {
  createThreadInputSchema,
  useCreateProjectThread,
} from '../api/get-project-thread';

export const CreateThreadForm = ({ projectId }: { projectId: string }) => {
  const navigate = useNavigate();
  const { data: user } = useUser();
  const createProjectThreadMutation = useCreateProjectThread({
    projectId: projectId!,
    config: {
      onSuccess: (data) => {
        navigate(`../${data.id}`);
      },
    },
  });

  if (!user || !projectId) return null;

  const handleSubmit = (data: z.infer<typeof createThreadInputSchema>) => {
    createProjectThreadMutation.mutate({
      projectId,
      data,
    });
  };

  return (
    <Form
      id="create-thread-form"
      onSubmit={handleSubmit}
      schema={createThreadInputSchema}
      options={{
        defaultValues: {
          title: '',
          body: '',
        },
      }}
    >
      {({ register, formState }) => (
        <FormDrawer
          title="Create New Thread"
          triggerButton={<Button>New Thread</Button>}
          submitButton={
            <Button
              form="create-thread-form"
              type="submit"
              isLoading={formState.isSubmitting}
            >
              Create Thread
            </Button>
          }
          isDone={false}
        >
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
            />
          </div>
        </FormDrawer>
      )}
    </Form>
  );
};
