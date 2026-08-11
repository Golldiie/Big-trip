import { FilterType } from '../const.js';
import dayjs from 'dayjs';

const isFuture = (point) =>
  dayjs(point.dateFrom).isAfter(dayjs());

const isPast = (point) =>
  dayjs(point.dateTo).isBefore(dayjs());

const isPresent = (point) => {
  const now = dayjs();

  return !dayjs(point.dateFrom).isAfter(now)
    && !dayjs(point.dateTo).isBefore(now);
};

export const filter = {
  [FilterType.EVERYTHING]: (points) => points,
  [FilterType.FUTURE]: (points) => points.filter(isFuture),
  [FilterType.PRESENT]: (points) => points.filter(isPresent),
  [FilterType.PAST]: (points) => points.filter(isPast)
};
