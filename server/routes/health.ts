import { Router } from 'express';
import { isGeminiConfigured } from '../services/geminiService.ts';
import { isServerSupabaseConfigured } from '../services/supabaseService.ts';

export const healthRouter = Router();

healthRouter.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'edupath-ai-backend',
    supabaseConfigured: isServerSupabaseConfigured(),
    geminiConfigured: isGeminiConfigured(),
    timestamp: new Date().toISOString(),
  });
});
