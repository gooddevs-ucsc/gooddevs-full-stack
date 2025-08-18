import { Link, useMatch } from 'react-router';
import { MessageCircle } from 'lucide-react';

import { Spinner } from '@/components/ui/spinner';
import { useProjectThreads } from '../api/get-project-thread';
import { formatDate } from '@/utils/format';
import { CreateThreadForm } from './create-thread-form';

type ProjectThreadListProps = {
  projectId: string;
};

export const ProjectThreadList = ({ projectId }: ProjectThreadListProps) => {
  const { data, isLoading, error } = useProjectThreads({ projectId });
  const match = useMatch('/projects/:id/threads/:threadId');
  if (match) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Spinner />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="text-center text-red-500">
        Error loading discussion threads.
      </div>
    );
  }

  const threads = data.data;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Discussion</h2>
        <CreateThreadForm projectId={projectId} />
      </div>
      {threads.length === 0 ? (
        <div className="text-center text-gray-500">
          <MessageCircle className="mx-auto mb-2 size-12" />
          <p>No discussion threads yet.</p>
          <p>Be the first to start a conversation!</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {threads.map((thread) => (
            <li
              key={thread.id}
              className="rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md"
            >
              <Link
                to={`/projects/${projectId}/threads/${thread.id}`}
                className="block"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600 hover:underline">
                      {thread.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      by {thread.author.firstname} {thread.author.lastname} on{' '}
                      {formatDate(new Date(thread.created_at).getTime())}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {thread.comments.length} comments
                    </p>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
