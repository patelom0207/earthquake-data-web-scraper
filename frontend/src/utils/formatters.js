import { formatDistanceToNow, format } from 'date-fns';

export const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return format(date, 'PPpp');
};

export const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'N/A';
  const date = new Date(timestamp);
  return formatDistanceToNow(date, { addSuffix: true });
};

export const formatMagnitude = (magnitude) => {
  if (magnitude === null || magnitude === undefined) return 'N/A';
  return magnitude.toFixed(1);
};

export const formatDepth = (depth) => {
  if (depth === null || depth === undefined) return 'N/A';
  return `${depth.toFixed(2)} km`;
};

export const formatCoordinates = (lat, lon) => {
  if (lat === null || lon === null) return 'N/A';
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`;
};

export const getMagnitudeColor = (magnitude) => {
  if (magnitude >= 7) return '#DC2626'; // red-600
  if (magnitude >= 6) return '#EA580C'; // orange-600
  if (magnitude >= 5) return '#F59E0B'; // amber-500
  if (magnitude >= 4) return '#EAB308'; // yellow-500
  if (magnitude >= 3) return '#84CC16'; // lime-500
  return '#22C55E'; // green-500
};

export const getMagnitudeLabel = (magnitude) => {
  if (magnitude >= 8) return 'Great';
  if (magnitude >= 7) return 'Major';
  if (magnitude >= 6) return 'Strong';
  if (magnitude >= 5) return 'Moderate';
  if (magnitude >= 4) return 'Light';
  if (magnitude >= 3) return 'Minor';
  return 'Micro';
};

export const getAlertColor = (alert) => {
  const colors = {
    red: '#DC2626',
    orange: '#EA580C',
    yellow: '#EAB308',
    green: '#22C55E',
  };
  return colors[alert] || '#6B7280';
};
