import { prisma } from '../config/database';

export const dashboardService = {
  admin: async () => {
    const [assetStats, allocationStats, maintenanceStats, bookingStats, recentActivity] = await Promise.all([
      prisma.asset.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.assetAllocation.count({ where: { status: 'ACTIVE' } }),
      prisma.maintenanceRequest.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.booking.count({ where: { status: { in: ['UPCOMING', 'ONGOING'] } } }),
      prisma.activityLog.findMany({ take: 10, orderBy: { createdAt: 'desc' }, include: { user: { select: { name: true, role: true } } } }),
    ]);
    const totalAssets = assetStats.reduce((s, a) => s + a._count._all, 0);
    const statusMap: Record<string, number> = {};
    assetStats.forEach(s => { statusMap[s.status] = s._count._all; });
    const maintenanceMap: Record<string, number> = {};
    maintenanceStats.forEach(s => { maintenanceMap[s.status] = s._count._all; });
    return { totalAssets, allocated: allocationStats, activeBookings: bookingStats, assetsByStatus: statusMap, maintenanceByStatus: maintenanceMap, recentActivity };
  },

  assetManager: async () => {
    const [assetStats, overdueAllocations, pendingMaintenance, activeBookings] = await Promise.all([
      prisma.asset.groupBy({ by: ['status'], _count: { _all: true } }),
      prisma.assetAllocation.count({ where: { status: 'ACTIVE', expectedReturnDate: { lt: new Date() } } }),
      prisma.maintenanceRequest.count({ where: { status: { in: ['PENDING', 'APPROVED'] } } }),
      prisma.booking.count({ where: { status: { in: ['UPCOMING', 'ONGOING'] } } }),
    ]);
    const statusMap: Record<string, number> = {};
    assetStats.forEach(s => { statusMap[s.status] = s._count._all; });
    return { assetsByStatus: statusMap, overdueAllocations, pendingMaintenance, activeBookings };
  },

  departmentHead: async (departmentId: string) => {
    const [deptAssets, deptAllocations, pendingMaintenance, activeBookings] = await Promise.all([
      prisma.asset.count({ where: { departmentId } }),
      prisma.assetAllocation.count({ where: { departmentId, status: 'ACTIVE' } }),
      prisma.maintenanceRequest.count({ where: { status: 'PENDING', asset: { departmentId } } }),
      prisma.booking.count({ where: { status: { in: ['UPCOMING', 'ONGOING'] }, user: { departmentId } } }),
    ]);
    return { deptAssets, deptAllocations, pendingMaintenance, activeBookings };
  },

  employee: async (userId: string) => {
    const [myAllocations, myBookings, myMaintenance] = await Promise.all([
      prisma.assetAllocation.findMany({ where: { userId, status: 'ACTIVE' }, include: { asset: true }, take: 5 }),
      prisma.booking.findMany({ where: { userId, status: { in: ['UPCOMING', 'ONGOING'] } }, include: { asset: true }, take: 5 }),
      prisma.maintenanceRequest.findMany({ where: { reporterId: userId }, include: { asset: true }, take: 5, orderBy: { createdAt: 'desc' } }),
    ]);
    return { myAllocations, myBookings, myMaintenance };
  },

  auditor: async () => {
    const [totalAudits, activeAudits, pendingItems] = await Promise.all([
      prisma.auditCycle.count(),
      prisma.auditCycle.count({ where: { status: 'ACTIVE' } }),
      prisma.auditItem.count({ where: { verification: 'MISSING' } }),
    ]);
    return { totalAudits, activeAudits, pendingItems };
  },

  technician: async (userId: string) => {
    const [assigned, inProgress, resolved] = await Promise.all([
      prisma.maintenanceRequest.count({ where: { assignedTechnicianId: userId, status: 'TECHNICIAN_ASSIGNED' } }),
      prisma.maintenanceRequest.count({ where: { assignedTechnicianId: userId, status: 'IN_PROGRESS' } }),
      prisma.maintenanceRequest.count({ where: { assignedTechnicianId: userId, status: 'RESOLVED' } }),
    ]);
    const myTasks = await prisma.maintenanceRequest.findMany({
      where: { assignedTechnicianId: userId, status: { in: ['TECHNICIAN_ASSIGNED', 'IN_PROGRESS'] } },
      include: { asset: { select: { name: true, assetTag: true } } },
      take: 10,
    });
    return { assigned, inProgress, resolved, myTasks };
  },
};
