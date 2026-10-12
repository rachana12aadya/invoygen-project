import { z } from 'zod';

export const contactSchema = z.object({
  body: z.object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().toLowerCase().email(),
    subject: z.string().trim().min(1).max(200),
    message: z.string().trim().min(1).max(5000),
    company: z.string().max(200).optional().default(''),
  }),
});
