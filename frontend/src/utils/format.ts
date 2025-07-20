import { default as dayjs } from 'dayjs';

import {
  ESTIMATED_TIMELINE_LABELS,
  PROJECT_TYPE_LABELS,
} from '@/lib/constants/ui';
import { EstimatedTimeline, ProjectType } from '@/types/api';

export const formatDate = (date: number) =>
  dayjs(date).format('MMMM D, YYYY h:mm A');

export const formatEstimatedTimeline = (timeline: EstimatedTimeline) => {
  return ESTIMATED_TIMELINE_LABELS[timeline] || timeline;
};

export const formatProjectType = (projectType: ProjectType) => {
  return PROJECT_TYPE_LABELS[projectType] || projectType;
};
