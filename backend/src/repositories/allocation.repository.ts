import { prisma } from '../config/database';

export const allocationRepository = {
  findActiveByAsset: (assetId: string) =>
    prisma.assetAllocation.findFirst({
      where: { assetId, status: 'ACTIVE' },
      include: { user: true, department: true },
    }),

  findAll: (params: { page?: number; limit?: number; userId?: string; departmentId?: string }) => {
    const { page = 1, limit = 20, userId, departmentId } = params;
    return prisma.assetAllocation.findMany({
      where: {
        ...(userId && { userId }),
        ...(departmentId && { departmentId }),
      },
      include: {
        asset: { include: { category: true } },
        user: { select: { id: true, name: true, email: true } },
        department: true,
        allocatedBy: { select: { id: true, name: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { allocatedAt: 'desc' },
    });
  },

  create: (data: any) =>
    prisma.assetAllocation.create({
      data,
      include: { asset: true, user: true },
    }),

  return: (id: string, data: { returnedAt: Date; returnCondition: any; notes?: string }) =>
    prisma.assetAllocation.update({
      where: { id },
      data: { ...data, status: 'RETURNED' },
    }),

  countOverdue: () =>
    prisma.assetAllocation.count({
      where: {
        status: 'ACTIVE',
        expectedReturnDate: { lt: new Date() },
      },
    }),
};
