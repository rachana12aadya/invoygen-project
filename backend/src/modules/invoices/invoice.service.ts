import { FilterQuery } from 'mongoose';
import { AppError } from '../../middleware/errorHandler';
import { PLANS } from '../../constants/plans';
import { User } from '../users/user.model';
import { getTemplate, templatesForPlan } from '../templates/templates.config';
import { Invoice, type InvoiceStatus } from './invoice.model';
import { allocateInvoiceNumber } from './invoiceNumber';
import { calcTotals } from './calc';
import { serializeInvoice } from './invoice.serializer';
import { assertOwnership, notFound } from '../../utils/ownershipCheck';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
const CONFIRM_DELETE = 'DELETE';

function applyTotals(invoice: InstanceType<typeof Invoice>) {
  const totals = calcTotals(invoice.lineItems ?? [], invoice.taxRate ?? 0, invoice.discountMinor ?? 0);
  invoice.subtotalMinor = totals.subtotalMinor;
  invoice.taxTotalMinor = totals.taxTotalMinor;
  invoice.totalMinor = totals.totalMinor;
}

async function loadOwned(userId: string, id: string, deleted?: boolean) {
  const query: FilterQuery<typeof Invoice> = { _id: id, userId };
  if (deleted === true) query.isDeleted = true;
  if (deleted === false) query.isDeleted = false;
  const invoice = await Invoice.findOne(query);
  return assertOwnership(invoice, userId);
}

async function assertTemplateAccess(plan: 'free' | 'paid', templateId: string) {
  const template = getTemplate(templateId);
  if (!template) throw new AppError(400, 'VALIDATION_ERROR', 'Unknown template');
  const allowed = templatesForPlan(plan).some((t) => t.id === templateId);
  if (!allowed) {
    throw new AppError(400, 'INVALID_REQUEST', 'Template is not available on your plan');
  }
  return template;
}

export async function createDraft(userId: string, input: { templateId: string; country: string; currency: string }) {
  const user = await User.findById(userId);
  if (!user) notFound();
  const plan = (user.plan ?? 'free') as 'free' | 'paid';
  await assertTemplateAccess(plan, input.templateId);

  if (plan === 'free') {
    const start = new Date();
    start.setUTCDate(1);
    start.setUTCHours(0, 0, 0, 0);
    const createdThisMonth = await Invoice.countDocuments({
      userId,
      createdAt: { $gte: start },
    });
    if (createdThisMonth >= PLANS.free.invoicesPerMonth) {
      throw new AppError(400, 'INVALID_REQUEST', 'Monthly invoice limit reached');
    }
  }

  const prefix = user.defaults?.invoicePrefix ?? 'INV';
  const { sequence, number } = await allocateInvoiceNumber(userId, prefix);
  const invoice = await Invoice.create({
    userId,
    number,
    sequence,
    status: 'draft',
    templateId: input.templateId,
    country: input.country,
    currency: input.currency,
    font: user.defaults?.font ?? 'inter',
    colorScheme: { primary: user.defaults?.primaryColor ?? '#2E251B' },
    issuer: { name: user.name, email: user.email },
  });
  applyTotals(invoice);
  await invoice.save();
  return serializeInvoice(invoice);
}

export async function list(
  userId: string,
  query: {
    status?: InvoiceStatus;
    q?: string;
    sort?: 'date' | 'amount';
    order?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  },
) {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  const filter: FilterQuery<typeof Invoice> = { userId, isDeleted: false };
  if (query.status) filter.status = query.status;
  if (query.q) {
    filter.$or = [
      { number: { $regex: query.q, $options: 'i' } },
      { 'client.name': { $regex: query.q, $options: 'i' } },
    ];
  }
  const sortField = query.sort === 'amount' ? 'totalMinor' : 'createdAt';
  const dir = query.order === 'asc' ? 1 : -1;
  const [items, total] = await Promise.all([
    Invoice.find(filter)
      .sort({ [sortField]: dir })
      .skip((page - 1) * limit)
      .limit(limit),
    Invoice.countDocuments(filter),
  ]);
  return {
    items: items.map(serializeInvoice),
    page,
    limit,
    total,
  };
}

export async function getById(userId: string, id: string) {
  const invoice = await loadOwned(userId, id, false);
  return serializeInvoice(invoice);
}

export async function update(userId: string, id: string, body: Record<string, unknown>) {
  const invoice = await loadOwned(userId, id, false);
  if (invoice.status !== 'draft') {
    throw new AppError(400, 'INVALID_REQUEST', 'Only draft invoices can be edited');
  }
  const user = await User.findById(userId);
  const plan = (user?.plan ?? 'free') as 'free' | 'paid';
  if (typeof body.templateId === 'string') {
    await assertTemplateAccess(plan, body.templateId);
  }
  if (typeof body.number === 'string' && body.number !== invoice.number) {
    const clash = await Invoice.findOne({ userId, number: body.number, _id: { $ne: invoice._id } });
    if (clash) throw new AppError(409, 'CONFLICT', 'Invoice number already in use');
    invoice.number = body.number;
  }
  const assignable = [
    'templateId',
    'country',
    'currency',
    'lineItems',
    'discountMinor',
    'taxRate',
    'taxLabel',
    'font',
    'colorScheme',
    'notes',
    'issuer',
    'client',
    'issueDate',
    'dueDate',
    'signature',
  ] as const;
  for (const key of assignable) {
    if (key in body) {
      (invoice as unknown as Record<string, unknown>)[key] = body[key];
    }
  }
  applyTotals(invoice);
  await invoice.save();
  return serializeInvoice(invoice);
}

const ALLOWED: Record<InvoiceStatus, InvoiceStatus[]> = {
  draft: ['published', 'archive'],
  published: ['archive'],
  archive: ['published'],
};

export async function changeStatus(userId: string, id: string, status: InvoiceStatus) {
  const invoice = await loadOwned(userId, id, false);
  if (invoice.status === status) return serializeInvoice(invoice);
  if (!ALLOWED[invoice.status].includes(status)) {
    throw new AppError(400, 'INVALID_REQUEST', 'Invalid status transition');
  }
  invoice.status = status;
  await invoice.save();
  return serializeInvoice(invoice);
}

export async function duplicate(userId: string, id: string) {
  const source = await loadOwned(userId, id, false);
  const created = await createDraft(userId, {
    templateId: source.templateId,
    country: source.country,
    currency: source.currency,
  });
  return update(userId, created.id, {
    lineItems: source.lineItems,
    discountMinor: source.discountMinor,
    taxRate: source.taxRate,
    taxLabel: source.taxLabel,
    font: source.font,
    colorScheme: source.colorScheme,
    notes: source.notes,
    issuer: source.issuer,
    client: source.client,
    signature: source.signature,
  } as Record<string, unknown>);
}

export async function moveToTrash(userId: string, id: string) {
  const invoice = await loadOwned(userId, id, false);
  invoice.statusBeforeDelete = invoice.status;
  invoice.isDeleted = true;
  invoice.deletedAt = new Date();
  invoice.purgeAt = new Date(Date.now() + THIRTY_DAYS_MS);
  await invoice.save();
  return serializeInvoice(invoice);
}

export async function listTrash(userId: string) {
  const items = await Invoice.find({ userId, isDeleted: true }).sort({ deletedAt: -1 });
  return {
    items: items.map((inv) => {
      const daysRemaining = inv.purgeAt
        ? Math.max(0, Math.ceil((inv.purgeAt.getTime() - Date.now()) / (24 * 60 * 60 * 1000)))
        : 0;
      return { ...serializeInvoice(inv), daysRemaining };
    }),
  };
}

export async function restore(userId: string, id: string) {
  const invoice = await loadOwned(userId, id, true);
  invoice.isDeleted = false;
  invoice.deletedAt = undefined;
  invoice.purgeAt = undefined;
  invoice.status = invoice.statusBeforeDelete ?? 'draft';
  await invoice.save();
  return serializeInvoice(invoice);
}

export async function permanentDelete(userId: string, id: string, confirmation: string) {
  if (confirmation !== CONFIRM_DELETE) {
    throw new AppError(400, 'CONFIRM_TEXT_MISMATCH', 'Type DELETE to confirm');
  }
  const invoice = await loadOwned(userId, id, true);
  await invoice.deleteOne();
  return { ok: true };
}

export async function requireVerifiedForDownload(userId: string) {
  const user = await User.findById(userId);
  if (!user) notFound();
  if (!user.emailVerified) {
    throw new AppError(400, 'INVALID_REQUEST', 'Verify your email before downloading');
  }
  return user;
}

export async function getForDownload(userId: string, id: string) {
  await requireVerifiedForDownload(userId);
  return loadOwned(userId, id, false);
}
