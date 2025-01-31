import { sign, SignOptions, Secret } from 'jsonwebtoken';
import { hash, compare } from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { User } from '../entities/User';
import { config } from '../config/env';
import { DeepPartial } from 'typeorm';

// Import the UserRole enum
enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER'
}

interface AuthInput {
  username: string;
  password: string;
}

interface AuthPayload {
  token: string;
  user: User;
}

interface JWTPayload {
  id: string;
  username: string;
  role: UserRole; // Updated to use UserRole enum
}

export const authResolvers = {
  Mutation: {
    async register(_: any, { username, password }: AuthInput): Promise<AuthPayload> {
      const userRepository = AppDataSource.getRepository(User);

      const existingUser = await userRepository.findOne({ where: { username } });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await hash(password, 12);

      const userData: DeepPartial<User> = {
        username,
        password: hashedPassword,
        role: UserRole.USER // Use enum instead of string
      };

      const user = userRepository.create(userData);
      const savedUser = await userRepository.save(user);

      const payload: JWTPayload = {
        id: savedUser.id,
        username: savedUser.username,
        role: savedUser.role as UserRole // Type assertion since we know it's UserRole
      };

      const token = sign(
        payload,
        config.jwt.secret as Secret,
        {
          expiresIn: '24h'
        }
      );

      return {
        token,
        user: savedUser
      };
    },

    async login(_: any, { username, password }: AuthInput): Promise<AuthPayload> {
      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOne({ where: { username } });
      if (!user) {
        throw new Error('User not found');
      }

      const valid = await compare(password, user.password);
      if (!valid) {
        throw new Error('Invalid password');
      }

      const payload: JWTPayload = {
        id: user.id,
        username: user.username,
        role: user.role as UserRole // Type assertion since we know it's UserRole
      };

      const token = sign(
        payload,
        config.jwt.secret as Secret,
        {
          expiresIn: '24h'
        }
      );

      return {
        token,
        user
      };
    }
  }
};
