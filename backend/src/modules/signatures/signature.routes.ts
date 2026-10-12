import { Router } from 'express';
import express from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import { createSignatureSchema, signatureIdSchema } from './signature.schema';
import * as controller from './signature.controller';

export const signatureRoutes = Router();

signatureRoutes.use(requireAuth);
signatureRoutes.get('/', asyncHandler(controller.list));
signatureRoutes.post(
  '/',
  express.json({ limit: '200kb' }),
  validate(createSignatureSchema),
  asyncHandler(controller.create),
);
signatureRoutes.delete('/:id', validate(signatureIdSchema), asyncHandler(controller.remove));
