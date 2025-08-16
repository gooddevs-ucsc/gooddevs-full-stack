import { useNavigate, useParams } from 'react-router';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, FormDrawer, Input, Textarea } from '@/components/ui/form';

import { useUser } from '@/lib/auth';

import {
  createThreadInputSchema,
  useCreateProjectThread,
} from '../api/get-project-thread';

export const CreateDiscussionForm = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { data: user } = useUser();
  const createProjectThreadMutation = useCreateProjectThread({
    projectId: projectId!,
    config: {
      onSuccess: (data) => {
        navigate(`../discussion/${data.id}`);
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
      id="create-discussion-form"
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
          isDone={createProjectThreadMutation.isSuccess}
          title="Create New Discussion"
          triggerButton={<Button>New Discussion</Button>}
          submitButton={
            <Button
              form="create-discussion-form"
              type="submit"
              isLoading={formState.isSubmitting}
            >
              Create Discussion
            </Button>
          }
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
