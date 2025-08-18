import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';

import { api } from '@/lib/api-client';
import { MutationConfig, QueryConfig } from '@/lib/react-query';
import { Paginated, ProjectThread, Comment, Reply } from '@/types/api';

// Schema for creating a new thread
export const createThreadInputSchema = z.object({
  title: z.string().min(1, 'Required'),
  body: z.string().min(1, 'Required'),
});
export type CreateThreadInput = z.infer<typeof createThreadInputSchema>;

// Schema for creating a new comment (no parent_id)
export const createCommentInputSchema = z.object({
  body: z.string().min(1, 'Required'),
});
export type CreateCommentInput = z.infer<typeof createCommentInputSchema>;

// Schema for creating a new reply
export const createReplyInputSchema = z.object({
  body: z.string().min(1, 'Required'),
  parent_id: z.string().min(1, 'Parent comment ID is required'),
});
export type CreateReplyInput = z.infer<typeof createReplyInputSchema>;

// Schema for updating a reply
export const updateReplyInputSchema = z.object({
  body: z.string().min(1, 'Required'),
});
export type UpdateReplyInput = z.infer<typeof updateReplyInputSchema>;

// Schema for updating a comment
export const updateCommentInputSchema = z.object({
  body: z.string().min(1, 'Required'),
});
export type UpdateCommentInput = z.infer<typeof updateCommentInputSchema>;

// API function to get all threads for a project
export const getProjectThreads = ({
  projectId,
}: {
  projectId: string;
}): Promise<Paginated<ProjectThread>> => {
  return api.get(`/projects/${projectId}/threads`);
};

export const useProjectThreads = ({
  projectId,
  config,
}: {
  projectId: string;
  config?: QueryConfig<typeof getProjectThreads>;
}) => {
  return useQuery({
    ...config,
    queryKey: ['projects', projectId, 'threads'],
    queryFn: () => getProjectThreads({ projectId }),
  });
};

// API function to get a single thread by ID
export const getProjectThread = ({
  threadId,
}: {
  threadId: string;
}): Promise<ProjectThread> => {
  return api.get(`/projects/threads/${threadId}`);
};

export const useProjectThread = ({
  threadId,
  config,
}: {
  threadId: string;
  config?: QueryConfig<typeof getProjectThread>;
}) => {
  return useQuery({
    ...config,
    queryKey: ['projects', 'threads', threadId],
    queryFn: () => getProjectThread({ threadId }),
  });
};

// API function to create a thread
export const createProjectThread = ({
  projectId,
  data,
}: {
  projectId: string;
  data: CreateThreadInput;
}): Promise<ProjectThread> => {
  return api.post(`/projects/${projectId}/threads`, data);
};

export const useCreateProjectThread = ({
  projectId,
  config,
}: {
  projectId: string;
  config?: MutationConfig<typeof createProjectThread>;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: createProjectThread,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ['projects', projectId, 'threads'],
      });
      if (config?.onSuccess) {
        config.onSuccess(...args);
      }
    },
  });
};

// API function to create a comment (no parent_id)
export const createComment = ({
  threadId,
  data,
}: {
  threadId: string;
  data: CreateCommentInput;
}): Promise<Comment> => {
  return api.post(`/projects/threads/${threadId}/comments`, data);
};

export const useCreateComment = ({
  config,
  threadId,
  projectId,
}: {
  config?: MutationConfig<typeof createComment>;
  threadId: string;
  projectId?: string;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getProjectThreadQueryOptions(threadId).queryKey,
      });
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: ['projects', projectId, 'threads'],
        });
      }
      config?.onSuccess?.(...args);
    },
    mutationFn: createComment,
  });
};

// API function to create a reply
export const createReply = ({
  commentId,
  data,
}: {
  commentId: string;
  data: CreateReplyInput;
}): Promise<Reply> => {
  return api.post(`/projects/comments/${commentId}/replies`, data);
};

export const useCreateReply = ({
  config,
  threadId,
  projectId,
}: {
  config?: MutationConfig<typeof createReply>;
  threadId: string;
  projectId?: string;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getProjectThreadQueryOptions(threadId).queryKey,
      });
      if (projectId) {
        queryClient.invalidateQueries({
          queryKey: ['projects', projectId, 'threads'],
        });
      }
      config?.onSuccess?.(...args);
    },
    mutationFn: createReply,
  });
};

// Helper function to get query options for a thread
export const getProjectThreadQueryOptions = (threadId: string) => ({
  queryKey: ['projects', 'threads', threadId],
});

// API function to update a comment
export const updateComment = ({
  threadId,
  commentId,
  data,
}: {
  threadId: string;
  commentId: string;
  data: UpdateCommentInput;
}): Promise<Comment> => {
  return api.patch(`/projects/threads/${threadId}/comments/${commentId}`, data);
};

export const useUpdateComment = ({
  threadId,
  config,
}: {
  threadId: string;
  config?: MutationConfig<typeof updateComment>;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: updateComment,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getProjectThreadQueryOptions(threadId).queryKey,
      });
      config?.onSuccess?.(data, ...args);
    },
  });
};

// API function to update a reply
export const updateReply = ({
  replyId,
  data,
}: {
  replyId: string;
  data: UpdateReplyInput;
}): Promise<Reply> => {
  return api.patch(`/projects/replies/${replyId}`, data);
};

export const useUpdateReply = ({
  threadId,
  config,
}: {
  threadId: string;
  config?: MutationConfig<typeof updateReply>;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: updateReply,
    onSuccess: (data, ...args) => {
      queryClient.invalidateQueries({
        queryKey: getProjectThreadQueryOptions(threadId).queryKey,
      });
      config?.onSuccess?.(data, ...args);
    },
  });
};

// API function to delete a comment
export const deleteComment = ({
  threadId,
  commentId,
}: {
  commentId: string;
  threadId: string;
}) => {
  return api.delete(`/projects/threads/${threadId}/comments/${commentId}`);
};

export const useDeleteComment = ({
  threadId,
  config,
}: {
  threadId: string;
  config?: MutationConfig<typeof deleteComment>;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: deleteComment,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getProjectThreadQueryOptions(threadId).queryKey,
      });
      config?.onSuccess?.(...args);
    },
  });
};

// API function to delete a reply
export const deleteReply = ({ replyId }: { replyId: string }) => {
  return api.delete(`/projects/replies/${replyId}`);
};

export const useDeleteReply = ({
  threadId,
  config,
}: {
  threadId: string;
  config?: MutationConfig<typeof deleteReply>;
}) => {
  const queryClient = useQueryClient();
  return useMutation({
    ...config,
    mutationFn: deleteReply,
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: getProjectThreadQueryOptions(threadId).queryKey,
      });
      config?.onSuccess?.(...args);
    },
  });
};
