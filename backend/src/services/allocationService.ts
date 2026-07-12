import { allocationRepository } from '../repositories/allocation.repository';
import { assetRepository } from '../repositories/asset.repository';
import { notificationRepository } from '../repositories/notification.repository';
import { CreateAllocationInput } from '../validators/allocation.validator';
import { prisma } from '../config/database';

export const allocationService = {
  list: (params: any) => allocationRepository.findAll(params),

  allocate: async (data: CreateAllocationInput, allocatedById: string) => {
    const asset = await assetRepository.findById(data.assetId);
    if (!asset) throw Object.assign(new Error('Asset not found'), { status: 404 });
    if (asset.status !== 'AVAILABLE') throw Object.assign(new Error(`Asset is currently ${asset.status.toLowerCase()} and cannot be allocated`), { status: 409 });

    const active = await allocationRepository.findActiveByAsset(data.assetId);
    if (active) throw Object.assign(new Error('Asset already has an active allocation'), { status: 409 });

    const allocation = await allocationRepository.create({
      ...data,
      allocatedById,
      status: 'ACTIVE',
    });

    await assetRepository.updateStatus(data.assetId, 'ALLOCATED');

    if (data.userId) {
      await notificationRepository.create({
        userId: data.userId,
        title: 'New Asset Allocated',
        message: `Asset ${asset.name} (${asset.assetTag}) has been allocated to you.`,
        type: 'ALLOCATION',
      });
    }

    return allocation;
  },

  returnAsset: async (allocationId: string, returnData: { returnCondition: any; notes?: string }) => {
    const alloc = await prisma.assetAllocation.findUnique({ where: { id: allocationId }, include: { asset: true } });
    if (!alloc || alloc.status !== 'ACTIVE') throw Object.assign(new Error('No active allocation found'), { status: 404 });

    await allocationRepository.return(allocationId, { ...returnData, returnedAt: new Date() });
    await assetRepository.updateStatus(alloc.assetId, 'AVAILABLE');

    return { message: 'Asset returned successfully' };
  },

  getOverdueCount: () => allocationRepository.countOverdue(),
};
