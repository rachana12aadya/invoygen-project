import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { requireAuth } from '../../middleware/requireAuth';
import * as controller from './template.controller';

export const templateRoutes = Router();
templateRoutes.use(requireAuth);
templateRoutes.get('/', asyncHandler(controller.list));
