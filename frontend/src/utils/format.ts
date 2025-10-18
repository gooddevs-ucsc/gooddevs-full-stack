import { default as dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

import {
  ESTIMATED_TIMELINE_LABELS,
  PROJECT_TYPE_LABELS,
} from '@/lib/constants/ui';
import { EstimatedTimeline, ProjectType } from '@/types/api';

export const formatDate = (date: number | string) =>
  // Treat incoming timestamps from the backend as UTC and convert to local time
  dayjs.utc(date).local().format('MMMM D, YYYY h:mm A');

export const formatEstimatedTimeline = (timeline: EstimatedTimeline) => {
  return ESTIMATED_TIMELINE_LABELS[timeline] || timeline;
};

export const formatProjectType = (projectType: ProjectType) => {
  return PROJECT_TYPE_LABELS[projectType] || projectType;
};

export const formatDateOnly = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
