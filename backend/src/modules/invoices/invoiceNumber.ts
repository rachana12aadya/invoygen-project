import { InvoiceCounter } from './invoiceCounter.model';

export async function allocateInvoiceNumber(userId: string, prefix = 'INV') {
  const counter = await InvoiceCounter.findOneAndUpdate(
    { userId },
    { $inc: { lastNumber: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  );
  const sequence = counter!.lastNumber;
  return { sequence, number: `${prefix}-${String(sequence).padStart(4, '0')}` };
}
