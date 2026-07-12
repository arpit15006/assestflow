import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, JwtAccessPayload } from '../lib/jwt';
import { failure } from '../types/api.types';
import { logger } from '../lib/logger';

export interface AuthRequest extends Request {
  user?: JwtAccessPayload;
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.cookies?.access_token || req.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json(failure('Authentication required'));
      return;
    }

    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    logger.warn({ err }, 'Invalid or expired access token');
    res.status(401).json(failure('Invalid or expired token'));
  }
};
