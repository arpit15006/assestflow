import { departmentRepository } from '../repositories/department.repository';
import { CreateDepartmentInput } from '../validators/department.validator';

export const departmentService = {
  list: () => departmentRepository.findAll(),

  getById: async (id: string) => {
    const dept = await departmentRepository.findById(id);
    if (!dept) throw Object.assign(new Error('Department not found'), { status: 404 });
    return dept;
  },

  create: async (data: CreateDepartmentInput) => {
    // Prevent circular hierarchy
    if (data.parentDepartmentId) {
      const parent = await departmentRepository.findById(data.parentDepartmentId);
      if (!parent) throw Object.assign(new Error('Parent department not found'), { status: 404 });
    }
    return departmentRepository.create(data);
  },

  update: (id: string, data: any) => departmentRepository.update(id, data),
  delete: (id: string) => departmentRepository.delete(id),
};
