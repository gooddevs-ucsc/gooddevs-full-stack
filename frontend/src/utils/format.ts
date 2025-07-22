import { default as dayjs } from 'dayjs';

export const formatDate = (date: number) =>
  dayjs(date).format('MMMM D, YYYY h:mm A');

export const formatEstimatedTimeline = (timeline: string) => {
  const timelineMap = {
    LESS_THAN_1_MONTH: 'Less than 1 month',
    ONE_TO_THREE_MONTHS: '1-3 months',
    THREE_TO_SIX_MONTHS: '3-6 months',
    MORE_THAN_SIX_MONTHS: 'More than 6 months',
  };
  return timelineMap[timeline as keyof typeof timelineMap] || timeline;
};

export const formatDateOnly = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
