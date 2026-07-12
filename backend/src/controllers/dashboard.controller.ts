import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { dashboardService } from '../services/dashboardService';
import { success } from '../types/api.types';
import { prisma } from '../config/database';

export const dashboardController = {
  admin: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await dashboardService.admin();
      res.json(success(data));
    } catch (err) { next(err); }
  },

  assetManager: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await dashboardService.assetManager();
      res.json(success(data));
    } catch (err) { next(err); }
  },

  departmentHead: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // Find head's department
      const dept = await prisma.department.findFirst({
        where: { managerId: req.user!.userId },
      });
      const data = await dashboardService.departmentHead(dept?.id || '');
      res.json(success(data));
    } catch (err) { next(err); }
  },

  employee: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await dashboardService.employee(req.user!.userId);
      res.json(success(data));
    } catch (err) { next(err); }
  },

  auditor: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await dashboardService.auditor();
      res.json(success(data));
    } catch (err) { next(err); }
  },

  technician: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const data = await dashboardService.technician(req.user!.userId);
      res.json(success(data));
    } catch (err) { next(err); }
  },
};
