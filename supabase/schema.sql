-- ============================================================================
-- EduPath AI — Esquema oficial de Supabase (PostgreSQL + RLS)
-- Tablas principales: categories, institutions, courses
-- Acceso público de solo lectura (sin autenticación ni modificaciones públicas)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Tabla de categorías educativas
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL DEFAULT '',
  color TEXT NOT NULL DEFAULT '#A78BFA',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Tabla de instituciones educativas de Paraguay
CREATE TABLE IF NOT EXISTS public.institutions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.categories(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  department TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  website TEXT,
  schedule TEXT NOT NULL,
  modality TEXT NOT NULL CHECK (modality IN ('Presencial', 'Virtual', 'Híbrida')),
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Tabla de cursos y capacitaciones
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  study_area TEXT NOT NULL,
  modality TEXT NOT NULL CHECK (modality IN ('Presencial', 'Virtual', 'Híbrida')),
  duration TEXT NOT NULL,
  schedule TEXT NOT NULL,
  cost_gs INTEGER NOT NULL DEFAULT 0 CHECK (cost_gs >= 0),
  cost_display TEXT NOT NULL DEFAULT 'Gratuito',
  is_free BOOLEAN NOT NULL DEFAULT FALSE,
  requirements TEXT NOT NULL DEFAULT 'Sin requisitos previos',
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para búsquedas y filtros frecuentes
CREATE INDEX IF NOT EXISTS idx_institutions_category_id ON public.institutions(category_id);
CREATE INDEX IF NOT EXISTS idx_institutions_city ON public.institutions(city);
CREATE INDEX IF NOT EXISTS idx_institutions_department ON public.institutions(department);
CREATE INDEX IF NOT EXISTS idx_courses_institution_id ON public.courses(institution_id);
CREATE INDEX IF NOT EXISTS idx_courses_study_area ON public.courses(study_area);
CREATE INDEX IF NOT EXISTS idx_courses_is_free ON public.courses(is_free);

-- ============================================================================
-- SEGURIDAD: Row Level Security (RLS)
-- Lectura pública habilitada para visitantes; escrituras públicas bloqueadas.
-- ============================================================================

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Lectura publica de categories" ON public.categories;
CREATE POLICY "Lectura publica de categories"
  ON public.categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Lectura publica de institutions" ON public.institutions;
CREATE POLICY "Lectura publica de institutions"
  ON public.institutions
  FOR SELECT
  TO anon, authenticated
  USING (true);

DROP POLICY IF EXISTS "Lectura publica de courses" ON public.courses;
CREATE POLICY "Lectura publica de courses"
  ON public.courses
  FOR SELECT
  TO anon, authenticated
  USING (true);
