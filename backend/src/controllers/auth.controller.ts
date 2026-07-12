import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/authService';
import { success } from '../types/api.types';
import { env } from '../config/env';
import { AuthRequest } from '../middleware/auth';

const COOKIE_OPTS = {
  httpOnly: true,
  secure: env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

export const authController = {
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { accessToken, refreshToken, user } = await authService.login(req.body.email, req.body.password);
      res.cookie('access_token', accessToken, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
      res.cookie('refresh_token', refreshToken, { ...COOKIE_OPTS, maxAge: 7 * 24 * 60 * 60 * 1000 });
      res.json(success({ user, accessToken }, 'Login successful'));
    } catch (err) { next(err); }
  },

  refresh: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.cookies?.refresh_token;
      if (!token) { res.status(401).json({ success: false, message: 'No refresh token' }); return; }
      const { accessToken } = await authService.refresh(token);
      res.cookie('access_token', accessToken, { ...COOKIE_OPTS, maxAge: 15 * 60 * 1000 });
      res.json(success({ accessToken }, 'Token refreshed'));
    } catch (err) { next(err); }
  },

  logout: (_req: Request, res: Response) => {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    res.json(success(null, 'Logged out successfully'));
  },

  me: async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const user = await authService.me(req.user!.userId);
      res.json(success(user));
    } catch (err) { next(err); }
  },

  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authService.register(req.body);
      res.status(201).json(success(user, 'Account created successfully'));
    } catch (err) { next(err); }
  },
};
