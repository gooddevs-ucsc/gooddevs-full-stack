import { api } from '@/lib/api-client';

// Types matching the backend models
export interface VolunteerSkill {
  id: string;
  name: string;
}

export interface VolunteerExperience {
  id: string;
  title: string;
  company: string;
  years: string;
  description?: string;
}

export interface VolunteerProject {
  id: string;
  title: string;
  description?: string;
  link?: string;
}

export interface User {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  role: string;
  is_active: boolean;
  is_superuser: boolean;
}

export interface VolunteerProfile {
  id: string;
  user_id: string;
  age?: number;
  title?: string;
  bio?: string;
  phone?: string;
  location?: string;
  profile_photo_url?: string;
  linkedin_profile_url?: string;
  github_profile_url?: string;
  created_at: string;
  updated_at: string;
  user: User;
  skills: VolunteerSkill[];
  experiences: VolunteerExperience[];
  projects: VolunteerProject[];
}

export interface VolunteerProfileCreate {
  age?: number;
  title?: string;
  bio?: string;
  phone?: string;
  location?: string;
  profile_photo_url?: string;
  linkedin_profile_url?: string;
  github_profile_url?: string;
}

export interface VolunteerExperienceCreate {
  title: string;
  company: string;
  years: string;
  description?: string;
}

export interface VolunteerProjectCreate {
  title: string;
  description?: string;
  link?: string;
}

export interface VolunteerProfileCreateRequest {
  profile: VolunteerProfileCreate;
  skills: string[];
  experiences: VolunteerExperienceCreate[];
  projects: VolunteerProjectCreate[];
}

export interface VolunteerProfileResponse {
  data: VolunteerProfile;
}

// API functions
export const volunteerProfileApi = {
  // Get current user's profile
  getMyProfile: (): Promise<VolunteerProfileResponse> => {
    return api.get('/volunteer-profiles/me');
  },

  // Create current user's profile
  createMyProfile: (
    profileData: VolunteerProfileCreateRequest,
  ): Promise<VolunteerProfileResponse> => {
    return api.post('/volunteer-profiles/me', profileData);
  },

  // Update current user's profile
  updateMyProfile: (
    profileData: VolunteerProfileCreateRequest,
  ): Promise<VolunteerProfileResponse> => {
    return api.put('/volunteer-profiles/me', profileData);
  },

  // Delete current user's profile
  deleteMyProfile: (): Promise<{ message: string }> => {
    return api.delete('/volunteer-profiles/me');
  },

  // Check if current user has a profile
  checkProfileExists: (): Promise<{ exists: boolean }> => {
    return api.get('/volunteer-profiles/check/exists');
  },

  // Get profile by ID (public)
  getProfileById: (profileId: string): Promise<VolunteerProfileResponse> => {
    return api.get(`/volunteer-profiles/${profileId}`);
  },
};
