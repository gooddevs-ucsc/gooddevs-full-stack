import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { Meta, Project } from '@/types/api';

export interface VolunteerProject extends Project {
  // Additional fields specific to volunteer projects
  application_date?: string;
  approved_date?: string;
  volunteer_role?: string;
}

export interface VolunteerProjectsResponse {
  data: VolunteerProject[];
  meta: Meta;
}

export const getVolunteerApprovedProjects = ({
  page = 1,
  limit = 20,
}: {
  page?: number;
  limit?: number;
} = {}): Promise<VolunteerProjectsResponse> => {
  return api.get('/volunteer-profile/projects/approved', {
    params: {
      page,
      limit,
    },
  });
};

export const useVolunteerApprovedProjects = ({
  page = 1,
  limit = 20,
}: {
  page?: number;
  limit?: number;
} = {}) => {
  return useQuery({
    queryKey: ['volunteer-approved-projects', { page, limit }],
    queryFn: () => getVolunteerApprovedProjects({ page, limit }),
  });
};
