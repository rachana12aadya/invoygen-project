import { Schema, model, Types } from 'mongoose';

const invoiceCounterSchema = new Schema({
  userId: { type: Types.ObjectId, ref: 'User', required: true, unique: true },
  lastNumber: { type: Number, default: 0 },
});

export const InvoiceCounter = model('InvoiceCounter', invoiceCounterSchema);
