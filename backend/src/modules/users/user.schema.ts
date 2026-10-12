import { z } from 'zod';

export const updateMeSchema = z.object({
  body: z
    .object({
      name: z.string().trim().min(1).max(100),
      defaults: z
        .object({
          country: z.string().length(2),
          currency: z.string().length(3),
          font: z.string().min(1).max(50),
          primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
          invoicePrefix: z.string().trim().min(1).max(12),
        })
        .partial(),
    })
    .partial(),
});

export const deleteMeSchema = z.object({
  body: z.object({
    confirmation: z.string(),
  }),
});
