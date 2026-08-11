import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../prisma/client';
import { ENV } from '../../config/env.config';
import { ApiError } from '../../utils/apiResponse';
import { LoginInput } from './auth.schema';

export class AuthService {
  static async login(input: LoginInput) {
    const { email, password } = input;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      ENV.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  static async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });

    if (!user) {
      throw new ApiError(444, 'User not found');
    }

    return user;
  }

  static async seedAdminIfEmpty() {
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await prisma.user.create({
        data: {
          name: 'System Admin',
          email: 'admin@doctortracker.com',
          password: hashedPassword,
          role: 'admin',
        },
      });
      console.log('✅ Admin user seeded: admin@doctortracker.com / admin123');
    }
  }
}
