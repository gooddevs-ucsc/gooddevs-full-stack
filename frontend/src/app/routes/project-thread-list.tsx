import { Link, useParams } from 'react-router';

import { Spinner } from '@/components/ui/spinner';
import { useProjectThreads } from '@/features/projects/api/get-project-thread';
import { CreateThreadForm } from '@/features/projects/components/create-thread-form';
import { formatDate } from '@/utils/format';

export const ProjectThreadListRoute = () => {
  const { id } = useParams();
  const projectThreadsQuery = useProjectThreads({ projectId: id! });

  if (projectThreadsQuery.isLoading) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!projectThreadsQuery.data) return null;

  return (
    <>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Project Threads</h1>
        <CreateThreadForm projectId={id!} />
      </div>
      <div className="mt-4">
        <ul>
          {projectThreadsQuery.data.data.map((thread) => (
            <li key={thread.id} className="border-b py-4">
              <Link to={thread.id} className="flex justify-between">
                <div>
                  <h2 className="text-xl font-semibold">{thread.title}</h2>
                  <p className="text-sm text-gray-500">
                    #{thread.id} opened on{' '}
                    {formatDate(new Date(thread.created_at).getTime())} by{' '}
                    {thread.author.firstname} {thread.author.lastname}
                  </p>
                </div>
                <div className="text-right">
                  <p>{thread.comments.length} Comments</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
