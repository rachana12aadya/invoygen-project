import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
  signupSchema,
  verifyEmailSchema,
} from './auth.schema';
import * as controller from './auth.controller';

export const authRoutes = Router();

authRoutes.post('/signup', validate(signupSchema), asyncHandler(controller.signup));
authRoutes.post('/login', validate(loginSchema), asyncHandler(controller.login));
authRoutes.post('/refresh', asyncHandler(controller.refresh));
authRoutes.post('/logout', requireAuth, asyncHandler(controller.logout));
authRoutes.post('/verify-email', validate(verifyEmailSchema), asyncHandler(controller.verifyEmail));
authRoutes.post('/forgot-password', validate(forgotPasswordSchema), asyncHandler(controller.forgotPassword));
authRoutes.post('/reset-password', validate(resetPasswordSchema), asyncHandler(controller.resetPassword));
