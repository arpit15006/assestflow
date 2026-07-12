import { notificationRepository } from '../repositories/notification.repository';
import { socketService } from './socketService';

export const notificationService = {
  getForUser: (userId: string, page?: number, limit?: number) =>
    notificationRepository.findByUser(userId, page, limit),

  getUnreadCount: (userId: string) =>
    notificationRepository.countUnread(userId),

  markRead: (id: string) =>
    notificationRepository.markRead(id),

  markAllRead: (userId: string) =>
    notificationRepository.markAllRead(userId),

  send: async (data: { userId: string; title: string; message: string; type: string }) => {
    const notification = await notificationRepository.create(data);
    // Emit via socket if available
    try {
      socketService.emitToUser(data.userId, 'notification:new', notification);
    } catch {}
    return notification;
  },
};
