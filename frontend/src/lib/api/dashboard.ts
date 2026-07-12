import { api } from './client';
import { Role } from '../rbac/roles';

const DASHBOARD_ROUTES: Record<Role, string> = {
  ADMIN: '/dashboard/admin',
  ASSET_MANAGER: '/dashboard/asset-manager',
  DEPARTMENT_HEAD: '/dashboard/department-head',
  EMPLOYEE: '/dashboard/employee',
  AUDITOR: '/dashboard/auditor',
  TECHNICIAN: '/dashboard/technician',
};

export const dashboardApi = {
  get: async (role: Role) => {
    const route = DASHBOARD_ROUTES[role];
    if (!route) throw new Error(`Unknown dashboard role: ${role}`);
    const response = await api.get(route);
    return response.data?.data;
  },
};
