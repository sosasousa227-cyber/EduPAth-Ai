import type { Category } from '../types/edu';

export const HERO_ILLUSTRATION =
  '/src/assets/images/hero_edupath_paraguay_1795698969624.jpg';

export const AI_EMBLEM_ILLUSTRATION =
  '/src/assets/images/edupath_ai_emblem_1795698971663.jpg';

export const CATEGORY_FALLBACK_IMAGES: Record<string, string> = {
  academias: '/src/assets/images/inst_academia_default_1795698971115.jpg',
  bibliotecas: '/src/assets/images/inst_biblioteca_default_1795698971230.jpg',
  'centros-de-capacitacion':
    '/src/assets/images/inst_capacitacion_default_1795698972043.jpg',
};

export function resolveInstitutionImage(
  imageUrl: string | null | undefined,
  category?: Pick<Category, 'slug' | 'name'>
): string {
  if (imageUrl && (imageUrl.startsWith('https://') || imageUrl.startsWith('/src/'))) {
    return imageUrl;
  }
  const slug = category?.slug?.toLowerCase() || '';
  if (CATEGORY_FALLBACK_IMAGES[slug]) {
    return CATEGORY_FALLBACK_IMAGES[slug];
  }
  const name = category?.name?.toLowerCase() || '';
  if (name.includes('biblio')) {
    return CATEGORY_FALLBACK_IMAGES.bibliotecas;
  }
  if (name.includes('capacita')) {
    return CATEGORY_FALLBACK_IMAGES['centros-de-capacitacion'];
  }
  return CATEGORY_FALLBACK_IMAGES.academias;
}

export function sanitizeExternalUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString();
    }
    return null;
  } catch {
    return null;
  }
}
