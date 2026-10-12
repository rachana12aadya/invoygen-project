import type { Request, Response } from 'express';
import * as invoiceService from './invoice.service';
import { invoiceFileName, renderInvoicePdf } from '../../services/pdf.service';
import { PLANS } from '../../constants/plans';

function userId(req: Request): string {
  return req.userId as string;
}

export async function create(req: Request, res: Response) {
  const invoice = await invoiceService.createDraft(userId(req), req.body);
  res.status(201).json({ success: true, data: { invoice } });
}

export async function list(req: Request, res: Response) {
  const data = await invoiceService.list(userId(req), req.query as never);
  res.json({ success: true, data });
}

export async function listTrash(req: Request, res: Response) {
  const data = await invoiceService.listTrash(userId(req));
  res.json({ success: true, data });
}

export async function get(req: Request, res: Response) {
  const invoice = await invoiceService.getById(userId(req), req.params.id);
  res.json({ success: true, data: { invoice } });
}

export async function update(req: Request, res: Response) {
  const invoice = await invoiceService.update(userId(req), req.params.id, req.body);
  res.json({ success: true, data: { invoice } });
}

export async function status(req: Request, res: Response) {
  const invoice = await invoiceService.changeStatus(userId(req), req.params.id, req.body.status);
  res.json({ success: true, data: { invoice } });
}

export async function duplicate(req: Request, res: Response) {
  const invoice = await invoiceService.duplicate(userId(req), req.params.id);
  res.status(201).json({ success: true, data: { invoice } });
}

export async function trash(req: Request, res: Response) {
  const invoice = await invoiceService.moveToTrash(userId(req), req.params.id);
  res.json({ success: true, data: { invoice } });
}

export async function restore(req: Request, res: Response) {
  const invoice = await invoiceService.restore(userId(req), req.params.id);
  res.json({ success: true, data: { invoice } });
}

export async function permanent(req: Request, res: Response) {
  const data = await invoiceService.permanentDelete(userId(req), req.params.id, req.body.confirmation);
  res.json({ success: true, data });
}

export async function download(req: Request, res: Response) {
  const invoice = await invoiceService.getForDownload(userId(req), req.params.id);
  const user = await invoiceService.requireVerifiedForDownload(userId(req));
  const plan = (user.plan ?? 'free') as 'free' | 'paid';
  const buffer = await renderInvoicePdf(invoice, { footer: PLANS[plan].pdfFooter });
  const filename = invoiceFileName(invoice.number, invoice.client?.name);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(buffer);
}
