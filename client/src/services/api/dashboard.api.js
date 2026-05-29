import api from './fetchClient';

export const dashboardApi = {
  getOverview: () => api.get('/dashboard/overview'),
  getTrends: () => api.get('/dashboard/trends'),
};
