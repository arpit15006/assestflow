import { api } from './client';

export const departmentsApi = {
  list: async () => {
    const response = await api.get('/departments');
    return response.data?.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/departments/${id}`);
    return response.data?.data;
  },
  create: async (data: { name: string; managerId?: string; parentDepartmentId?: string }) => {
    const response = await api.post('/departments', data);
    return response.data?.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/departments/${id}`, data);
    return response.data?.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/departments/${id}`);
    return response.data?.data;
  },
};
