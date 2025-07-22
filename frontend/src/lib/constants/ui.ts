import {
  ProjectType,
  EstimatedTimeline,
  PROJECT_TYPES,
  ESTIMATED_TIMELINES,
} from '@/types/api';

/**
 * Display labels for project types and timelines
 */
export const PROJECT_TYPE_LABELS: Record<ProjectType, string> = {
  [PROJECT_TYPES.WEBSITE]: 'Website Development',
  [PROJECT_TYPES.MOBILE_APP]: 'Mobile App',
  [PROJECT_TYPES.API]: 'API Development',
  [PROJECT_TYPES.DATABASE]: 'Database Design',
  [PROJECT_TYPES.DESKTOP_APP]: 'Desktop Application',
  [PROJECT_TYPES.OTHER]: 'Other',
} as const;

export const ESTIMATED_TIMELINE_LABELS: Record<EstimatedTimeline, string> = {
  [ESTIMATED_TIMELINES.LESS_THAN_1_MONTH]: 'Less than 1 month',
  [ESTIMATED_TIMELINES.ONE_TO_THREE_MONTHS]: '1-3 months',
  [ESTIMATED_TIMELINES.THREE_TO_SIX_MONTHS]: '3-6 months',
  [ESTIMATED_TIMELINES.MORE_THAN_SIX_MONTHS]: 'More than 6 months',
} as const;

/**
 * Styling classes for project types (used in various components)
 */
export const PROJECT_TYPE_STYLES: Record<ProjectType, string> = {
  [PROJECT_TYPES.WEBSITE]: 'bg-blue-50 text-blue-800 border border-blue-200',
  [PROJECT_TYPES.MOBILE_APP]:
    'bg-emerald-50 text-emerald-800 border border-emerald-200',
  [PROJECT_TYPES.API]: 'bg-purple-50 text-purple-800 border border-purple-200',
  [PROJECT_TYPES.DATABASE]:
    'bg-orange-50 text-orange-800 border border-orange-200',
  [PROJECT_TYPES.DESKTOP_APP]:
    'bg-indigo-50 text-indigo-800 border border-indigo-200',
  [PROJECT_TYPES.OTHER]: 'bg-gray-50 text-gray-800 border border-gray-200',
} as const;
