import { useCallback, useEffect, useState } from 'react';
import { fetchCourses } from '../services/coursesService';
import { fetchCategoriesAndInstitutions } from '../services/institutionsService';
import type { Category, Course, DataSourceStatus, Institution } from '../types/edu';

export interface EduDataState {
  categories: Category[];
  institutions: Institution[];
  courses: Course[];
  source: DataSourceStatus;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
}

export function useEduData(): EduDataState {
  const [categories, setCategories] = useState<Category[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [source, setSource] = useState<DataSourceStatus>('demo-fallback');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [instPayload, coursesPayload] = await Promise.all([
        fetchCategoriesAndInstitutions(),
        fetchCourses(),
      ]);
      setCategories(instPayload.categories);
      setInstitutions(instPayload.institutions);
      setCourses(coursesPayload.courses);
      setSource(instPayload.source);
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : 'Ocurrió un error al obtener la información educativa.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  return {
    categories,
    institutions,
    courses,
    source,
    loading,
    error,
    reload: loadAll,
  };
}
