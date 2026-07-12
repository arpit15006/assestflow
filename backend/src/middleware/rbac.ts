import { Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
import { AuthRequest } from './auth';
import { failure } from '../types/api.types';
import { logger } from '../lib/logger';

// Permission groups
export const PERMISSIONS = {
  asset: {
    read: 'asset:read',
    create: 'asset:create',
    update: 'asset:update',
    delete: 'asset:delete',
    allocate: 'asset:allocate',
    transfer: 'asset:transfer',
    approve: 'asset:approve',
  },
  booking: {
    create: 'booking:create',
    approve: 'booking:approve',
    cancel: 'booking:cancel',
  },
  maintenance: {
    create: 'maintenance:create',
    approve: 'maintenance:approve',
    assign: 'maintenance:assign',
    resolve: 'maintenance:resolve',
  },
  audit: {
    create: 'audit:create',
    conduct: 'audit:conduct',
    close: 'audit:close',
  },
  org: {
    manage: 'org:manage',
    manageRoles: 'org:manageRoles',
  },
  report: {
    view: 'report:view',
    export: 'report:export',
  },
  notification: {
    view: 'notification:view',
  },
  upload: {
    image: 'upload:image',
    document: 'upload:document',
  },
} as const;

type Permission = string;

// Role → Permissions map (backend source of truth)
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  ADMIN: Object.values(PERMISSIONS).flatMap((group) => Object.values(group)),
  ASSET_MANAGER: [
    PERMISSIONS.asset.read, PERMISSIONS.asset.create, PERMISSIONS.asset.update,
    PERMISSIONS.asset.allocate, PERMISSIONS.asset.transfer, PERMISSIONS.asset.approve,
    PERMISSIONS.booking.create, PERMISSIONS.booking.approve, PERMISSIONS.booking.cancel,
    PERMISSIONS.maintenance.create, PERMISSIONS.maintenance.approve, PERMISSIONS.maintenance.assign, PERMISSIONS.maintenance.resolve,
    PERMISSIONS.report.view, PERMISSIONS.report.export,
    PERMISSIONS.notification.view,
    PERMISSIONS.upload.image, PERMISSIONS.upload.document,
  ],
  DEPARTMENT_HEAD: [
    PERMISSIONS.asset.read,
    PERMISSIONS.booking.create, PERMISSIONS.booking.cancel,
    PERMISSIONS.maintenance.create, PERMISSIONS.maintenance.approve,
    PERMISSIONS.report.view,
    PERMISSIONS.notification.view,
  ],
  EMPLOYEE: [
    PERMISSIONS.asset.read,
    PERMISSIONS.booking.create, PERMISSIONS.booking.cancel,
    PERMISSIONS.maintenance.create,
    PERMISSIONS.notification.view,
  ],
  AUDITOR: [
    PERMISSIONS.asset.read,
    PERMISSIONS.audit.create, PERMISSIONS.audit.conduct, PERMISSIONS.audit.close,
    PERMISSIONS.report.view, PERMISSIONS.report.export,
    PERMISSIONS.notification.view,
  ],
  TECHNICIAN: [
    PERMISSIONS.asset.read, PERMISSIONS.asset.update,
    PERMISSIONS.maintenance.resolve,
    PERMISSIONS.notification.view,
  ],
};

export const hasPermission = (role: Role, permission: Permission): boolean => {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
};

export const requirePermission = (...permissions: Permission[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json(failure('Authentication required'));
      return;
    }

    const userRole = req.user.role as Role;
    const allowed = permissions.every((p) => hasPermission(userRole, p));

    if (!allowed) {
      logger.warn({
        userId: req.user.userId,
        role: userRole,
        requiredPermissions: permissions,
        path: req.path,
      }, 'UNAUTHORIZED_ACCESS attempt');
      res.status(403).json(failure('Insufficient permissions to perform this action'));
      return;
    }

    next();
  };
};

export const requireRole = (...roles: Role[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json(failure('Authentication required'));
      return;
    }

    if (!roles.includes(req.user.role as Role)) {
      res.status(403).json(failure('Access denied for your role'));
      return;
    }

    next();
  };
};

export { ROLE_PERMISSIONS };
