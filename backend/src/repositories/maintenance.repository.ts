import { prisma } from '../config/database';
import { MaintenanceStatus } from '@prisma/client';

export const maintenanceRepository = {
  findAll: (params: { page?: number; limit?: number; status?: MaintenanceStatus; assetId?: string }) => {
    const { page = 1, limit = 20, status, assetId } = params;
    return prisma.maintenanceRequest.findMany({
      where: {
        ...(status && { status }),
        ...(assetId && { assetId }),
      },
      include: {
        asset: { select: { id: true, name: true, assetTag: true } },
        reporter: { select: { id: true, name: true } },
        technician: { select: { id: true, name: true } },
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  },

  findById: (id: string) =>
    prisma.maintenanceRequest.findUnique({
      where: { id },
      include: {
        asset: true,
        reporter: { select: { id: true, name: true, email: true } },
        technician: { select: { id: true, name: true } },
      },
    }),

  create: (data: any) =>
    prisma.maintenanceRequest.create({ data, include: { asset: true, reporter: true } }),

  updateStatus: (id: string, status: MaintenanceStatus, extra?: any) =>
    prisma.maintenanceRequest.update({ where: { id }, data: { status, ...extra } }),

  countByStatus: () =>
    prisma.maintenanceRequest.groupBy({ by: ['status'], _count: { _all: true } }),
};
