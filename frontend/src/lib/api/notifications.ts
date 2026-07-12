import { api } from './client';

export const notificationsApi = {
  list: async (page = 1, limit = 20) => {
    const response = await api.get('/notifications', { params: { page, limit } });
    return response.data?.data;
  },
  unreadCount: async () => {
    const response = await api.get('/notifications/unread-count');
    return response.data?.data?.count || 0;
  },
  read: async (id: string) => {
    const response = await api.post(`/notifications/${id}/read`);
    return response.data?.data;
  },
  readAll: async () => {
    const response = await api.post('/notifications/read-all');
    return response.data?.data;
  },
};
