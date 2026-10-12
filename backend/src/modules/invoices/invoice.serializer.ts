import type { InvoiceStatus } from './invoice.model';

export function serializeInvoice(doc: {
  _id: unknown;
  userId: unknown;
  number: string;
  sequence: number;
  status: InvoiceStatus;
  templateId: string;
  issuer?: unknown;
  client?: unknown;
  country: string;
  currency: string;
  lineItems?: unknown[];
  discountMinor?: number;
  taxRate?: number;
  taxLabel?: string;
  subtotalMinor?: number;
  taxTotalMinor?: number;
  totalMinor?: number;
  issueDate?: Date;
  dueDate?: Date;
  notes?: string;
  font?: string;
  colorScheme?: { primary?: string };
  signature?: { type?: string; data?: string };
  isDeleted?: boolean;
  deletedAt?: Date;
  purgeAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}) {
  return {
    id: String(doc._id),
    userId: String(doc.userId),
    number: doc.number,
    sequence: doc.sequence,
    status: doc.status,
    templateId: doc.templateId,
    issuer: doc.issuer ?? {},
    client: doc.client ?? {},
    country: doc.country,
    currency: doc.currency,
    lineItems: doc.lineItems ?? [],
    discountMinor: doc.discountMinor ?? 0,
    taxRate: doc.taxRate ?? 0,
    taxLabel: doc.taxLabel ?? 'Tax',
    subtotalMinor: doc.subtotalMinor ?? 0,
    taxTotalMinor: doc.taxTotalMinor ?? 0,
    totalMinor: doc.totalMinor ?? 0,
    issueDate: doc.issueDate,
    dueDate: doc.dueDate,
    notes: doc.notes ?? '',
    font: doc.font ?? 'inter',
    colorScheme: { primary: doc.colorScheme?.primary ?? '#2E251B' },
    signature: doc.signature?.type
      ? { type: doc.signature.type, data: doc.signature.data }
      : null,
    isDeleted: Boolean(doc.isDeleted),
    deletedAt: doc.deletedAt,
    purgeAt: doc.purgeAt,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
