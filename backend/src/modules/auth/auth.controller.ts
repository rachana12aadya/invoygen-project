import type { Request, Response } from 'express';
import * as authService from './auth.service';
import { REFRESH_COOKIE, setRefreshCookie, cookieClearOnLogout } from './auth.cookies';

export async function signup(req: Request, res: Response) {
  const result = await authService.signup(req.body);
  setRefreshCookie(res, result.refreshToken);
  res.status(201).json({
    success: true,
    data: { user: result.user, accessToken: result.accessToken },
  });
}

export async function login(req: Request, res: Response) {
  const result = await authService.login(req.body);
  setRefreshCookie(res, result.refreshToken);
  res.json({
    success: true,
    data: { user: result.user, accessToken: result.accessToken },
  });
}

export async function refresh(req: Request, res: Response) {
  const result = await authService.refresh(req.cookies?.[REFRESH_COOKIE]);
  setRefreshCookie(res, result.refreshToken);
  res.json({ success: true, data: { accessToken: result.accessToken } });
}

export async function logout(req: Request, res: Response) {
  await authService.logout(req.userId, req.cookies?.[REFRESH_COOKIE]);
  cookieClearOnLogout(res);
  res.json({ success: true, data: { ok: true } });
}

export async function verifyEmail(req: Request, res: Response) {
  const user = await authService.verifyEmail(req.body.token);
  res.json({ success: true, data: { user } });
}

export async function forgotPassword(req: Request, res: Response) {
  const data = await authService.forgotPassword(req.body.email);
  res.json({ success: true, data });
}

export async function resetPassword(req: Request, res: Response) {
  const data = await authService.resetPassword(req.body.token, req.body.password);
  res.json({ success: true, data });
}
