import { userRepository } from '../repositories/user.repository';
import { comparePassword, hashPassword } from '../lib/password';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../lib/jwt';
import { logger } from '../lib/logger';

export const authService = {
  login: async (email: string, password: string) => {
    const user = await userRepository.findByEmail(email);
    if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

    const valid = await comparePassword(password, user.passwordHash);
    if (!valid) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

    if (user.status !== 'ACTIVE') throw Object.assign(new Error('Account is inactive'), { status: 403 });

    const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
    const refreshToken = signRefreshToken(user.id);

    logger.info({ userId: user.id, role: user.role }, 'LOGIN_SUCCESS');

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, department: user.department },
    };
  },

  refresh: async (refreshToken: string) => {
    const payload = verifyRefreshToken(refreshToken);
    const user = await userRepository.findById(payload.userId);
    if (!user || user.status !== 'ACTIVE') throw Object.assign(new Error('User not found'), { status: 401 });

    const newAccessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
    return { accessToken: newAccessToken };
  },

  register: async (data: { name: string; email: string; password: string; departmentId?: string }) => {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw Object.assign(new Error('Email already registered'), { status: 409 });

    const passwordHash = await hashPassword(data.password);
    const user = await userRepository.create({ ...data, passwordHash, role: 'EMPLOYEE' });
    logger.info({ userId: user.id }, 'USER_REGISTERED');
    return user;
  },

  me: async (userId: string) => {
    const user = await userRepository.findById(userId);
    if (!user) throw Object.assign(new Error('User not found'), { status: 404 });
    const { passwordHash, ...safeUser } = user as any;
    return safeUser;
  },
};
