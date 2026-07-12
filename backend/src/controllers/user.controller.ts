import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { userRepository } from '../repositories/user.repository';
import { success } from '../types/api.types';
import { Role } from '@prisma/client';

export const userController = {
  list: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const users = await userRepository.findAll({ page, limit });
      res.json(success(users));
    } catch (err) { next(err); }
  },

  promote: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { role } = req.body;
      const updated = await userRepository.updateRole(id as string, role as Role);
      res.json(success(updated, 'User role updated successfully'));
    } catch (err) { next(err); }
  },

  delete: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      await userRepository.update(id as string, { status: 'INACTIVE' });
      res.json(success(null, 'User deactivated'));
    } catch (err) { next(err); }
  },
};
