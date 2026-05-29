import api from './fetchClient';

export const aiApi = {
  getInsights: () => api.get('/ai/insights'),
  scanReceipt: (image, mimeType) =>
    api.post('/ai/scan-receipt', { image, mimeType }),
};
