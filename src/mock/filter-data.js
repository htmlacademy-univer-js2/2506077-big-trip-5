import { isFuturePoint, isPresentPoint, isPastPoint } from '../utils.js';
import { FilterType } from '../const.js';

const filter = {
  [FilterType.EVERYTHING]: (points) => [...points],
  [FilterType.FUTURE]: (points) => points.filter((point) => isFuturePoint(point)),
  [FilterType.PRESENT]: (points) => points.filter((point) => isPresentPoint(point)),
  [FilterType.PAST]: (points) => points.filter((point) => isPastPoint(point))
};

const generateFilters = (points) => Object.entries(filter).map(([filterType, filterFunction]) => ({
  type: filterType,
  count: filterFunction(points).length
}));

export { generateFilters };
