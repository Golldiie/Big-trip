export const EVENT_TYPES = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant',
];

export const FilterType = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past',
};

export const FILTER_TYPES = Object.values(FilterType);

export const POINT_COUNT = 4;

export const SORT_TYPES = ['day', 'event', 'time', 'price', 'offers'];
export const DEFAULT_SORT = 'day';
