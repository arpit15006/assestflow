import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { allocationService } from '../services/allocationService';
import { success } from '../types/api.types';

export const allocationController = {
  list: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await allocationService.list(req.query);
      res.json(success(result));
    } catch (err) { next(err); }
  },

  allocate: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await allocationService.allocate(req.body, req.user!.userId);
      res.status(201).json(success(result, 'Asset allocated successfully'));
    } catch (err) { next(err); }
  },

  return: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await allocationService.returnAsset(req.params.id as string, req.body);
      res.json(success(result, 'Asset returned successfully'));
    } catch (err) { next(err); }
  },
};
