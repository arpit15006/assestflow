import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { assetService } from '../services/assetService';
import { success } from '../types/api.types';

export const assetController = {
  list: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await assetService.list(req.query);
      res.json(success(result));
    } catch (err) { next(err); }
  },

  getById: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const asset = await assetService.getById(req.params.id as string);
      res.json(success(asset));
    } catch (err) { next(err); }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const asset = await assetService.create(req.body, req.user!.userId);
      res.status(201).json(success(asset, 'Asset registered successfully'));
    } catch (err) { next(err); }
  },

  update: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const asset = await assetService.update(req.params.id as string, req.body);
      res.json(success(asset, 'Asset updated'));
    } catch (err) { next(err); }
  },

  delete: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await assetService.delete(req.params.id as string);
      res.json(success(null, 'Asset deleted'));
    } catch (err) { next(err); }
  },

  stats: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const stats = await assetService.getStats();
      res.json(success(stats));
    } catch (err) { next(err); }
  },
};
