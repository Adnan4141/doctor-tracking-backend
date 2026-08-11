import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '../../middlewares/validate.middleware';
import { loginSchema } from './auth.schema';
import { authenticate } from '../../middlewares/auth.middleware';
import { authLimiter } from '../../middlewares/rateLimiter.middleware';
import { asyncHandler } from '../../utils/asyncHandler';

const router = Router();

router.post('/login', authLimiter, validate(loginSchema), asyncHandler(AuthController.login));
router.post('/logout', asyncHandler(AuthController.logout));
router.get('/me', authenticate, asyncHandler(AuthController.getMe));

export default router;
