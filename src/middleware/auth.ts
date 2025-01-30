import { verify, JwtPayload } from 'jsonwebtoken';
import { config } from '../config/env';
import { UserPayload } from '../types/user';

interface CustomJwtPayload extends JwtPayload, UserPayload {}

export interface Context {
  user?: UserPayload;
}

export const authenticate = async (token: string): Promise<Context> => {
  try {
    if (!token) {
      return { user: undefined };
    }

    const cleanToken = token.replace('Bearer ', '');

    const decoded = verify(cleanToken, config.jwt.secret) as CustomJwtPayload;
    return { 
      user: {
        id: decoded.id,
        role: decoded.role,
        username: decoded.username
      }
    };
  } catch (error) {
    return { user: undefined };
  }
};

export const checkAuth = (context: Context) => {
  if (!context.user) {
    throw new Error('Not authenticated');
  }
  return context.user;
};

export const checkAdmin = (context: Context) => {
  const user = checkAuth(context);
  if (user.role !== 'ADMIN') {
    throw new Error('Not authorized. Admin access required');
  }
  return user;
};
