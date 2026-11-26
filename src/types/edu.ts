export type Modality = 'Presencial' | 'Virtual' | 'Híbrida' | 'Consultar';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
}

export interface Institution {
  id: string;
  category_id: string;
  name: string;
  description: string;
  image_url: string | null;
  address: string;
  city: string;
  department: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  schedule: string;
  modality: Modality;
  latitude: number;
  longitude: number;
  is_featured: boolean;
  is_demo: boolean;
  category?: Category;
}

export interface Course {
  id: string;
  institution_id: string;
  title: string;
  description: string;
  study_area: string;
  modality: Modality;
  duration: string;
  schedule: string;
  cost_gs: number;
  cost_display: string;
  is_free: boolean;
  requirements: string;
  is_featured: boolean;
  is_demo: boolean;
  institution?: Pick<Institution, 'id' | 'name' | 'city' | 'department' | 'is_demo'> & {
    category?: Category;
  };
}

export type DataSourceStatus = 'supabase' | 'demo-fallback';

export type NavSection = 'inicio' | 'instituciones' | 'cursos' | 'mapa' | 'asistente';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isError?: boolean;
}
