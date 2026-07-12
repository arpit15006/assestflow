import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { maintenanceService } from '../services/maintenanceService';
import { success } from '../types/api.types';

export const maintenanceController = {
  list: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await maintenanceService.list(req.query);
      res.json(success(result));
    } catch (err) { next(err); }
  },

  getById: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const item = await maintenanceService.getById(req.params.id as string);
      res.json(success(item));
    } catch (err) { next(err); }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const item = await maintenanceService.create(req.body, req.user!.userId);
      res.status(201).json(success(item, 'Maintenance request raised'));
    } catch (err) { next(err); }
  },

  approve: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const item = await maintenanceService.approve(req.params.id as string, req.user!.userId);
      res.json(success(item, 'Request approved'));
    } catch (err) { next(err); }
  },

  assign: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const item = await maintenanceService.assignTechnician(req.params.id as string, req.body.technicianId);
      res.json(success(item, 'Technician assigned'));
    } catch (err) { next(err); }
  },

  resolve: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const item = await maintenanceService.resolve(req.params.id as string, req.body);
      res.json(success(item, 'Maintenance resolved'));
    } catch (err) { next(err); }
  },
};
