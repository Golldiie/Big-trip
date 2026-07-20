import { filter } from '../utils/filters.js';

export function generateFilters(points){
  return Object.entries(filter).map(([filterType, filterPoints]) => ({
    type: filterType,
    count: filterPoints(points).length
  }));
}
