import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { success } from '../types/api.types';
import { prisma } from '../config/database';

export const auditController = {
  list: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const audits = await prisma.auditCycle.findMany({
        include: { auditor: { select: { id: true, name: true } }, items: true },
        orderBy: { startDate: 'desc' },
      });
      res.json(success(audits));
    } catch (err) { next(err); }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { name, startDate, endDate, auditorId, assetIds } = req.body;
      const cycle = await prisma.auditCycle.create({
        data: {
          name,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          auditorId,
          status: 'SCHEDULED',
          items: {
            create: assetIds.map((id: string) => ({ assetId: id })),
          },
        },
        include: { items: true },
      });
      res.status(201).json(success(cycle, 'Audit cycle created'));
    } catch (err) { next(err); }
  },

  close: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const cycle = await prisma.auditCycle.update({
        where: { id: id as string },
        data: { status: 'COMPLETED', closedAt: new Date() },
      });
      res.json(success(cycle, 'Audit cycle closed and locked'));
    } catch (err) { next(err); }
  },
};
