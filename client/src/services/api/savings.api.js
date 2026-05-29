import api from './fetchClient';

export const savingsApi = {
  getAll: () => api.get('/savings'),
  create: (data) => api.post('/savings', data),
  update: (id, data) => api.put(`/savings/${id}`, data),
  delete: (id) => api.delete(`/savings/${id}`),
  contribute: (id, data) => api.post(`/savings/${id}/contribute`, data),
};
