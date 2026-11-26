import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import {
  DEMO_CATEGORIES,
  DEMO_COURSES,
  DEMO_INSTITUTIONS,
} from '../../src/data/demoData.ts';
import {
  mapCategories,
  mapCourses,
  mapInstitutions,
  type RawCategoryRow,
  type RawCourseRow,
  type RawInstitutionRow,
} from '../../src/lib/supabaseMappers.ts';
import type { Category, Course, DataSourceStatus, Institution } from '../../src/types/edu.ts';

function getServerSupabaseConfig() {
  const url = (
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    ''
  ).trim();
  const anonKey = (
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    ''
  ).trim();

  const configured =
    Boolean(url) && Boolean(anonKey) && url.startsWith('https://');

  return { url, anonKey, configured };
}

let cachedClient: SupabaseClient | null = null;
let cachedSignature = '';

function getServerSupabaseClient(): SupabaseClient | null {
  const { url, anonKey, configured } = getServerSupabaseConfig();
  if (!configured) {
    return null;
  }
  const sig = `${url}|${anonKey}`;
  if (!cachedClient || cachedSignature !== sig) {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    cachedSignature = sig;
  }
  return cachedClient;
}

export function isServerSupabaseConfigured(): boolean {
  return getServerSupabaseConfig().configured;
}

export interface CatalogSnapshot {
  categories: Category[];
  institutions: Institution[];
  courses: Course[];
  source: DataSourceStatus;
}

export async function fetchCatalogForAssistant(): Promise<CatalogSnapshot> {
  const client = getServerSupabaseClient();

  if (!client) {
    return {
      categories: DEMO_CATEGORIES,
      institutions: DEMO_INSTITUTIONS,
      courses: DEMO_COURSES,
      source: 'demo-fallback',
    };
  }

  const [catRes, instRes, courseRes] = await Promise.all([
    client.from('categories').select('*').order('id', { ascending: true }),
    client.from('institutions').select('*').order('id', { ascending: true }),
    client.from('courses').select('*').order('id', { ascending: true }),
  ]);

  if (catRes.error || instRes.error || courseRes.error) {
    const errMsg =
      catRes.error?.message ||
      instRes.error?.message ||
      courseRes.error?.message ||
      'Error consultando Supabase';
    throw new Error(`No se pudo consultar el catálogo en Supabase: ${errMsg}`);
  }

  const categories = mapCategories((catRes.data || []) as RawCategoryRow[]);
  const institutions = mapInstitutions(
    (instRes.data || []) as RawInstitutionRow[],
    categories
  );
  const courses = mapCourses(
    (courseRes.data || []) as RawCourseRow[],
    institutions
  );

  return {
    categories,
    institutions,
    courses,
    source: 'supabase',
  };
}
