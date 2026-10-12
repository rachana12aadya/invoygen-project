import { SavedSignature } from './signature.model';
import { assertOwnership } from '../../utils/ownershipCheck';

export async function list(userId: string) {
  const items = await SavedSignature.find({ userId }).sort({ createdAt: -1 });
  return items.map((s) => ({
    id: String(s._id),
    type: s.type,
    data: s.data,
    createdAt: s.createdAt,
  }));
}

export async function create(userId: string, input: { type: 'font' | 'drawn'; data: string }) {
  const saved = await SavedSignature.create({ userId, ...input });
  return { id: String(saved._id), type: saved.type, data: saved.data, createdAt: saved.createdAt };
}

export async function remove(userId: string, id: string) {
  const doc = await SavedSignature.findById(id);
  assertOwnership(doc, userId);
  await doc.deleteOne();
  return { ok: true };
}
