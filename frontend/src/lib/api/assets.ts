import { api } from './client';

export interface Asset {
  id: string;
  name: string;
  assetTag: string;
  serialNumber: string;
  categoryId: string;
  category: { id: string; name: string };
  acquisitionDate: string;
  acquisitionCost: number;
  condition: 'NEW' | 'GOOD' | 'FAIR' | 'POOR' | 'DAMAGED';
  status: 'AVAILABLE' | 'ALLOCATED' | 'RESERVED' | 'UNDER_MAINTENANCE' | 'LOST' | 'RETIRED' | 'DISPOSED';
  location: string;
  departmentId?: string;
  department?: { id: string; name: string };
  isShared: boolean;
  images: { id: string; url: string }[];
  documents: { id: string; name: string; url: string }[];
  allocations?: any[];
  maintenance?: any[];
}

export const assetsApi = {
  list: async (filters?: any) => {
    const response = await api.get('/assets', { params: filters });
    return response.data?.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/assets/${id}`);
    return response.data?.data;
  },
  create: async (data: any) => {
    const response = await api.post('/assets', data);
    return response.data?.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/assets/${id}`, data);
    return response.data?.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/assets/${id}`);
    return response.data?.data;
  },
  stats: async () => {
    const response = await api.get('/assets/stats');
    return response.data?.data;
  },
};
