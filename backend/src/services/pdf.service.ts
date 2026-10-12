import PDFDocument from 'pdfkit';
import { formatMoney } from '../modules/invoices/calc';
import { Invoice } from '../modules/invoices/invoice.model';

export async function renderInvoicePdf(
  invoice: InstanceType<typeof Invoice>,
  options: { footer: boolean },
): Promise<Buffer> {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks: Buffer[] = [];
  doc.on('data', (c: Buffer) => chunks.push(c));

  const primary = invoice.colorScheme?.primary ?? '#2E251B';
  doc.fillColor(primary).fontSize(22).text('INVOICE', { align: 'left' });
  doc.moveDown(0.3);
  doc.fillColor('#111').fontSize(11).text(invoice.number);

  const issuer = invoice.issuer ?? {};
  const client = invoice.client ?? {};
  doc.moveDown();
  doc.fontSize(10).text(issuer.name ?? '');
  if (issuer.email) doc.text(String(issuer.email));
  if (issuer.address) doc.text(String(issuer.address));

  doc.moveDown();
  doc.fillColor(primary).text('Bill to');
  doc.fillColor('#111').text(client.name ?? '');
  if (client.email) doc.text(String(client.email));
  if (client.address) doc.text(String(client.address));

  doc.moveDown();
  doc.text(`Issue date: ${invoice.issueDate ? invoice.issueDate.toISOString().slice(0, 10) : ''}`);
  if (invoice.dueDate) doc.text(`Due date: ${invoice.dueDate.toISOString().slice(0, 10)}`);

  doc.moveDown();
  doc.fillColor(primary).text('Items');
  doc.fillColor('#111');
  for (const item of invoice.lineItems ?? []) {
    const line = Math.round(item.quantity * item.unitPriceMinor);
    doc.text(
      `${item.description}  x${item.quantity}  ${formatMoney(line, invoice.currency)}`,
    );
  }

  doc.moveDown();
  doc.text(`Subtotal: ${formatMoney(invoice.subtotalMinor ?? 0, invoice.currency)}`);
  doc.text(
    `${invoice.taxLabel ?? 'Tax'} (${invoice.taxRate ?? 0}%): ${formatMoney(invoice.taxTotalMinor ?? 0, invoice.currency)}`,
  );
  doc.fontSize(12).text(`Total: ${formatMoney(invoice.totalMinor ?? 0, invoice.currency)}`);

  if (invoice.notes) {
    doc.moveDown();
    doc.fontSize(10).text(`Notes: ${invoice.notes}`);
  }

  if (options.footer) {
    doc.fontSize(8).fillColor('#666').text('Created with invoygen', 50, 770, { align: 'center' });
  }

  doc.end();
  await new Promise<void>((resolve, reject) => {
    doc.on('end', () => resolve());
    doc.on('error', reject);
  });
  return Buffer.concat(chunks);
}

export function invoiceFileName(number: string, clientName?: string): string {
  const client = (clientName ?? 'client').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');
  return `invoice-${number}-${client || 'client'}.pdf`;
}
