import { useQuery, queryOptions } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { QueryConfig } from '@/lib/react-query';

export interface RequesterProfile {
  id: string;
  about: string;
  tagline: string;
  location: string;
  website_url?: string;
  linkedin_url?: string;
  github_url?: string;
  twitter_url?: string;
  facebook_url?: string;
  instagram_url?: string;
  organization_name?: string;
  phone_number?: string;
  logo_url?: string;
  cover_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface PublicUserProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: string;
  created_at: string;
  requester_profile?: RequesterProfile;
}

export interface UserProject {
  id: string;
  title: string;
  description: string;
  project_type: string;
  status: string;
  created_at: string;
  preferred_technologies?: string;
}

export const getPublicUserProfile = ({
  userId,
}: {
  userId: string;
}): Promise<{ data: PublicUserProfile }> => {
  return api.get(`/public/users/${userId}/public-profile`);
};

export const getUserProjects = ({
  userId,
}: {
  userId: string;
}): Promise<{ data: UserProject[] }> => {
  return api.get(`/public/users/${userId}/projects`);
};

export const getPublicUserProfileQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: ['users', userId, 'public-profile'],
    queryFn: () => getPublicUserProfile({ userId }),
  });
};

export const getUserProjectsQueryOptions = (userId: string) => {
  return queryOptions({
    queryKey: ['users', userId, 'projects'],
    queryFn: () => getUserProjects({ userId }),
  });
};

type UsePublicUserProfileOptions = {
  userId: string;
  queryConfig?: QueryConfig<typeof getPublicUserProfileQueryOptions>;
};

export const usePublicUserProfile = ({
  userId,
  queryConfig,
}: UsePublicUserProfileOptions) => {
  return useQuery({
    ...getPublicUserProfileQueryOptions(userId),
    ...queryConfig,
  });
};

type UseUserProjectsOptions = {
  userId: string;
  queryConfig?: QueryConfig<typeof getUserProjectsQueryOptions>;
};

export const useUserProjects = ({
  userId,
  queryConfig,
}: UseUserProjectsOptions) => {
  return useQuery({
    ...getUserProjectsQueryOptions(userId),
    ...queryConfig,
  });
};
