import type { Request, Response } from 'express';
import { User } from '../users/user.model';
import { templatesForPlan } from './templates.config';
import { notFound } from '../../utils/ownershipCheck';

export async function list(req: Request, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) notFound();
  const plan = (user.plan ?? 'free') as 'free' | 'paid';
  res.json({ success: true, data: { templates: templatesForPlan(plan) } });
}
