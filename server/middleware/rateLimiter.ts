import type { NextFunction, Request, Response } from 'express';
import rateLimit from 'express-rate-limit';

export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error:
      'Realizaste demasiadas consultas seguidas. Por favor esperá un minuto antes de volver a escribir a EduPath AI.',
  },
});

export interface SanitizedHistoryTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface ValidatedChatRequest extends Request {
  validatedChat?: {
    message: string;
    history: SanitizedHistoryTurn[];
  };
}

export function validateChatBody(
  req: ValidatedChatRequest,
  res: Response,
  next: NextFunction
): void {
  const body = req.body as Record<string, unknown> | undefined;

  if (!body || typeof body !== 'object') {
    res.status(400).json({ error: 'El cuerpo de la solicitud debe ser JSON válido.' });
    return;
  }

  const rawMessage = body.message;
  if (typeof rawMessage !== 'string') {
    res.status(400).json({ error: 'El mensaje debe ser un texto válido.' });
    return;
  }

  const trimmedMessage = rawMessage.trim();
  if (trimmedMessage.length === 0) {
    res.status(400).json({ error: 'Escribí una pregunta o tema para consultar a EduPath AI.' });
    return;
  }

  if (trimmedMessage.length > 1000) {
    res.status(400).json({
      error: 'El mensaje es demasiado largo (máximo 1000 caracteres).',
    });
    return;
  }

  const rawHistory = Array.isArray(body.history) ? body.history : [];
  const sanitizedHistory: SanitizedHistoryTurn[] = [];

  for (const item of rawHistory.slice(-10)) {
    if (
      item &&
      typeof item === 'object' &&
      ('role' in item) &&
      ('content' in item) &&
      (item.role === 'user' || item.role === 'assistant') &&
      typeof item.content === 'string'
    ) {
      const clean = item.content.trim().slice(0, 1200);
      if (clean.length > 0) {
        sanitizedHistory.push({
          role: item.role,
          content: clean,
        });
      }
    }
  }

  req.validatedChat = {
    message: trimmedMessage,
    history: sanitizedHistory,
  };
  next();
}
