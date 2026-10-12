import type { Request, Response } from 'express';
import * as userService from './user.service';
import { cookieClearOnLogout } from '../auth/auth.cookies';

function userId(req: Request): string {
  return req.userId as string;
}

export async function getMe(req: Request, res: Response) {
  const user = await userService.getMe(userId(req));
  res.json({ success: true, data: { user } });
}

export async function updateMe(req: Request, res: Response) {
  const user = await userService.updateMe(userId(req), req.body);
  res.json({ success: true, data: { user } });
}

export async function exportMe(req: Request, res: Response) {
  const data = await userService.exportMe(userId(req));
  res.json({ success: true, data });
}

export async function deleteMe(req: Request, res: Response) {
  const data = await userService.deleteMe(userId(req), req.body.confirmation);
  cookieClearOnLogout(res);
  res.json({ success: true, data });
}
