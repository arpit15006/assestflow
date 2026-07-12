import { prisma } from '../config/database';
import { Role } from '@prisma/client';

export const userRepository = {
  findByEmail: (email: string) =>
    prisma.user.findUnique({ where: { email }, include: { department: true } }),

  findById: (id: string) =>
    prisma.user.findUnique({ where: { id }, include: { department: true } }),

  findAll: (params?: { departmentId?: string; role?: Role; page?: number; limit?: number }) => {
    const { departmentId, role, page = 1, limit = 20 } = params || {};
    return prisma.user.findMany({
      where: {
        ...(departmentId && { departmentId }),
        ...(role && { role }),
      },
      include: { department: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
    });
  },

  count: (params?: { departmentId?: string; role?: Role }) => {
    const { departmentId, role } = params || {};
    return prisma.user.count({
      where: {
        ...(departmentId && { departmentId }),
        ...(role && { role }),
      },
    });
  },

  create: (data: { name: string; email: string; passwordHash: string; role?: Role; departmentId?: string }) =>
    prisma.user.create({ data, include: { department: true } }),

  updateRole: (id: string, role: Role) =>
    prisma.user.update({ where: { id }, data: { role } }),

  update: (id: string, data: Partial<{ name: string; departmentId: string; status: string }>) =>
    prisma.user.update({ where: { id }, data }),
};
