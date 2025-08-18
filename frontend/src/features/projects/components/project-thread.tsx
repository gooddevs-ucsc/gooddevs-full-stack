import {
  MessageCircle,
  Send,
  User,
  Edit,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';

import { Button } from '@/components/ui/button';
import { Form, Textarea } from '@/components/ui/form';
import { useNotifications } from '@/components/ui/notifications';
import { formatDate } from '@/utils/format';
import { Spinner } from '@/components/ui/spinner';
import { useUser } from '@/lib/auth';
import { MDPreview } from '@/components/ui/md-preview';

import {
  useProjectThread,
  useCreateComment,
  useUpdateComment,
  useDeleteComment,
  createCommentInputSchema,
  updateCommentInputSchema,
  type CreateCommentInput,
  type UpdateCommentInput,
} from '../api/get-project-thread';
import { Comment as CommentType } from '@/types/api';

type ProjectThreadProps = {
  threadId: string;
};

const CommentItem = ({
  comment,
  currentUser,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  onReply,
  isUpdating,
  isDeleting,
  editingCommentId,
  setEditingCommentId,
  handleUpdateComment,
  handleDeleteComment,
  handleAddComment,
  updateCommentMutation,
  deleteCommentMutation,
  createCommentMutation,
}: {
  comment: CommentType;
  currentUser: any;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (values: UpdateCommentInput) => void;
  onDelete: () => void;
  onReply: (values: CreateCommentInput) => Promise<void>;
  isUpdating: boolean;
  isDeleting: boolean;
  editingCommentId: string | null;
  setEditingCommentId: (id: string | null) => void;
  handleUpdateComment: (
    commentId: string,
    values: UpdateCommentInput,
  ) => Promise<void>;
  handleDeleteComment: (commentId: string) => Promise<void>;
  handleAddComment: (values: CreateCommentInput) => Promise<void>;
  updateCommentMutation: any;
  deleteCommentMutation: any;
  createCommentMutation: any;
}) => {
  const canEdit = currentUser?.id === comment.author_id;
  const [isReplying, setIsReplying] = useState(false);

  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-4 shadow-sm">
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
            <div>
              <MDPreview value={comment.body} />
              <div className="mt-2 flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsReplying(!isReplying)}
                >
                  Reply
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {isReplying && (
        <div className="ml-14 mt-4">
          <Form
            onSubmit={async (values) => {
              await onReply({ ...values, parentId: comment.id });
              setIsReplying(false);
            }}
            schema={createCommentInputSchema}
          >
            {({ register, formState, reset }) => (
              <div className="space-y-2">
                <Textarea
                  registration={register('body')}
                  error={formState.errors.body}
                  placeholder="Write a reply..."
                  rows={3}
                />
                <div className="flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsReplying(false);
                      reset();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" size="sm" isLoading={isUpdating}>
                    Submit Reply
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-8 mt-4 space-y-4 border-l-2 border-slate-200 pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              currentUser={currentUser}
              isEditing={editingCommentId === reply.id}
              onEdit={() => setEditingCommentId(reply.id)}
              onCancelEdit={() => setEditingCommentId(null)}
              onUpdate={(values) => handleUpdateComment(reply.id, values)}
              onDelete={() => handleDeleteComment(reply.id)}
              onReply={handleAddComment}
              isUpdating={updateCommentMutation.isPending}
              isDeleting={deleteCommentMutation.isPending}
              editingCommentId={editingCommentId}
              setEditingCommentId={setEditingCommentId}
              handleUpdateComment={handleUpdateComment}
              handleDeleteComment={handleDeleteComment}
              handleAddComment={handleAddComment}
              updateCommentMutation={updateCommentMutation}
              deleteCommentMutation={deleteCommentMutation}
              createCommentMutation={createCommentMutation}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const ProjectThread = ({ threadId }: ProjectThreadProps) => {
  const { addNotification } = useNotifications();
  const [isCommentFormOpen, setIsCommentFormOpen] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);

  const { data: thread, isLoading, error } = useProjectThread({ threadId });
  const createCommentMutation = useCreateComment({
    threadId: threadId,
    projectId: thread?.project_id,
  });
  const updateCommentMutation = useUpdateComment({ threadId });
  const deleteCommentMutation = useDeleteComment({ threadId });

  const user = useUser();

  const comments = thread?.comments || [];

  const handleAddComment = async (values: CreateCommentInput) => {
    if (!thread) return;
    await createCommentMutation.mutateAsync({
      threadId: thread.id,
      data: values,
    });
    if (!values.parentId) {
      setIsCommentFormOpen(false);
    }
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
          Discussion thread not found.
        </h4>
      </div>
    );
  }

  return (
    <>
      <div className="mb-8 rounded-xl border border-slate-200/60 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-slate-200/60 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link to={`/projects/${thread.project_id}`}>
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="size-5" />
                </Button>
              </Link>
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

        {/* Thread Body */}
        <div className="prose max-w-none p-6">
          <MDPreview value={thread.body} />
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/60 bg-white shadow-sm">
        {/* Comments List */}
        <div className="space-y-4 p-4">
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
                onReply={handleAddComment}
                isUpdating={updateCommentMutation.isPending}
                isDeleting={deleteCommentMutation.isPending}
                editingCommentId={editingCommentId}
                setEditingCommentId={setEditingCommentId}
                handleUpdateComment={handleUpdateComment}
                handleDeleteComment={handleDeleteComment}
                handleAddComment={handleAddComment}
                updateCommentMutation={updateCommentMutation}
                deleteCommentMutation={deleteCommentMutation}
                createCommentMutation={createCommentMutation}
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
    </>
  );
};
