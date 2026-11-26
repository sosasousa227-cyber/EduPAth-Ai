import type { Category, Course, Institution, Modality } from '../types/edu';

export interface RawCategoryRow {
  id: string | number;
  name: string;
  slug?: string | null;
  description?: string | null;
  color?: string | null;
}

export interface RawInstitutionRow {
  id: string | number;
  category_id: string | number;
  name: string;
  description?: string | null;
  image_url?: string | null;
  address?: string | null;
  city?: string | null;
  department?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  opening_hours?: string | null;
  schedule?: string | null;
  modality?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  is_featured?: boolean | null;
  is_demo?: boolean | null;
}

export interface RawCourseRow {
  id: string | number;
  institution_id: string | number;
  name?: string | null;
  title?: string | null;
  description?: string | null;
  study_area?: string | null;
  modality?: string | null;
  duration?: string | null;
  schedule?: string | null;
  cost?: number | string | null;
  cost_gs?: number | string | null;
  cost_display?: string | null;
  is_free?: boolean | null;
  requirements?: string | null;
  is_featured?: boolean | null;
  is_demo?: boolean | null;
}

export function slugifyCategory(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function resolveCategoryColor(slug: string, explicitColor?: string | null): string {
  if (explicitColor && explicitColor.trim()) return explicitColor.trim();
  if (slug.includes('academia')) return '#A78BFA';
  if (slug.includes('biblio')) return '#A9D9BD';
  if (slug.includes('capacita')) return '#91C9F7';
  if (slug.includes('tecnolog')) return '#F4A6C1';
  if (slug.includes('idioma')) return '#FFE08A';
  return '#A78BFA';
}

export function normalizeModality(raw: string | null | undefined): Modality {
  const val = (raw || '')
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  if (val === 'presencial') return 'Presencial';
  if (val === 'virtual') return 'Virtual';
  if (val === 'hibrida' || val === 'mixta') return 'Híbrida';
  return 'Consultar';
}

function detectIsDemo(
  explicitDemo: boolean | null | undefined,
  name: string,
  description: string
): boolean {
  if (typeof explicitDemo === 'boolean') return explicitDemo;
  const hay = `${name} ${description}`.toLowerCase();
  return hay.includes('demo') || hay.includes('demostración') || hay.includes('demostracion');
}

export function mapCategories(rows: RawCategoryRow[]): Category[] {
  return rows.map((row) => {
    const slug = row.slug?.trim() || slugifyCategory(row.name);
    return {
      id: String(row.id),
      name: row.name,
      slug,
      description: row.description?.trim() || '',
      color: resolveCategoryColor(slug, row.color),
    };
  });
}

export function mapInstitutions(
  rows: RawInstitutionRow[],
  categories: Category[]
): Institution[] {
  const catById = new Map(categories.map((c) => [c.id, c]));

  return rows.map((row, idx) => {
    const name = row.name;
    const description = row.description?.trim() || 'Institución educativa en Paraguay.';
    const lat = Number(row.latitude);
    const lon = Number(row.longitude);
    const category = catById.get(String(row.category_id));
    const isDemo = detectIsDemo(row.is_demo, name, description);

    return {
      id: String(row.id),
      category_id: String(row.category_id),
      name,
      description,
      image_url: row.image_url || null,
      address: row.address?.trim() || 'Dirección no especificada',
      city: row.city?.trim() || 'Paraguay',
      department: row.department?.trim() || 'Paraguay',
      phone: row.phone || null,
      email: row.email || null,
      website: row.website || null,
      schedule:
        row.opening_hours?.trim() ||
        row.schedule?.trim() ||
        'Horario a consultar',
      modality: normalizeModality(row.modality),
      latitude: Number.isFinite(lat) ? lat : -25.2637,
      longitude: Number.isFinite(lon) ? lon : -57.5759,
      is_featured:
        typeof row.is_featured === 'boolean' ? row.is_featured : idx < 3,
      is_demo: isDemo,
      category,
    };
  });
}

export function mapCourses(
  rows: RawCourseRow[],
  institutions: Institution[]
): Course[] {
  const instById = new Map(institutions.map((i) => [i.id, i]));

  return rows.map((row, idx) => {
    const title = row.name?.trim() || row.title?.trim() || 'Curso disponible';
    const description = row.description?.trim() || '';
    const numericCost = Number(row.cost ?? row.cost_gs ?? 0);
    const safeCost = Number.isFinite(numericCost) && numericCost >= 0 ? numericCost : 0;
    const isFree =
      typeof row.is_free === 'boolean' ? row.is_free : safeCost === 0;
    const costDisplay =
      row.cost_display?.trim() ||
      (isFree
        ? 'Gratuito'
        : `Gs. ${Math.round(safeCost).toLocaleString('es-PY')}`);

    const inst = instById.get(String(row.institution_id));
    const isDemo =
      typeof row.is_demo === 'boolean' ? row.is_demo : Boolean(inst?.is_demo);

    return {
      id: String(row.id),
      institution_id: String(row.institution_id),
      title,
      description,
      study_area: row.study_area?.trim() || 'General',
      modality: normalizeModality(row.modality),
      duration: row.duration?.trim() || 'Consultar duración',
      schedule: row.schedule?.trim() || 'Horario a consultar',
      cost_gs: safeCost,
      cost_display: costDisplay,
      is_free: isFree,
      requirements: row.requirements?.trim() || 'Sin requisitos previos',
      is_featured:
        typeof row.is_featured === 'boolean' ? row.is_featured : idx < 3,
      is_demo: isDemo,
      institution: inst
        ? {
            id: inst.id,
            name: inst.name,
            city: inst.city,
            department: inst.department,
            is_demo: inst.is_demo,
            category: inst.category,
          }
        : undefined,
    };
  });
}
