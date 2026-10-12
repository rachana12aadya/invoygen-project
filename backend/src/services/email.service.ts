import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from '../config/logger';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: env.SMTP_PORT === 1025 ? undefined : { user: env.SMTP_USER, pass: env.SMTP_PASS },
});

async function send(to: string, subject: string, text: string): Promise<void> {
  try {
    await transporter.sendMail({ from: env.EMAIL_FROM, to, subject, text });
  } catch (err) {
    logger.error('Email send failed', { subject });
    if (env.NODE_ENV === 'test') return;
    throw err;
  }
}

export async function sendVerificationEmail(to: string, token: string): Promise<void> {
  const url = `${env.FRONTEND_URL}/verify-email?token=${encodeURIComponent(token)}`;
  await send(to, 'Verify your invoygen email', `Verify your email by opening this link:\n${url}\n`);
}

export async function sendPasswordResetEmail(to: string, token: string): Promise<void> {
  const url = `${env.FRONTEND_URL}/reset-password?token=${encodeURIComponent(token)}`;
  await send(to, 'Reset your invoygen password', `Reset your password by opening this link:\n${url}\n`);
}

export async function sendContactNotification(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  await send(
    env.CONTACT_INBOX,
    `[invoygen contact] ${payload.subject}`,
    `From: ${payload.name} <${payload.email}>\n\n${payload.message}`,
  );
}
