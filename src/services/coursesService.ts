import { DEMO_COURSES } from '../data/demoData';
import { getSupabaseClient } from '../lib/supabase';
import {
  mapCategories,
  mapCourses,
  mapInstitutions,
  type RawCategoryRow,
  type RawCourseRow,
  type RawInstitutionRow,
} from '../lib/supabaseMappers';
import type { Course, DataSourceStatus } from '../types/edu';

export interface CoursesPayload {
  courses: Course[];
  source: DataSourceStatus;
}

export async function fetchCourses(): Promise<CoursesPayload> {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return {
      courses: DEMO_COURSES,
      source: 'demo-fallback',
    };
  }

  const [catRes, instRes, courseRes] = await Promise.all([
    supabase.from('categories').select('*').order('id', { ascending: true }),
    supabase.from('institutions').select('*').order('id', { ascending: true }),
    supabase.from('courses').select('*').order('id', { ascending: true }),
  ]);

  if (courseRes.error) {
    throw new Error(`Error al cargar cursos desde Supabase: ${courseRes.error.message}`);
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
    courses,
    source: 'supabase',
  };
}
