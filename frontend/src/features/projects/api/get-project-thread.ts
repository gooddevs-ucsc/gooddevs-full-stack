import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export type ProjectThreadComment = {
  id: string;
  content: string;
  author: {
    id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    is_active: boolean;
    is_superuser: boolean;
  };
  created_at: string;
  updated_at: string;
  project_id: string;
};

export type ProjectThread = {
  id: string;
  project_id: string;
  comments: ProjectThreadComment[];
  created_at: string;
  updated_at: string;
};

export const getProjectThread = ({ projectId }: { projectId: string }): Promise< ProjectThread > => {
  return api.get(`/projects/${projectId}/thread`);
};

export const getProjectThreadQueryOptions = (projectId: string) => {
  return {
    queryKey: ['project-thread', projectId],
    queryFn: () => getProjectThread({ projectId }),
  } as const;
};

type UseProjectThreadOptions = {
  projectId: string;
  queryConfig?: QueryConfig<typeof getProjectThread>;
};

export const useProjectThread = ({ projectId, queryConfig }: UseProjectThreadOptions) => {
  return useQuery({
    ...getProjectThreadQueryOptions(projectId),
    ...queryConfig,
  });
};

export const createProjectComment = ({ 
  projectId, 
  data 
}: { 
  projectId: string; 
  data: { content: string } 
}): Promise< ProjectThreadComment > => {
  return api.post(`/projects/${projectId}/thread/comments`, data);
};

export const updateProjectComment = ({ 
  projectId,
  commentId, 
  data 
}: { 
  projectId: string;
  commentId: string; 
  data: { content: string } 
}): Promise< ProjectThreadComment > => {
  return api.patch(`/projects/${projectId}/thread/comments/${commentId}`, data);
};

export const deleteProjectComment = ({ 
  projectId,
  commentId 
}: { 
  projectId: string;
  commentId: string 
}): Promise<{ message: string }> => {
  return api.delete(`/projects/${projectId}/thread/comments/${commentId}`);
};

export const useCreateProjectComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createProjectComment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['project-thread', variables.projectId] 
      });
    },
  });
};

export const useUpdateProjectComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateProjectComment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['project-thread', variables.projectId] 
      });
    },
  });
};

export const useDeleteProjectComment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteProjectComment,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['project-thread', variables.projectId] 
      });
    },
  });
};