import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface JwtAccessPayload {
  userId: string;
  email: string;
  role: string;
  type: 'access';
}

export interface JwtRefreshPayload {
  userId: string;
  type: 'refresh';
}

export const signAccessToken = (payload: Omit<JwtAccessPayload, 'type'>): string => {
  return jwt.sign({ ...payload, type: 'access' }, env.JWT_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES as any,
  });
};

export const signRefreshToken = (userId: string): string => {
  return jwt.sign({ userId, type: 'refresh' }, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES as any,
  });
};

export const verifyAccessToken = (token: string): JwtAccessPayload => {
  return jwt.verify(token, env.JWT_SECRET) as JwtAccessPayload;
};

export const verifyRefreshToken = (token: string): JwtRefreshPayload => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtRefreshPayload;
};
