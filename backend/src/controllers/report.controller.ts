import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { success } from '../types/api.types';
import { prisma } from '../config/database';

export const reportController = {
  getReport: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { type } = req.params;
      let data = {};
      if (type === 'assets') {
        data = await prisma.asset.findMany({ include: { category: true, department: true }, take: 100 });
      } else if (type === 'maintenance') {
        data = await prisma.maintenanceRequest.findMany({ include: { asset: true, reporter: true }, take: 100 });
      } else {
        data = await prisma.assetAllocation.findMany({ include: { asset: true, user: true }, take: 100 });
      }
      res.json(success(data));
    } catch (err) { next(err); }
  },

  exportReport: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      res.json(success({ url: 'https://example.com/mock-report.csv' }, 'Export completed successfully'));
    } catch (err) { next(err); }
  },
};
