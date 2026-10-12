import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { validate } from '../../middleware/validate';
import { contactSchema } from './contact.schema';
import * as controller from './contact.controller';

export const contactRoutes = Router();
contactRoutes.post('/', validate(contactSchema), asyncHandler(controller.create));
