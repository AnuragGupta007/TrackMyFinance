import api from './fetchClient';

export const expenseApi = {
  getAll: (params) => api.get('/expenses', params),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
  getSummary: (params) => api.get('/expenses/summary', params),
};
