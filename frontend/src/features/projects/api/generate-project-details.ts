import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api-client';
import { EstimatedTimeline, ProjectType } from '@/types/api';

export interface GeneratedProjectDetails {
  title: string;
  description: string;
  project_type: ProjectType;
  technologies: string[];
  estimated_timeline: EstimatedTimeline;
}

export const generateProjectDetails = async (
  prompt: string,
): Promise<GeneratedProjectDetails> => {
  const data = (await api.post('/projects/generate-details', null, {
    params: { prompt },
  })) as GeneratedProjectDetails;

  if (!data) {
    throw new Error('Empty response from server');
  }

  // Validate each field
  const validationErrors = [];

  if (!data.title) validationErrors.push('Missing or empty title');
  if (!data.description) validationErrors.push('Missing or empty description');
  if (!data.project_type)
    validationErrors.push('Missing or empty project_type');
  if (!data.estimated_timeline)
    validationErrors.push('Missing or empty estimated_timeline');
  if (!Array.isArray(data.technologies)) {
    validationErrors.push(
      `Technologies should be an array, got: ${typeof data.technologies}`,
    );
  }

  if (validationErrors.length > 0) {
    throw new Error(
      `Invalid response structure: ${validationErrors.join(', ')}`,
    );
  }

  return data;
};

export const useGenerateProjectDetails = () => {
  return useMutation({
    mutationFn: generateProjectDetails,
  });
};
