import { Router } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { requireAuth } from '../../middleware/requireAuth';
import { validate } from '../../middleware/validate';
import {
  createInvoiceSchema,
  idParamSchema,
  listInvoiceSchema,
  permanentDeleteSchema,
  statusSchema,
  updateInvoiceSchema,
} from './invoice.schema';
import * as controller from './invoice.controller';

export const invoiceRoutes = Router();

invoiceRoutes.use(requireAuth);

invoiceRoutes.post('/', validate(createInvoiceSchema), asyncHandler(controller.create));
invoiceRoutes.get('/', validate(listInvoiceSchema), asyncHandler(controller.list));
invoiceRoutes.get('/trash', asyncHandler(controller.listTrash));
invoiceRoutes.get('/:id/download', validate(idParamSchema), asyncHandler(controller.download));
invoiceRoutes.post('/:id/duplicate', validate(idParamSchema), asyncHandler(controller.duplicate));
invoiceRoutes.post('/:id/restore', validate(idParamSchema), asyncHandler(controller.restore));
invoiceRoutes.patch('/:id/status', validate(statusSchema), asyncHandler(controller.status));
invoiceRoutes.delete('/:id/permanent', validate(permanentDeleteSchema), asyncHandler(controller.permanent));
invoiceRoutes.get('/:id', validate(idParamSchema), asyncHandler(controller.get));
invoiceRoutes.patch('/:id', validate(updateInvoiceSchema), asyncHandler(controller.update));
invoiceRoutes.delete('/:id', validate(idParamSchema), asyncHandler(controller.trash));
