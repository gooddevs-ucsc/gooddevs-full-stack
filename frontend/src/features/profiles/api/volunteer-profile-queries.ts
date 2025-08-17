import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { volunteerProfileApi } from './volunteer-profile-api';

export const volunteerProfileKeys = {
  all: ['volunteer-profiles'] as const,
  my: () => [...volunteerProfileKeys.all, 'my'] as const,
  exists: () => [...volunteerProfileKeys.all, 'exists'] as const,
  byId: (id: string) => [...volunteerProfileKeys.all, 'by-id', id] as const,
};

// Hook to get current user's profile
export const useMyVolunteerProfile = () => {
  return useQuery({
    queryKey: volunteerProfileKeys.my(),
    queryFn: volunteerProfileApi.getMyProfile,
    retry: false, // Don't retry on 404 when profile doesn't exist
  });
};

// Hook to check if current user has a profile
export const useVolunteerProfileExists = () => {
  return useQuery({
    queryKey: volunteerProfileKeys.exists(),
    queryFn: volunteerProfileApi.checkProfileExists,
  });
};

// Hook to get profile by ID
export const useVolunteerProfileById = (profileId: string) => {
  return useQuery({
    queryKey: volunteerProfileKeys.byId(profileId),
    queryFn: () => volunteerProfileApi.getProfileById(profileId),
    enabled: !!profileId,
  });
};

// Hook to create profile
export const useCreateVolunteerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: volunteerProfileApi.createMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: volunteerProfileKeys.my() });
      queryClient.invalidateQueries({
        queryKey: volunteerProfileKeys.exists(),
      });
    },
  });
};

// Hook to update profile
export const useUpdateVolunteerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: volunteerProfileApi.updateMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: volunteerProfileKeys.my() });
    },
  });
};

// Hook to delete profile
export const useDeleteVolunteerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: volunteerProfileApi.deleteMyProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: volunteerProfileKeys.my() });
      queryClient.invalidateQueries({
        queryKey: volunteerProfileKeys.exists(),
      });
    },
  });
};
