import { prisma } from '../config/database';

export const bookingRepository = {
  findConflict: (assetId: string, startTime: Date, endTime: Date, excludeId?: string) =>
    prisma.booking.findFirst({
      where: {
        assetId,
        id: excludeId ? { not: excludeId } : undefined,
        status: { in: ['UPCOMING', 'ONGOING'] },
        OR: [
          { startTime: { lt: endTime }, endTime: { gt: startTime } },
        ],
      },
    }),

  findAll: (params: { page?: number; limit?: number; userId?: string; assetId?: string }) => {
    const { page = 1, limit = 100, userId, assetId } = params;
    return prisma.booking.findMany({
      where: {
        ...(userId && { userId }),
        ...(assetId && { assetId }),
      },
      include: {
        asset: { include: { category: true } },
        user: { 
          select: { 
            id: true, name: true, email: true,
            department: { select: { id: true, name: true } }
          } 
        },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { startTime: 'asc' },
    });
  },

  create: (data: any) =>
    prisma.booking.create({
      data,
      include: { asset: true, user: true },
    }),

  cancel: (id: string) =>
    prisma.booking.update({ where: { id }, data: { status: 'CANCELLED' } }),

  countActive: () =>
    prisma.booking.count({ where: { status: { in: ['UPCOMING', 'ONGOING'] } } }),
};
