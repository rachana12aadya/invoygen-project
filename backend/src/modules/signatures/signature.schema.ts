import { z } from 'zod';

const MAX_BYTES = 100 * 1024;

export const createSignatureSchema = z.object({
  body: z
    .object({
      type: z.enum(['font', 'drawn']),
      data: z.string().min(1),
    })
    .superRefine((value, ctx) => {
      const bytes = Buffer.byteLength(value.data, 'utf8');
      if (bytes > MAX_BYTES) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Signature must be 100 KB or less',
          path: ['data'],
        });
      }
      if (value.type === 'drawn' && !value.data.startsWith('data:image/')) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Drawn signatures must be a data URL image',
          path: ['data'],
        });
      }
    }),
});

export const signatureIdSchema = z.object({
  params: z.object({ id: z.string().regex(/^[a-fA-F0-9]{24}$/) }),
});
