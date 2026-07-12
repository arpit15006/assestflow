import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { departmentService } from '../services/departmentService';
import { success } from '../types/api.types';

export const departmentController = {
  list: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const depts = await departmentService.list();
      res.json(success(depts));
    } catch (err) { next(err); }
  },

  getById: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const dept = await departmentService.getById(req.params.id as string);
      res.json(success(dept));
    } catch (err) { next(err); }
  },

  create: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const dept = await departmentService.create(req.body);
      res.status(201).json(success(dept, 'Department created successfully'));
    } catch (err) { next(err); }
  },

  update: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const dept = await departmentService.update(req.params.id as string, req.body);
      res.json(success(dept, 'Department updated'));
    } catch (err) { next(err); }
  },

  delete: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await departmentService.delete(req.params.id as string);
      res.json(success(null, 'Department deleted'));
    } catch (err) { next(err); }
  },
};
