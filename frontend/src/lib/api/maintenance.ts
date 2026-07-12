import { api } from './client';

export const maintenanceApi = {
  list: async (filters?: any) => {
    const response = await api.get('/maintenance', { params: filters });
    return response.data?.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/maintenance/${id}`);
    return response.data?.data;
  },
  create: async (data: { assetId: string; description: string; priority: string; photoUrl?: string }) => {
    const response = await api.post('/maintenance', data);
    return response.data?.data;
  },
  approve: async (id: string) => {
    const response = await api.post(`/maintenance/${id}/approve`);
    return response.data?.data;
  },
  assign: async (id: string, technicianId: string) => {
    const response = await api.post(`/maintenance/${id}/assign`, { technicianId });
    return response.data?.data;
  },
  resolve: async (id: string, data: { resolutionNotes: string; cost?: number }) => {
    const response = await api.post(`/maintenance/${id}/resolve`, data);
    return response.data?.data;
  },
};
