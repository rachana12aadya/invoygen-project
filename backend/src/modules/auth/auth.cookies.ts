import type { CookieOptions, Response } from 'express';
import { env, isProd } from '../../config/env';

export const REFRESH_COOKIE = 'refreshToken';
export const REFRESH_COOKIE_PATH = '/api/v1/auth/refresh';

export function refreshCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: REFRESH_COOKIE_PATH,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export function setRefreshCookie(res: Response, token: string): void {
  res.cookie(REFRESH_COOKIE, token, refreshCookieOptions());
}

export function clearRefreshCookie(res: Response): void {
  res.clearCookie(REFRESH_COOKIE, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: REFRESH_COOKIE_PATH,
  });
}

export function cookieClearOnLogout(res: Response): void {
  clearRefreshCookie(res);
  res.clearCookie(REFRESH_COOKIE, {
    httpOnly: true,
    secure: isProd,
    sameSite: 'strict',
    path: '/api/v1/auth',
  });
}

void env;
