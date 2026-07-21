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
export const DEFAULT_FILTER = 'everything';

export const POINT_COUNT = 4;

export const SORT_TYPES = ['day', 'event', 'time', 'price', 'offers'];
export const DEFAULT_SORT = 'day';

export const MessageBoard = {
  EMPTY_LIST: 'Click New Event to create your first point',
  FUTURE: 'There are no future events now',
  PRESENT: 'There are no present events now',
  PAST: 'There are no past events now'
};
