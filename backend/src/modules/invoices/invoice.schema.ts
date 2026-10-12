import { z } from 'zod';

const objectId = z.string().regex(/^[a-fA-F0-9]{24}$/);

const lineItem = z.object({
  description: z.string().trim().min(1).max(500),
  quantity: z.number().min(0),
  unitPriceMinor: z.number().int().min(0),
});

const party = z
  .object({
    name: z.string().trim().max(200),
    email: z.string().trim().email().or(z.literal('')),
    address: z.string().trim().max(500),
    taxId: z.string().trim().max(80),
  })
  .partial();

export const createInvoiceSchema = z.object({
  body: z.object({
    templateId: z.string().min(1),
    country: z.string().length(2),
    currency: z.string().length(3),
  }),
});

export const updateInvoiceSchema = z.object({
  params: z.object({ id: objectId }),
  body: z
    .object({
      number: z.string().trim().min(1).max(50),
      templateId: z.string(),
      country: z.string().length(2),
      currency: z.string().length(3),
      lineItems: z.array(lineItem).max(200),
      discountMinor: z.number().int().min(0),
      taxRate: z.number().min(0).max(100).multipleOf(0.01),
      taxLabel: z.string().trim().max(30),
      font: z.string(),
      colorScheme: z.object({ primary: z.string().regex(/^#[0-9A-Fa-f]{6}$/) }),
      notes: z.string().max(2000),
      issuer: party,
      client: party,
      issueDate: z.coerce.date(),
      dueDate: z.coerce.date(),
      signature: z
        .object({
          type: z.enum(['font', 'drawn']),
          data: z.string().max(140_000),
        })
        .nullable(),
    })
    .partial(),
});

export const statusSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({ status: z.enum(['draft', 'published', 'archive']) }),
});

export const idParamSchema = z.object({
  params: z.object({ id: objectId }),
});

export const listInvoiceSchema = z.object({
  query: z.object({
    status: z.enum(['draft', 'published', 'archive']).optional(),
    q: z.string().trim().max(100).optional(),
    sort: z.enum(['date', 'amount']).optional(),
    order: z.enum(['asc', 'desc']).optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
  }),
});

export const permanentDeleteSchema = z.object({
  params: z.object({ id: objectId }),
  body: z.object({
    confirmation: z.string(),
  }),
});
