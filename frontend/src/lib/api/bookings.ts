import { api } from './client';

export const bookingsApi = {
  list: async (filters?: any) => {
    const response = await api.get('/bookings', { params: filters });
    return response.data?.data;
  },
  create: async (data: { 
    assetId: string; 
    startTime: string; 
    endTime: string;
    title?: string;
    purpose?: string;
    attendees?: number;
  }) => {
    const response = await api.post('/bookings', data);
    return response.data?.data;
  },
  cancel: async (id: string) => {
    const response = await api.post(`/bookings/${id}/cancel`);
    return response.data?.data;
  },
};

