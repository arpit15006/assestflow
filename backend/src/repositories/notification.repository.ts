import { prisma } from '../config/database';

export const notificationRepository = {
  findByUser: (userId: string, page = 1, limit = 20) =>
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),

  countUnread: (userId: string) =>
    prisma.notification.count({ where: { userId, isRead: false } }),

  create: (data: { userId: string; title: string; message: string; type: string }) =>
    prisma.notification.create({ data }),

  markRead: (id: string) =>
    prisma.notification.update({ where: { id }, data: { isRead: true } }),

  markAllRead: (userId: string) =>
    prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } }),
};
