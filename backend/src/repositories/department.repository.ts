import { prisma } from '../config/database';

export const departmentRepository = {
  findAll: () =>
    prisma.department.findMany({
      include: {
        manager: { select: { id: true, name: true, email: true } },
        parentDepartment: { select: { id: true, name: true } },
        _count: { select: { users: true, assets: true } },
      },
      orderBy: { name: 'asc' },
    }),

  findById: (id: string) =>
    prisma.department.findUnique({
      where: { id },
      include: {
        manager: { select: { id: true, name: true, email: true } },
        users: { select: { id: true, name: true, email: true, role: true } },
        subDepartments: true,
      },
    }),

  create: (data: { name: string; managerId?: string; parentDepartmentId?: string }) =>
    prisma.department.create({ data }),

  update: (id: string, data: any) =>
    prisma.department.update({ where: { id }, data }),

  delete: (id: string) => prisma.department.delete({ where: { id } }),
};
