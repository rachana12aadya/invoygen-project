import type { Request, Response } from 'express';
import * as signatureService from './signature.service';

function userId(req: Request): string {
  return req.userId as string;
}

export async function list(req: Request, res: Response) {
  const signatures = await signatureService.list(userId(req));
  res.json({ success: true, data: { signatures } });
}

export async function create(req: Request, res: Response) {
  const signature = await signatureService.create(userId(req), req.body);
  res.status(201).json({ success: true, data: { signature } });
}

export async function remove(req: Request, res: Response) {
  const data = await signatureService.remove(userId(req), req.params.id);
  res.json({ success: true, data });
}
