import cors from 'cors';

export function createCorsMiddleware() {
  const rawOrigins = [
    process.env.APP_URL,
    ...(process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : []),
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:5173',
  ]
    .map((origin) => (origin || '').trim().replace(/\/+$/, ''))
    .filter((origin) => origin.length > 0 && origin !== 'MY_APP_URL');

  const allowedSet = new Set(rawOrigins);

  return cors({
    origin(origin, callback) {
      // Allow same-origin requests, server-to-server health checks, or curl without Origin header
      if (!origin) {
        return callback(null, true);
      }
      const normalized = origin.replace(/\/+$/, '');
      if (allowedSet.size === 0 || allowedSet.has(normalized)) {
        return callback(null, true);
      }
      // Allow Render preview / AI Studio subdomains when explicitly matching host pattern
      if (
        normalized.endsWith('.onrender.com') ||
        normalized.endsWith('.run.app')
      ) {
        return callback(null, true);
      }
      return callback(new Error('Origen no permitido por la política CORS.'));
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    maxAge: 86400,
  });
}
