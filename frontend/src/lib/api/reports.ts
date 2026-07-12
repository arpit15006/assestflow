import { api } from './client';

export const reportsApi = {
  get: async (type: string) => {
    const response = await api.get(`/reports/${type}`);
    return response.data?.data;
  },
  export: async (filters: any) => {
    const response = await api.post('/reports/export', filters);
    return response.data?.data;
  },
};
