import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { notificationService } from '../services/notificationService';
import { success } from '../types/api.types';

export const notificationController = {
  list: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const notifications = await notificationService.getForUser(req.user!.userId, page, limit);
      res.json(success(notifications));
    } catch (err) { next(err); }
  },

  unreadCount: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const count = await notificationService.getUnreadCount(req.user!.userId);
      res.json(success({ count }));
    } catch (err) { next(err); }
  },

  read: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const notification = await notificationService.markRead(req.params.id as string);
      res.json(success(notification, 'Notification marked as read'));
    } catch (err) { next(err); }
  },

  readAll: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await notificationService.markAllRead(req.user!.userId);
      res.json(success(null, 'All notifications marked as read'));
    } catch (err) { next(err); }
  },
};
