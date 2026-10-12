import { AppError } from '../../middleware/errorHandler';
import { notFound } from '../../utils/ownershipCheck';
import { Invoice } from '../invoices/invoice.model';
import { SavedSignature } from '../signatures/signature.model';
import { RefreshSession } from '../auth/refreshSession.model';
import { OneTimeToken } from '../auth/oneTimeToken.model';
import { User } from './user.model';
import { serializeUser } from './user.serializer';

export async function getMe(userId: string) {
  const user = await User.findById(userId);
  if (!user) notFound();
  return serializeUser(user);
}

export async function updateMe(
  userId: string,
  body: { name?: string; defaults?: Record<string, string> },
) {
  const user = await User.findById(userId);
  if (!user) notFound();
  if (body.name) user.name = body.name;
  if (body.defaults) {
    user.defaults = { ...user.defaults, ...body.defaults };
  }
  await user.save();
  return serializeUser(user);
}

export async function exportMe(userId: string) {
  const user = await User.findById(userId);
  if (!user) notFound();
  const [invoices, signatures] = await Promise.all([
    Invoice.find({ userId }),
    SavedSignature.find({ userId }),
  ]);
  return {
    user: serializeUser(user),
    invoices,
    signatures,
  };
}

export async function deleteMe(userId: string, confirmation: string) {
  if (confirmation !== 'DELETE') {
    throw new AppError(400, 'CONFIRM_TEXT_MISMATCH', 'Type DELETE to confirm');
  }
  await Promise.all([
    Invoice.deleteMany({ userId }),
    SavedSignature.deleteMany({ userId }),
    RefreshSession.deleteMany({ userId }),
    OneTimeToken.deleteMany({ userId }),
    User.deleteOne({ _id: userId }),
  ]);
  return { ok: true };
}
