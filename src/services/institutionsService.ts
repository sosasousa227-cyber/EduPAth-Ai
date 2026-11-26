import {
  mapCategories,
  mapInstitutions,
  type RawCategoryRow,
  type RawInstitutionRow,
} from '../lib/supabaseMappers';
import { getSupabaseClient } from '../lib/supabase';
import type { Category, DataSourceStatus, Institution } from '../types/edu';
import { DEMO_CATEGORIES, DEMO_INSTITUTIONS } from '../data/demoData';

export interface InstitutionsPayload {
  categories: Category[];
  institutions: Institution[];
  source: DataSourceStatus;
}

export async function fetchCategoriesAndInstitutions(): Promise<InstitutionsPayload> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      categories: DEMO_CATEGORIES,
      institutions: DEMO_INSTITUTIONS,
      source: 'demo-fallback',
    };
  }

  const [catRes, instRes] = await Promise.all([
    supabase.from('categories').select('*').order('id', { ascending: true }),
    supabase.from('institutions').select('*').order('id', { ascending: true }),
  ]);

  if (catRes.error) {
    throw new Error(`Error al cargar categorías desde Supabase: ${catRes.error.message}`);
  }

  if (instRes.error) {
    throw new Error(`Error al cargar instituciones desde Supabase: ${instRes.error.message}`);
  }

  const categories = mapCategories((catRes.data || []) as RawCategoryRow[]);
  const institutions = mapInstitutions(
    (instRes.data || []) as RawInstitutionRow[],
    categories
  );

  return {
    categories,
    institutions,
    source: 'supabase',
  };
}
