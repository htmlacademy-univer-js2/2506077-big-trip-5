const formatDate = (date) => {
  const formattedDate = date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
  const [day, month] = formattedDate.split(' ');
  return `${month.toUpperCase()} ${day}`;
};

const formatTime = (date) => date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

const formatDatetime = (date, withTime = false) => {
  const datePart = date.toLocaleDateString('en-CA');
  if (!withTime) {
    return datePart;
  }
  const timePart = date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  return `${datePart}T${timePart}`;
};

const calculateDuration = (dateFrom, dateTo) => {
  const duration = (dateTo - dateFrom) / 60000;

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
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = String(date.getFullYear()).slice(2);

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export { formatDate, formatTime, formatDatetime, calculateDuration, formatDateToCustomFormat };
