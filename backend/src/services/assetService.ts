import { assetRepository } from '../repositories/asset.repository';
import { notificationRepository } from '../repositories/notification.repository';
import { CreateAssetInput, UpdateAssetInput } from '../validators/asset.validator';

export const assetService = {
  list: async (params: any) => assetRepository.findAll(params),

  getById: async (id: string) => {
    const asset = await assetRepository.findById(id);
    if (!asset) throw Object.assign(new Error('Asset not found'), { status: 404 });
    return asset;
  },

  create: async (data: CreateAssetInput, createdByUserId: string) => {
    // Check duplicate serial number
    const existing = await assetRepository.findBySerial(data.serialNumber);
    if (existing) throw Object.assign(new Error('Serial number already exists'), { status: 409 });

    const assetTag = await assetRepository.generateNextTag();
    const asset = await assetRepository.create({ ...data, assetTag, acquisitionDate: new Date(data.acquisitionDate) });
    return asset;
  },

  update: async (id: string, data: UpdateAssetInput) => {
    const asset = await assetRepository.findById(id);
    if (!asset) throw Object.assign(new Error('Asset not found'), { status: 404 });
    if (asset.status === 'DISPOSED') throw Object.assign(new Error('Disposed assets are read-only'), { status: 403 });
    return assetRepository.update(id, data);
  },

  delete: async (id: string) => {
    const asset = await assetRepository.findById(id);
    if (!asset) throw Object.assign(new Error('Asset not found'), { status: 404 });
    return assetRepository.delete(id);
  },

  getStats: async () => {
    const byStatus = await assetRepository.countByStatus();
    const total = byStatus.reduce((sum, s) => sum + s._count._all, 0);
    const statusMap: Record<string, number> = {};
    byStatus.forEach(s => { statusMap[s.status] = s._count._all; });
    return { total, ...statusMap };
  },
};
