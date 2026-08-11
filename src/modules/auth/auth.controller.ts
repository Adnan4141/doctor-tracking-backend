import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess } from '../../utils/apiResponse';
import { ENV } from '../../config/env.config';

export class AuthController {
  
  static login = async (req: Request, res: Response): Promise<void> => {
    const result = await AuthService.login(req.body);

    const isProduction = ENV.NODE_ENV === 'production';
    const cookieDomain = ENV.COOKIE_DOMAIN || undefined;

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendSuccess(res, 200, 'Login successful', result.user, { token: result.token });
  };

  static logout = async (_req: Request, res: Response): Promise<void> => {
    const isProduction = ENV.NODE_ENV === 'production';
    const cookieDomain = ENV.COOKIE_DOMAIN || undefined;

    res.clearCookie('token', {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' : 'lax',
      ...(cookieDomain ? { domain: cookieDomain } : {}),
    });
    sendSuccess(res, 200, 'Logged out successfully');
  };

  static getMe = async (req: Request, res: Response): Promise<void> => {
    const user = await AuthService.getMe(req.user!.id);
    sendSuccess(res, 200, 'User profile fetched successfully', user);
  };
}
