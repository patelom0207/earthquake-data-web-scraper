import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const earthquakeAPI = {
  scrapeData: async (timeRange = 'day') => {
    const response = await api.post('/scrape', { time_range: timeRange });
    return response.data;
  },

  getAllEarthquakes: async (limit = null) => {
    const params = limit ? { limit } : {};
    const response = await api.get('/earthquakes', { params });
    return response.data;
  },

  getRecentEarthquakes: async (hours = 24) => {
    const response = await api.get('/earthquakes/recent', { params: { hours } });
    return response.data;
  },

  getEarthquakesByMagnitude: async (minMagnitude, maxMagnitude = null) => {
    const params = { min_magnitude: minMagnitude };
    if (maxMagnitude) params.max_magnitude = maxMagnitude;
    const response = await api.get('/earthquakes/magnitude', { params });
    return response.data;
  },

  getEarthquakesByLocation: async (location) => {
    const response = await api.get('/earthquakes/location', { params: { location } });
    return response.data;
  },

  getStatistics: async () => {
    const response = await api.get('/statistics');
    return response.data;
  },

  clearOldData: async (days = 30) => {
    const response = await api.delete('/earthquakes/old', { params: { days } });
    return response.data;
  },

  healthCheck: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
