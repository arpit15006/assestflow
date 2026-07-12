import { maintenanceRepository } from '../repositories/maintenance.repository';
import { assetRepository } from '../repositories/asset.repository';
import { notificationRepository } from '../repositories/notification.repository';
import { CreateMaintenanceInput } from '../validators/maintenance.validator';

export const maintenanceService = {
  list: (params: any) => maintenanceRepository.findAll(params),

  getById: async (id: string) => {
    const req = await maintenanceRepository.findById(id);
    if (!req) throw Object.assign(new Error('Maintenance request not found'), { status: 404 });
    return req;
  },

  create: async (data: CreateMaintenanceInput, reporterId: string) => {
    const asset = await assetRepository.findById(data.assetId);
    if (!asset) throw Object.assign(new Error('Asset not found'), { status: 404 });
    if (asset.status === 'RETIRED' || asset.status === 'DISPOSED')
      throw Object.assign(new Error('Cannot raise maintenance for retired/disposed assets'), { status: 400 });

    const request = await maintenanceRepository.create({ ...data, reporterId });
    return request;
  },

  approve: async (id: string, approverId: string) => {
    const req = await maintenanceRepository.findById(id);
    if (!req) throw Object.assign(new Error('Request not found'), { status: 404 });
    if (req.status !== 'PENDING') throw Object.assign(new Error('Only pending requests can be approved'), { status: 400 });

    const updated = await maintenanceRepository.updateStatus(id, 'APPROVED');
    await assetRepository.updateStatus(req.assetId, 'UNDER_MAINTENANCE');

    await notificationRepository.create({
      userId: req.reporterId,
      title: 'Maintenance Request Approved',
      message: `Your maintenance request for ${req.asset.name} has been approved.`,
      type: 'MAINTENANCE',
    });

    return updated;
  },

  assignTechnician: async (id: string, technicianId: string) => {
    const req = await maintenanceRepository.findById(id);
    if (!req) throw Object.assign(new Error('Request not found'), { status: 404 });
    if (req.status !== 'APPROVED') throw Object.assign(new Error('Request must be approved before assigning technician'), { status: 400 });

    const updated = await maintenanceRepository.updateStatus(id, 'TECHNICIAN_ASSIGNED', { assignedTechnicianId: technicianId });

    if (technicianId) {
      await notificationRepository.create({
        userId: technicianId,
        title: 'Maintenance Task Assigned',
        message: `You have been assigned to repair ${req.asset.name} (${req.asset.assetTag}).`,
        type: 'MAINTENANCE',
      });
    }

    return updated;
  },

  resolve: async (id: string, data: { resolutionNotes: string; cost?: number }) => {
    const req = await maintenanceRepository.findById(id);
    if (!req) throw Object.assign(new Error('Request not found'), { status: 404 });
    if (!['TECHNICIAN_ASSIGNED', 'IN_PROGRESS'].includes(req.status))
      throw Object.assign(new Error('Cannot resolve at this stage'), { status: 400 });

    const updated = await maintenanceRepository.updateStatus(id, 'RESOLVED', {
      resolutionNotes: data.resolutionNotes,
      cost: data.cost,
    });
    await assetRepository.updateStatus(req.assetId, 'AVAILABLE');

    if (req.reporterId) {
      await notificationRepository.create({
        userId: req.reporterId,
        title: 'Maintenance Resolved',
        message: `Maintenance for ${req.asset.name} has been resolved.`,
        type: 'MAINTENANCE',
      });
    }

    return updated;
  },

  getStats: () => maintenanceRepository.countByStatus(),
};
