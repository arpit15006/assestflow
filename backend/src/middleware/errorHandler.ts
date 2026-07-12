import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';
import { failure } from '../types/api.types';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error({ err, path: req.path, method: req.method }, 'Unhandled error');

  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    res.status(401).json(failure('Invalid or expired token'));
    return;
  }

  if (err.code === 'P2002') {
    // Prisma unique constraint
    res.status(409).json(failure('A record with this value already exists'));
    return;
  }

  if (err.code === 'P2025') {
    // Prisma record not found
    res.status(404).json(failure('Record not found'));
    return;
  }

  const status = err.status || err.statusCode || 500;
  const message = status < 500 ? err.message : 'Internal server error';
  res.status(status).json(failure(message));
};
