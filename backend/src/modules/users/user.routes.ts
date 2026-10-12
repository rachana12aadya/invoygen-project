import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import { deleteMeSchema, updateMeSchema } from './user.schema';
import * as controller from './user.controller';

export const userRoutes = Router();

userRoutes.use(requireAuth);
userRoutes.get('/me', asyncHandler(controller.getMe));
userRoutes.patch('/me', validate(updateMeSchema), asyncHandler(controller.updateMe));
userRoutes.get('/me/export', asyncHandler(controller.exportMe));
userRoutes.delete('/me', validate(deleteMeSchema), asyncHandler(controller.deleteMe));
