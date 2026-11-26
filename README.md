# EduPath AI — Plataforma Educativa Inteligente de Paraguay

EduPath AI conecta a estudiantes y personas interesadas en aprender con **academias, bibliotecas y centros de capacitación en Paraguay**, integrando catálogo público en **Supabase**, mapa interactivo con **Leaflet + OpenStreetMap**, backend seguro en **Node.js + Express** y orientación educativa mediante **Gemini API**.

La plataforma es de **acceso público** (no requiere registro, inicio de sesión ni contraseñas).

---

## Arquitectura del proyecto

```
├── src/                    # Frontend React + TypeScript + Vite + Tailwind CSS
│   ├── assets/             # Imágenes e ilustraciones generadas
│   ├── components/         # Navbar, Mapa, Modal de Institución, Chatbot, Footer
│   ├── data/               # 5 ubicaciones de demostración claramente identificadas
│   ├── hooks/              # Hooks de carga y filtrado de datos
│   ├── lib/                # Cliente público de Supabase
│   ├── pages/              # Inicio, Instituciones, Cursos, Mapa y EduPath AI
│   ├── services/           # Servicios de instituciones, cursos y chat
│   └── types/              # Tipos TypeScript compartidos
├── server/                 # Rutas Express (/api/health, /api/chat) y servicio Gemini
│   ├── middleware/         # CORS y control de solicitudes / validación
│   ├── routes/             # GET /api/health y POST /api/chat
│   └── services/           # Integración con Supabase y @google/genai
├── server.ts               # Servidor unificado (Express + Vite/estáticos)
└── supabase/
    ├── schema.sql          # Tablas categories, institutions, courses + RLS público
    └── seed.sql            # Categorías y 5 ubicaciones de demostración en Paraguay
```

---

## 1. Configuración de Supabase

1. Creá un proyecto gratuito en [Supabase](https://supabase.com).
2. Abrí el **SQL Editor** y ejecutá primero `supabase/schema.sql`.
3. Luego ejecutá `supabase/seed.sql` para cargar las categorías iniciales y las 5 ubicaciones de demostración (marcadas con `is_demo = true`).
4. En **Project Settings → API**, copiá:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon public key` → `VITE_SUPABASE_ANON_KEY`
   - **Nunca** utilices `service_role` en el frontend.

---

## 2. Variables de entorno

Copiá `.env.example` a `.env` para desarrollo local:

```env
GEMINI_API_KEY="tu_api_key_de_gemini"
VITE_SUPABASE_URL="https://tu-proyecto.supabase.co"
VITE_SUPABASE_ANON_KEY="tu_anon_key_publica"
```

> El puerto del servidor se obtiene automáticamente mediante `process.env.PORT || 3000`.

---

## 3. Comandos de instalación y ejecución local

```bash
# Instalar dependencias
npm install

# Ejecutar la aplicación (frontend + /api/chat en el mismo servidor)
npm run dev

# Compilar frontend para producción
npm run build

# Ejecutar en producción
npm start

# Verificar tipos TypeScript
npm run lint
```
