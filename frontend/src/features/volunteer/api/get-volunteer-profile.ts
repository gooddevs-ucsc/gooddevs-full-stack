import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { User } from '@/types/api';

export interface VolunteerProfile {
  id: string;
  user_id: string;
  bio: string | null;
  tagline: string | null;
  location: string | null;
  profile_image_url: string | null;
  cover_image_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  twitter_url: string | null;
  contact_phone: string | null;
  website: string | null;
  skills: string[] | null;
  experience: ExperienceItem[] | null;
  created_at: string;
  updated_at: string;
  user: User | null;
}

export interface ExperienceItem {
  id: string;
  title: string;
  company: string;
  duration: string;
  description: string;
  technologies?: string[];
  current?: boolean;
}

export interface VolunteerProfileResponse {
  data: VolunteerProfile;
}

export const getVolunteerProfile = (): Promise<VolunteerProfileResponse> => {
  return api.get('/volunteer-profile/');
};

export const getVolunteerProfileByUserId = (
  userId: string,
): Promise<VolunteerProfileResponse> => {
  return api.get(`/volunteer-profile/user/${userId}`);
};

export const useVolunteerProfile = (userId?: string) => {
  return useQuery({
    queryKey: userId ? ['volunteer-profile', userId] : ['volunteer-profile'],
    queryFn: userId
      ? () => getVolunteerProfileByUserId(userId)
      : getVolunteerProfile,
  });
};

export const useVolunteerProfileByUserId = (userId: string) => {
  return useQuery({
    queryKey: ['volunteer-profile', userId],
    queryFn: () => getVolunteerProfileByUserId(userId),
    enabled: !!userId,
  });
};
