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
} from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form, Textarea } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { formatDate } from '@/utils/format';
import { Spinner } from '@/components/ui/spinner';
import { useUser } from '@/lib/auth';

import {
  useProjectThread,
  useCreateProjectComment,
  useUpdateProjectComment,
  useDeleteProjectComment,
  type ProjectThreadComment,
} from '../api/get-project-thread';

type ProjectThreadProps = {
  projectId: string;
};

const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment content is required')
    .max(2000, 'Comment is too long'),
});

export const ProjectThread = ({ projectId }: ProjectThreadProps) => {
  const { addNotification } = useNotifications();
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const { data: thread, isLoading, error } = useProjectThread({ projectId });

  const createCommentMutation = useCreateProjectComment();
  const updateCommentMutation = useUpdateProjectComment();
  const deleteCommentMutation = useDeleteProjectComment();

  const user = useUser();

  const comments = thread?.comments || [];

  const handleAddComment = async (values: { content: string }) => {
    try {
      await createCommentMutation.mutateAsync({
        projectId,
        data: { content: values.content },
      });

      setIsCommentFormOpen(false);
      addNotification({
        type: 'success',
        title: 'Comment posted successfully',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to post comment',
        message: 'Please try again.',
      });
    }
  };

  const handleUpdateComment = async (
    commentId: string,
    values: { content: string },
  ) => {
    try {
      await updateCommentMutation.mutateAsync({
        projectId,
        commentId,
        data: { content: values.content },
      });

      setEditingCommentId(null);
      addNotification({
        type: 'success',
        title: 'Comment updated successfully',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to update comment',
        message: 'Please try again.',
      });
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await deleteCommentMutation.mutateAsync({
        projectId,
        commentId,
      });

      addNotification({
        type: 'success',
        title: 'Comment deleted successfully',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Failed to delete comment',
        message: 'Please try again.',
      });
    }
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
          <h3 className="text-lg font-medium text-red-900 mb-2">
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
                Project Discussion
              </h3>
              <p className="text-sm text-slate-600">
                {comments.length}{' '}
                {comments.length === 1 ? 'comment' : 'comments'} •
                <span className="ml-1 text-green-600">
                  Active collaboration
                </span>
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
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-slate-100">
              <MessageCircle className="size-8 text-slate-400" />
            </div>
            <h4 className="mb-2 text-lg font-medium text-slate-900">
              Start the conversation
            </h4>
            <p className="text-slate-600">
              Share your ideas, ask questions, or introduce yourself to the team
            </p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUser={user.data}
              isFirst={index === 0}
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
          <Form onSubmit={handleAddComment} schema={commentSchema}>
            {({ register, formState, reset }) => (
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200 flex-shrink-0">
                    <User className="size-5 text-green-700" />
                  </div>
                  <div className="flex-1">
                    <Textarea
                      placeholder="Share your ideas, ask questions, or contribute to the discussion...

You can use **markdown** formatting:
- **bold text**
- *italic text*  
- `code snippets`
- Lists and more!"
                      registration={register('content')}
                      error={formState.errors['content']}
                      rows={6}
                      className="resize-none border-slate-300 focus:border-green-500 focus:ring-green-500"
                    />
                    <div className="mt-2 text-xs text-slate-500">
                      💡 <strong>Tip:</strong> Introduce yourself, share your
                      skills, ask questions, or propose ideas
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span>✨ Be respectful and constructive</span>
                    <span>• 📝 Markdown supported</span>
                  </div>
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

      {/* Thread Stats Footer */}
      {comments.length > 0 && (
        <div className="border-t border-slate-200/60 bg-gradient-to-r from-slate-50/50 to-white px-6 py-4">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1">
                <Clock className="size-4" />
                <span>
                  Last activity:{' '}
                  {formatDate(
                    new Date(
                      comments[comments.length - 1]?.updated_at || Date.now(),
                    ).getTime(),
                  )}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <User className="size-4" />
                <span>
                  {
                    new Set(
                      comments.map(
                        (c) => `${c.author.firstname} ${c.author.lastname}`,
                      ),
                    ).size
                  }{' '}
                  participants
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Comment Item Component
type CommentItemProps = {
  comment: ProjectThreadComment;
  currentUser: any;
  isFirst: boolean;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (values: { content: string }) => void;
  onDelete: () => void;
  isUpdating: boolean;
  isDeleting: boolean;
};

const CommentItem = ({
  comment,
  currentUser,
  isFirst,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  isUpdating,
  isDeleting,
}: CommentItemProps) => {
  const canModify =
    currentUser?.id === comment.author.id || currentUser?.is_superuser;

  if (isEditing) {
    return (
      <div className="p-6 bg-slate-50/50">
        <Form onSubmit={onUpdate} schema={commentSchema}>
          {({ register, formState }) => (
            <div className="space-y-4">
              <Textarea
                defaultValue={comment.content}
                registration={register('content')}
                error={formState.errors['content']}
                rows={4}
                className="resize-none"
              />
              <div className="flex items-center gap-3">
                <Button type="submit" size="sm" isLoading={isUpdating}>
                  Save Changes
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={onCancelEdit}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Form>
      </div>
    );
  }

  return (
    <div className="p-6 hover:bg-slate-50/50 transition-colors">
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex-shrink-0">
          <User className="size-6 text-slate-600" />
        </div>

        <div className="flex-1 min-w-0">
          {/* Comment Header */}
          <div className="mb-3 flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-slate-900">
              {comment.author.firstname} {comment.author.lastname}
            </span>
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
              {comment.author.role}
            </span>
            <span className="text-sm text-slate-500">•</span>
            <span className="text-sm text-slate-500">
              {formatDate(new Date(comment.created_at).getTime())}
            </span>
            {isFirst && (
              <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                OP
              </span>
            )}
          </div>

          {/* Comment Content */}
          <div className="prose prose-sm max-w-none text-slate-700 mb-4">
            <div
              className="whitespace-pre-wrap leading-relaxed"
              style={{ wordBreak: 'break-word' }}
            >
              {comment.content}
            </div>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center gap-4 text-sm">
            <button className="flex items-center gap-1 text-slate-500 hover:text-slate-700 transition-colors">
              <Reply className="size-4" />
              Reply
            </button>
            <div className="relative">
              <button
                className="text-slate-500 hover:text-slate-700 transition-colors"
                onClick={() => {
                  // Show context menu with Edit/Delete options
                  const canModify = true; // You can check if current user can modify this comment
                  if (canModify) {
                    onEdit();
                  }
                }}
              >
                <MoreHorizontal className="size-4" />
              </button>
            </div>
            {/* Add Edit/Delete buttons for comment owner */}
            <button
              onClick={onEdit}
              className="text-slate-500 hover:text-blue-600 transition-colors"
            >
              <Edit className="size-4" />
            </button>
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="text-slate-500 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
