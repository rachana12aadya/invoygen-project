import { Schema, model, Types } from 'mongoose';

export const INVOICE_STATUSES = ['draft', 'published', 'archive'] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

const lineItemSchema = new Schema(
  {
    description: { type: String, required: true, maxlength: 500 },
    quantity: { type: Number, required: true, min: 0 },
    unitPriceMinor: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const invoiceSchema = new Schema(
  {
    userId: { type: Types.ObjectId, ref: 'User', required: true, index: true },
    number: { type: String, required: true },
    sequence: { type: Number, required: true },
    status: { type: String, enum: INVOICE_STATUSES, default: 'draft' },
    templateId: { type: String, required: true },

    issuer: { name: String, email: String, address: String, taxId: String },
    client: { name: String, email: String, address: String, taxId: String },

    country: { type: String, required: true },
    currency: { type: String, required: true },
    lineItems: { type: [lineItemSchema], default: [] },
    discountMinor: { type: Number, default: 0, min: 0 },
    taxRate: { type: Number, default: 0, min: 0, max: 100 },
    taxLabel: { type: String, default: 'Tax' },

    subtotalMinor: { type: Number, default: 0 },
    taxTotalMinor: { type: Number, default: 0 },
    totalMinor: { type: Number, default: 0 },

    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date },
    notes: { type: String, maxlength: 2000 },

    font: { type: String, default: 'inter' },
    colorScheme: { primary: { type: String, default: '#2E251B' } },
    signature: {
      type: { type: String, enum: ['font', 'drawn'] },
      data: String,
    },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
    purgeAt: { type: Date },
    statusBeforeDelete: { type: String, enum: INVOICE_STATUSES },
  },
  { timestamps: true },
);

invoiceSchema.index({ userId: 1, number: 1 }, { unique: true });
invoiceSchema.index({ userId: 1, status: 1, createdAt: -1 });
invoiceSchema.index({ userId: 1, isDeleted: 1, createdAt: -1 });
invoiceSchema.index({ purgeAt: 1 }, { expireAfterSeconds: 0 });

export const Invoice = model('Invoice', invoiceSchema);
