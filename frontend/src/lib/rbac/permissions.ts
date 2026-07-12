import { Role, ROLE_PERMISSIONS } from './roles';

export const hasPermission = (role: Role, permission: string): boolean => {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
};

// Route protection matrix
const ROUTE_ROLES: Record<string, Role[]> = {
  '/': [Role.ADMIN, Role.ASSET_MANAGER, Role.DEPARTMENT_HEAD, Role.EMPLOYEE, Role.AUDITOR, Role.TECHNICIAN],
  '/assets': [Role.ADMIN, Role.ASSET_MANAGER, Role.DEPARTMENT_HEAD, Role.AUDITOR, Role.TECHNICIAN],
  '/allocations': [Role.ADMIN, Role.ASSET_MANAGER, Role.DEPARTMENT_HEAD],
  '/bookings': [Role.ADMIN, Role.ASSET_MANAGER, Role.DEPARTMENT_HEAD, Role.EMPLOYEE, Role.AUDITOR, Role.TECHNICIAN],
  '/maintenance': [Role.ADMIN, Role.ASSET_MANAGER, Role.DEPARTMENT_HEAD, Role.EMPLOYEE, Role.TECHNICIAN],
  '/audit': [Role.ADMIN, Role.AUDITOR],
  '/reports': [Role.ADMIN, Role.ASSET_MANAGER, Role.DEPARTMENT_HEAD, Role.AUDITOR],
  '/org-setup': [Role.ADMIN],
  '/notifications': [Role.ADMIN, Role.ASSET_MANAGER, Role.DEPARTMENT_HEAD, Role.EMPLOYEE, Role.AUDITOR, Role.TECHNICIAN],
};

export const canAccessRoute = (role: Role, route: string): boolean => {
  const allowedRoles = ROUTE_ROLES[route];
  if (!allowedRoles) return true; // Unprotected route
  return allowedRoles.includes(role);
};

export interface NavItemConfig {
  label: string;
  href: string;
  badgeKey?: 'allocations' | 'maintenance' | 'notifications';
}

export interface NavSectionConfig {
  title?: string;
  items: NavItemConfig[];
}

const ALL_SECTIONS: { title?: string; items: (NavItemConfig & { roles: Role[] })[] }[] = [
  {
    items: [
      { label: 'Dashboard', href: '/', roles: [Role.ADMIN, Role.ASSET_MANAGER, Role.DEPARTMENT_HEAD, Role.EMPLOYEE, Role.AUDITOR, Role.TECHNICIAN] },
      { label: 'Assets', href: '/assets', roles: [Role.ADMIN, Role.ASSET_MANAGER, Role.DEPARTMENT_HEAD, Role.AUDITOR, Role.TECHNICIAN] },
      { label: 'Allocation & Transfer', href: '/allocations', badgeKey: 'allocations', roles: [Role.ADMIN, Role.ASSET_MANAGER, Role.DEPARTMENT_HEAD] },
      { label: 'Resource Booking', href: '/bookings', roles: [Role.ADMIN, Role.ASSET_MANAGER, Role.DEPARTMENT_HEAD, Role.EMPLOYEE, Role.AUDITOR, Role.TECHNICIAN] },
    ],
  },
  {
    title: 'Operations',
    items: [
      { label: 'Maintenance', href: '/maintenance', badgeKey: 'maintenance', roles: [Role.ADMIN, Role.ASSET_MANAGER, Role.DEPARTMENT_HEAD, Role.EMPLOYEE, Role.TECHNICIAN] },
      { label: 'Audit Cycles', href: '/audit', roles: [Role.ADMIN, Role.AUDITOR] },
    ],
  },
  {
    title: 'Administration',
    items: [
      { label: 'Organization Setup', href: '/org-setup', roles: [Role.ADMIN] },
    ],
  },
  {
    title: 'System',
    items: [
      { label: 'Reports', href: '/reports', roles: [Role.ADMIN, Role.ASSET_MANAGER, Role.DEPARTMENT_HEAD, Role.AUDITOR] },
      { label: 'Notifications', href: '/notifications', badgeKey: 'notifications', roles: [Role.ADMIN, Role.ASSET_MANAGER, Role.DEPARTMENT_HEAD, Role.EMPLOYEE, Role.AUDITOR, Role.TECHNICIAN] },
    ],
  },
];

export const getNavSections = (role: Role): NavSectionConfig[] => {
  return ALL_SECTIONS.map((section) => ({
    title: section.title,
    items: section.items
      .filter((item) => item.roles.includes(role))
      .map(({ label, href, badgeKey }) => ({ label, href, badgeKey })),
  })).filter((section) => section.items.length > 0);
};
