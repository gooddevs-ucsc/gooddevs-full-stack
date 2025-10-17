import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig } from '@/lib/react-query';
import { Comment } from '@/types/api';

import { getInfiniteCommentsQueryOptions } from './get-comments';

export const updateCommentInputSchema = z.object({
  body: z.string().min(1, 'Required'),
});

export type UpdateCommentInput = z.infer<typeof updateCommentInputSchema>;

type UpdateCommentVariables = {
  data: UpdateCommentInput;
  commentId: string;
};

export const updateComment = ({
  data,
  commentId,
}: UpdateCommentVariables): Promise<Comment> => {
  return api.patch(`/comments/${commentId}`, data);
};

type UseUpdateCommentOptions = {
  discussionId: string;
  mutationConfig?: MutationConfig<typeof updateComment>;
};

export const useUpdateComment = ({
  discussionId,
  mutationConfig,
}: UseUpdateCommentOptions) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restConfig } = mutationConfig || {};

  return useMutation<Comment, Error, UpdateCommentVariables>({
    ...restConfig,
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: getInfiniteCommentsQueryOptions(discussionId).queryKey,
      });
      onSuccess?.(data, variables, context);
    },
    mutationFn: updateComment,
  });
};
