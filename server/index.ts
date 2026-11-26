import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createCorsMiddleware } from './middleware/corsConfig.ts';
import { chatRouter } from './routes/chat.ts';
import { healthRouter } from './routes/health.ts';

export function createApiApp() {
  const app = express();

  app.set('trust proxy', 1);
  app.use(createCorsMiddleware());
  app.use(express.json({ limit: '32kb' }));

  app.use('/api', healthRouter);
  app.use('/api', chatRouter);

  app.use('/api', (_req, res) => {
    res.status(404).json({ error: 'Endpoint de API no encontrado.' });
  });

  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      if (err.message.includes('CORS')) {
        res.status(403).json({ error: err.message });
        return;
      }
      console.error('[EduPath AI Express error]:', err.message);
      res.status(500).json({ error: 'Error inesperado en el servidor.' });
    }
  );

  return app;
}

const currentFilePath = fileURLToPath(import.meta.url);
const executedFilePath = process.argv[1] ? path.resolve(process.argv[1]) : '';

if (currentFilePath === executedFilePath) {
  const PORT = process.env.PORT || 3000;
  const app = createApiApp();
  app.listen(PORT, () => {
    console.log(`EduPath AI API escuchando en el puerto ${PORT}`);
  });
}
