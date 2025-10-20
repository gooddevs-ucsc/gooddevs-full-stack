import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';

export interface VolunteerStats {
  total_projects_contributed: number;
  total_tasks_assigned: number;
  total_tasks_completed: number;
  total_threads_created: number;
  total_comments_made: number;
  total_replies_made: number;
  volunteer_name: string;
  member_since: string;
}

export const getVolunteerStats = (): Promise<VolunteerStats> => {
  return api.get('/volunteer-profile/stats/me');
};

export const useVolunteerStats = () => {
  return useQuery({
    queryKey: ['volunteer-stats'],
    queryFn: getVolunteerStats,
  });
};
