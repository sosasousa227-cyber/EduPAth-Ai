import { Router } from 'express';
import {
  chatRateLimiter,
  validateChatBody,
  type ValidatedChatRequest,
} from '../middleware/rateLimiter.ts';
import { generateEduPathReply } from '../services/geminiService.ts';
import { fetchCatalogForAssistant } from '../services/supabaseService.ts';

export const chatRouter = Router();

chatRouter.post(
  '/chat',
  chatRateLimiter,
  validateChatBody,
  async (req: ValidatedChatRequest, res) => {
    try {
      const validated = req.validatedChat;
      if (!validated) {
        res.status(400).json({ error: 'Solicitud inválida.' });
        return;
      }

      const catalog = await fetchCatalogForAssistant();
      const reply = await generateEduPathReply({
        message: validated.message,
        history: validated.history,
        catalog,
      });

      res.json({
        reply,
        source: catalog.source,
        institutionsCount: catalog.institutions.length,
        coursesCount: catalog.courses.length,
      });
    } catch (error) {
      const rawMessage =
        error instanceof Error ? error.message : 'Error interno del asistente.';
      console.error('[EduPath AI /api/chat error]:', rawMessage);

      const lower = rawMessage.toLowerCase();
      if (
        lower.includes('gemini_api_key') ||
        lower.includes('api_key_invalid') ||
        lower.includes('permission_denied')
      ) {
        res.status(503).json({
          error:
            'El servicio de inteligencia artificial aún no tiene una clave GEMINI_API_KEY válida configurada en el servidor.',
        });
        return;
      }

      if (lower.includes('resource_exhausted') || lower.includes('429')) {
        res.status(429).json({
          error:
            'Se alcanzó temporalmente el límite de consultas de Gemini API. Probá nuevamente en unos segundos.',
        });
        return;
      }

      res.status(500).json({
        error:
          'No pudimos procesar tu consulta en este momento. Verificá tu conexión e intentá de nuevo.',
      });
    }
  }
);
