import type { Request, Response } from 'express';
import { ContactMessage } from './contact.model';
import { sendContactNotification } from '../../services/email.service';

export async function create(req: Request, res: Response) {
  if (req.body.company) {
    return res.status(201).json({ success: true, data: { ok: true } });
  }
  await ContactMessage.create({
    name: req.body.name,
    email: req.body.email,
    subject: req.body.subject,
    message: req.body.message,
  });
  await sendContactNotification(req.body);
  res.status(201).json({ success: true, data: { ok: true } });
}
