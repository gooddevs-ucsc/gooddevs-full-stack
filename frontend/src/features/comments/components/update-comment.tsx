import { Pen } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Form, FormDrawer, Textarea } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';

import {
  updateCommentInputSchema,
  useUpdateComment,
} from '../api/update-comment';

type UpdateCommentProps = {
  commentId: string;
  discussionId: string;
  body: string;
};

export const UpdateComment = ({
  commentId,
  discussionId,
  body,
}: UpdateCommentProps) => {
  const { addNotification } = useNotifications();
  const updateCommentMutation = useUpdateComment({
    discussionId,
    mutationConfig: {
      onSuccess: () => {
        addNotification({
          type: 'success',
          title: 'Comment Updated',
        });
      },
    },
  });

  return (
    <FormDrawer
      isDone={updateCommentMutation.isSuccess}
      triggerButton={
        <Button icon={<Pen className="size-4" />} size="sm" variant="outline">
          Edit
        </Button>
      }
      title="Update Comment"
      submitButton={
        <Button
          form="update-comment"
          type="submit"
          size="sm"
          isLoading={updateCommentMutation.isPending}
        >
          Submit
        </Button>
      }
    >
      <Form
        id="update-comment"
        onSubmit={(values) => {
          updateCommentMutation.mutate({
            data: values,
            commentId,
          });
        }}
        options={{
          defaultValues: {
            body: body ?? '',
          },
        }}
        schema={updateCommentInputSchema}
      >
        {({ register, formState }) => (
          <Textarea
            label="Body"
            error={formState.errors['body']}
            registration={register('body')}
          />
        )}
      </Form>
    </FormDrawer>
  );
};
