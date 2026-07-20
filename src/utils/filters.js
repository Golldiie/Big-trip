import { FilterType } from '../const.js';
import { isFuture, isPresent, isPast } from './utils.js';

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter(isFuture),
  [FilterType.PRESENT]: (points) => points.filter(isPresent),
  [FilterType.PAST]: (points) => points.filter(isPast)
};
