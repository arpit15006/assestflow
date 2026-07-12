import { api } from './client';

export const auditApi = {
  list: async () => {
    const response = await api.get('/audit');
    return response.data?.data;
  },
  create: async (data: { name: string; startDate: string; endDate: string; auditorId: string; assetIds: string[] }) => {
    const response = await api.post('/audit', data);
    return response.data?.data;
  },
  close: async (id: string) => {
    const response = await api.post(`/audit/${id}/close`);
    return response.data?.data;
  },
};
