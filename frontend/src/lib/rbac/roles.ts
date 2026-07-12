export enum Role {
  ADMIN = 'ADMIN',
  ASSET_MANAGER = 'ASSET_MANAGER',
  DEPARTMENT_HEAD = 'DEPARTMENT_HEAD',
  EMPLOYEE = 'EMPLOYEE',
  AUDITOR = 'AUDITOR',
  TECHNICIAN = 'TECHNICIAN',
}

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

export type Permission = string;

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
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
