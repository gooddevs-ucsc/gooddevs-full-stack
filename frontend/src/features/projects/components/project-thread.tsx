import {
  MessageCircle,
  Send,
  User,
  Clock,
  ThumbsUp,
  Reply,
  MoreHorizontal,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, Input, Textarea } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { formatDate } from '@/utils/format';
import { Spinner } from '@/components/ui/spinner';
import { useUser } from '@/lib/auth';

import {
  useProjectThreads,
  useCreateProjectThread,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  createCommentInputSchema,
  updateCommentInputSchema,
  createThreadInputSchema,
  type CreateCommentInput,
  type UpdateCommentInput,
  type CreateThreadInput,
} from '../api/get-project-thread';
import { Comment as CommentType } from '@/types/api';

type ProjectThreadProps = {
  projectId: string;
};

const CommentItem = ({
  comment,
  currentUser,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: {
  comment: CommentType;
  currentUser: any;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (values: UpdateCommentInput) => void;
  onDelete: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
}) => {
  const canEdit = currentUser?.id === comment.author_id;

  return (
    <div className="p-6">
      <div className="flex items-start gap-4">
        <div className="flex size-10 items-center justify-center rounded-full bg-slate-100">
          <User className="size-5 text-slate-500" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-semibold text-slate-900">
                {comment.author.firstname} {comment.author.lastname}
              </span>
              <span className="ml-2 text-sm text-slate-500">
                {formatDate(new Date(comment.created_at).getTime())}
              </span>
            </div>
            {canEdit && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onEdit}
                  disabled={isEditing}
                >
                  <Edit className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  isLoading={isDeleting}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            )}
          </div>
          {isEditing ? (
            <Form
              onSubmit={onUpdate}
              schema={updateCommentInputSchema}
              options={{ defaultValues: { body: comment.body } }}
            >
              {({ register, formState }) => (
                <div className="mt-2 space-y-2">
                  <Textarea
                    registration={register('body')}
                    error={formState.errors.body}
                    rows={3}
                  />
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={onCancelEdit}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      isLoading={isUpdating}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      Update
                    </Button>
                  </div>
                </div>
              )}
            </Form>
          ) : (
            <p className="mt-2 text-slate-700">{comment.body}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const ProjectThread = ({ projectId }: ProjectThreadProps) => {
  const { addNotification } = useNotifications();
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const {
    data: threadsData,
    isLoading,
    error,
  } = useProjectThreads({ projectId });
  const createThreadMutation = useCreateProjectThread({ projectId });
  const createCommentMutation = useCreateComment({
    projectId,
    threadId: threadsData?.data?.[0]?.id || '',
  });
  const updateCommentMutation = useUpdateComment({ projectId });
  const deleteCommentMutation = useDeleteComment({ projectId });

  const user = useUser();

  const thread = threadsData?.data?.[0];
  const comments = thread?.comments || [];

  const handleCreateThread = async (values: CreateThreadInput) => {
    await createThreadMutation.mutateAsync({
      projectId,
      data: values,
    });
    addNotification({
      type: 'success',
      title: 'Discussion Started',
    });
  };

  const handleAddComment = async (values: CreateCommentInput) => {
    if (!thread) return;
    await createCommentMutation.mutateAsync({
      projectId,
      threadId: thread.id,
      data: values,
    });
    setIsCommentFormOpen(false);
    addNotification({
      type: 'success',
      title: 'Comment posted',
    });
  };

  const handleUpdateComment = async (
    commentId: string,
    values: UpdateCommentInput,
  ) => {
    if (!thread) return;
    await updateCommentMutation.mutateAsync({
      threadId: thread.id,
      commentId,
      data: values,
    });
    setEditingCommentId(null);
    addNotification({
      type: 'success',
      title: 'Comment updated',
    });
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!thread) return;
    await deleteCommentMutation.mutateAsync({ commentId, threadId: thread.id });
    addNotification({
      type: 'success',
      title: 'Comment deleted',
    });
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm">
        <div className="flex items-center justify-center p-12">
          <Spinner size="lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 shadow-sm">
        <div className="text-center">
          <h3 className="mb-2 text-lg font-medium text-red-900">
            Unable to load discussion
          </h3>
          <p className="text-red-700">
            There was an error loading the project discussion. Please try again
            later.
          </p>
        </div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="rounded-xl border border-slate-200/60 bg-white p-12 text-center shadow-sm">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-slate-100">
          <MessageCircle className="size-8 text-slate-400" />
        </div>
        <h4 className="mb-4 text-lg font-medium text-slate-900">
          Start the Project Discussion
        </h4>
        <Form onSubmit={handleCreateThread} schema={createThreadInputSchema}>
          {({ register, formState }) => (
            <div className="mx-auto max-w-lg space-y-4">
              <Input
                label="Title"
                registration={register('title')}
                error={formState.errors.title}
              />
              <Textarea
                label="Message"
                registration={register('body')}
                error={formState.errors.body}
              />
              <Button
                type="submit"
                isLoading={createThreadMutation.isPending}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                <Plus className="mr-2 size-4" />
                Start Discussion
              </Button>
            </div>
          )}
        </Form>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm">
      {/* Header */}
      <div className="border-b border-slate-200/60 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
              <MessageCircle className="size-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-900">
                {thread.title}
              </h3>
              <p className="text-sm text-slate-600">
                {comments.length}{' '}
                {comments.length === 1 ? 'comment' : 'comments'}
              </p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setIsCommentFormOpen(!isCommentFormOpen)}
            className="bg-green-600 text-white hover:bg-green-700"
            disabled={createCommentMutation.isPending}
          >
            <div className="flex items-center gap-2">
              <MessageCircle className="mr-2 size-4" />
              {isCommentFormOpen ? 'Cancel' : 'Join Discussion'}
            </div>
          </Button>
        </div>
      </div>

      {/* Comments List */}
      <div className="divide-y divide-slate-200/60">
        {comments.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-600">No comments yet.</p>
          </div>
        ) : (
          comments.map((comment: CommentType) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={user.data}
              isEditing={editingCommentId === comment.id}
              onEdit={() => setEditingCommentId(comment.id)}
              onCancelEdit={() => setEditingCommentId(null)}
              onUpdate={(values) => handleUpdateComment(comment.id, values)}
              onDelete={() => handleDeleteComment(comment.id)}
              isUpdating={updateCommentMutation.isPending}
              isDeleting={deleteCommentMutation.isPending}
            />
          ))
        )}
      </div>

      {/* Add Comment Form */}
      {isCommentFormOpen && (
        <div className="border-t border-slate-200/60 bg-gradient-to-br from-slate-50/30 to-white p-6">
          <Form onSubmit={handleAddComment} schema={createCommentInputSchema}>
            {({ register, formState, reset }) => (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200">
                    <User className="size-5 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Add your comment..."
                      registration={register('body')}
                      error={formState.errors.body}
                      rows={4}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setIsCommentFormOpen(false);
                        reset();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      size="sm"
                      isLoading={createCommentMutation.isPending}
                      className="bg-green-600 text-white hover:bg-green-700"
                    >
                      <Send className="mr-2 size-4" />
                      {createCommentMutation.isPending
                        ? 'Posting...'
                        : 'Post Comment'}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </Form>
        </div>
      )}
    </div>
  );
};
