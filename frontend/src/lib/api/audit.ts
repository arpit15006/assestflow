import { api } from './client';

export const auditApi = {
  list: async () => {
    const response = await api.get('/audit');
    return response.data?.data;
  },
  getActive: async () => {
    const response = await api.get('/audit/active');
    return response.data?.data;
  },
  create: async (data: { name: string; startDate: string; endDate: string; auditorId: string; assetIds: string[] }) => {
    const response = await api.post('/audit', data);
    return response.data?.data;
  },
  updateItem: async (assetId: string, data: { verification: string; notes?: string }) => {
    const response = await api.patch(`/audit/active/items/${assetId}`, data);
    return response.data?.data;
  },
  close: async (id: string) => {
    const response = await api.post(`/audit/${id}/close`);
    return response.data?.data;
  },
  generateReport: async () => {
    try {
      const response = await api.post('/reports/export');
      return response.data?.data;
    } catch (e) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
  },
};
