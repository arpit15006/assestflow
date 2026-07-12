import { api } from './client';

export const allocationsApi = {
  list: async (filters?: any) => {
    const response = await api.get('/allocations', { params: filters });
    return response.data?.data;
  },
  allocate: async (data: { assetId: string; userId?: string; departmentId?: string; expectedReturnDate?: string; notes?: string }) => {
    const response = await api.post('/allocations', data);
    return response.data?.data;
  },
  return: async (id: string, returnData: { returnCondition: string; notes?: string }) => {
    const response = await api.post(`/allocations/${id}/return`, returnData);
    return response.data?.data;
  },
};
