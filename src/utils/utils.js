import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

export const capitalize = (str) => {
  if (!str) {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const createIdGenerator = (startFrom = 1) => {
  let currentId = startFrom;
  return () => currentId++;
};

export function humanizeDate(date) {
  return dayjs(date).format('MMM D');
}

export function getClassDate(date) {
  return dayjs(date).format('YYYY-MM-DD');
}

export function getEventDuration(dateFrom, dateTo) {
  const start = dayjs(dateFrom);
  const end = dayjs(dateTo);

  const diff = dayjs.duration(Math.abs(end.diff(start)));

  const totalMinutes = diff.asMinutes();

  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = Math.floor(totalMinutes % 60);

  const pad = (value) => String(value).padStart(2, '0');

  if (days > 0) {
    return `${pad(days)}D ${pad(hours)}H ${pad(minutes)}M`;
  }

  if (hours > 0) {
    return `${pad(hours)}H ${pad(minutes)}M`;
  }

  return `${pad(minutes)}M`;
}

export function humanizeTime(date) {
  return dayjs(date).format('HH:mm');
}

export function getFullIsoDate(date) {
  return dayjs(date).toISOString();
}

export function humanizeFormDate(date) {
  return dayjs(date).format('DD/MM/YY HH:mm');
}

export const isFuture = (point) => dayjs(point.dateFrom).isAfter(dayjs());

export const isPast = (point) => dayjs(point.dateFrom).isBefore(dayjs());

export function isPresent(point){
  const now = dayjs();

  return !dayjs(point.dateFrom).isAfter(now) && !dayjs(point.dateTo).isBefore(now);
}

export function sortByDate(pointA, pointB) {
  return new Date(pointA.dateFrom) - new Date(pointB.dateFrom);
}

export function sortByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

export function sortByTime(pointA, pointB) {
  const durationA = new Date(pointA.dateTo) - new Date(pointA.dateFrom);
  const durationB = new Date(pointB.dateTo) - new Date(pointB.dateFrom);

  return durationB - durationA;
}

