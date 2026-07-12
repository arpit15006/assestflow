import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { bookingService } from '../services/bookingService';
import { success } from '../types/api.types';

export const bookingController = {
  list: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await bookingService.list(req.query);
      res.json(success(result));
    } catch (err) { next(err); }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const booking = await bookingService.create(req.body, req.user!.userId);
      res.status(201).json(success(booking, 'Booking created successfully'));
    } catch (err) { next(err); }
  },

  cancel: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const result = await bookingService.cancel(req.params.id as string, req.user!.userId);
      res.json(success(result, 'Booking cancelled'));
    } catch (err) { next(err); }
  },
};
