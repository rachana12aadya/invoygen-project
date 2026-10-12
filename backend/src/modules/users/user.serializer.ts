import type { Document } from 'mongoose';

export function serializeUser(user: Document & {
  name: string;
  email: string;
  emailVerified: boolean;
  plan: string;
  defaults?: {
    country?: string;
    currency?: string;
    font?: string;
    primaryColor?: string;
    invoicePrefix?: string;
  };
}) {
  const id = String(user._id);
  return {
    id,
    name: user.name,
    email: user.email,
    emailVerified: user.emailVerified,
    plan: user.plan,
    defaults: {
      country: user.defaults?.country ?? 'US',
      currency: user.defaults?.currency ?? 'USD',
      font: user.defaults?.font ?? 'inter',
      primaryColor: user.defaults?.primaryColor ?? '#2E251B',
      invoicePrefix: user.defaults?.invoicePrefix ?? 'INV',
    },
  };
}
