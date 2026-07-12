import { prisma } from '../config/database';
import { AssetState, AssetCondition } from '@prisma/client';

export const assetRepository = {
  findAll: async (params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: AssetState;
    categoryId?: string;
    departmentId?: string;
  }) => {
    const { page = 1, limit = 20, search, status, categoryId, departmentId } = params;
    const where: any = {
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { assetTag: { contains: search, mode: 'insensitive' } },
          { serialNumber: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(status && { status }),
      ...(categoryId && { categoryId }),
      ...(departmentId && { departmentId }),
    };

    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        where,
        include: {
          category: true,
          department: true,
          images: { take: 1 },
          allocations: {
            where: { status: 'ACTIVE' },
            include: { user: { select: { id: true, name: true, email: true } } },
            take: 1,
          },
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.asset.count({ where }),
    ]);

    return { assets, total, page, limit, totalPages: Math.ceil(total / limit) };
  },

  findById: (id: string) =>
    prisma.asset.findUnique({
      where: { id },
      include: {
        category: true,
        department: true,
        images: true,
        documents: true,
        allocations: {
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { allocatedAt: 'desc' },
        },
        maintenance: { orderBy: { createdAt: 'desc' }, take: 5 },
        qrCode: true,
        barcode: true,
      },
    }),

  findByTag: (assetTag: string) => prisma.asset.findUnique({ where: { assetTag } }),
  findBySerial: (serialNumber: string) => prisma.asset.findUnique({ where: { serialNumber } }),

  create: (data: any) =>
    prisma.asset.create({
      data,
      include: { category: true, department: true },
    }),

  update: (id: string, data: any) =>
    prisma.asset.update({
      where: { id },
      data,
      include: { category: true, department: true },
    }),

  updateStatus: (id: string, status: AssetState) =>
    prisma.asset.update({ where: { id }, data: { status } }),

  delete: (id: string) => prisma.asset.delete({ where: { id } }),

  countByStatus: () =>
    prisma.asset.groupBy({ by: ['status'], _count: { _all: true } }),

  generateNextTag: async () => {
    const latest = await prisma.asset.findFirst({
      orderBy: { assetTag: 'desc' },
      select: { assetTag: true },
    });
    const lastNum = latest ? parseInt(latest.assetTag.replace('AF-', ''), 10) : 0;
    return `AF-${String(lastNum + 1).padStart(4, '0')}`;
  },
};
