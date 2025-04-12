import dayjs from 'dayjs';
import { SortType } from './const';

const formatDate = (date) => {
  const formattedDate = new Date(date).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
  const [day, month] = formattedDate.split(' ');
  return `${month.toUpperCase()} ${day}`;
};

const formatTime = (date) => new Date(date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

const formatDatetime = (date, withTime = false) => {
  const datePart = new Date(date).toLocaleDateString('en-CA');
  if (!withTime) {
    return datePart;
  }
  const timePart = new Date(date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${datePart}T${timePart}`;
};

const calculateDuration = (dateFrom, dateTo) => {
  const duration = (new Date(dateTo) - new Date(dateFrom)) / 60000;

  if (duration < 60) {
    return `${duration}M`;
  } else if (duration < 1440) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  } else {
    const days = Math.floor(duration / 1440);
    const hours = Math.floor((duration % 1440) / 60);
    const minutes = duration % 60;
    return `${String(days).padStart(2, '0')}D ${String(hours).padStart(2, '0')}H ${String(minutes).padStart(2, '0')}M`;
  }
};

const formatDateToCustomFormat = (date) => {
  const formatedDate = new Date(date);
  const day = String(formatedDate.getDate()).padStart(2, '0');
  const month = String(formatedDate.getMonth() + 1).padStart(2, '0');
  const year = String(formatedDate.getFullYear()).slice(2);

  const hours = String(formatedDate.getHours()).padStart(2, '0');
  const minutes = String(formatedDate.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

const isEscapeKey = ({ key }) => key === 'Escape';

const isFuturePoint = (point) => dayjs().isBefore(point.date_from, 'minute');

const isPresentPoint = (point) => dayjs().isAfter(point.date_from, 'minute') && dayjs().isBefore(point.date_to, 'minute');

const isPastPoint = (point) => dayjs().isAfter(point.date_to, 'minute');

const updatePoint = (points, updatedPoint) => points.map((point) => point.id === updatedPoint.id ? updatedPoint : point);

const sortRoutePoints = (points, sortType) => {
  const sortedPoints = [...points];

  switch (sortType) {
    case SortType.DAY:
      return sortedPoints.sort((a, b) => new Date(a.date_from) - new Date(b.date_from));
    case SortType.TIME:
      return sortedPoints.sort((a, b) => (new Date(b.date_to) - new Date(b.date_from)) - (new Date(a.date_to) - new Date(a.date_from)));
    case SortType.PRICE:
      return sortedPoints.sort((a, b) => b.base_price - a.base_price);
    default:
      return sortedPoints;
  }
};

const generateRandomId = (length = 8) => {
  let id = '';
  for (let i = 0; i < length; i++) {
    id += Math.floor(Math.random() * 10);
  }
  return id;
};

export {
  formatDate,
  formatTime,
  formatDatetime,
  calculateDuration,
  formatDateToCustomFormat,
  isEscapeKey,
  isFuturePoint,
  isPresentPoint,
  isPastPoint,
  updatePoint,
  sortRoutePoints,
  generateRandomId
};
