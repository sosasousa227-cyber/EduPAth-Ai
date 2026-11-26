import { CheckCircle2, RotateCcw, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CourseCard } from '../components/CourseCard';
import type { Course, Institution } from '../types/edu';

interface CoursesPageProps {
  courses: Course[];
  institutions: Institution[];
  loading: boolean;
  error: string | null;
  initialSearch?: string;
  onRetry: () => void;
  onSelectInstitution: (institution: Institution) => void;
  onAskAboutCourse: (course: Course) => void;
}

type CostFilter = 'all' | 'free' | 'up-to-200k' | 'up-to-400k';

export function CoursesPage({
  courses,
  institutions,
  loading,
  error,
  initialSearch = '',
  onRetry,
  onSelectInstitution,
  onAskAboutCourse,
}: CoursesPageProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedArea, setSelectedArea] = useState('all');
  const [selectedModality, setSelectedModality] = useState('all');
  const [selectedInstitution, setSelectedInstitution] = useState('all');
  const [onlyFree, setOnlyFree] = useState(false);
  const [costFilter, setCostFilter] = useState<CostFilter>('all');

  const studyAreas = useMemo(
    () => Array.from(new Set(courses.map((c) => c.study_area))).sort(),
    [courses]
  );

  const filteredCourses = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    return courses.filter((course) => {
      if (selectedArea !== 'all' && course.study_area !== selectedArea) {
        return false;
      }
      if (selectedModality !== 'all' && course.modality !== selectedModality) {
        return false;
      }
      if (
        selectedInstitution !== 'all' &&
        course.institution_id !== selectedInstitution
      ) {
        return false;
      }
      if (onlyFree && !course.is_free) {
        return false;
      }
      if (costFilter === 'free' && !course.is_free) {
        return false;
      }
      if (costFilter === 'up-to-200k' && course.cost_gs > 200000) {
        return false;
      }
      if (costFilter === 'up-to-400k' && course.cost_gs > 400000) {
        return false;
      }
      if (q) {
        const hay = `${course.title} ${course.description} ${course.study_area} ${course.institution?.name || ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [
    courses,
    searchTerm,
    selectedArea,
    selectedModality,
    selectedInstitution,
    onlyFree,
    costFilter,
  ]);

  const hasFilters =
    searchTerm !== '' ||
    selectedArea !== 'all' ||
    selectedModality !== 'all' ||
    selectedInstitution !== 'all' ||
    onlyFree ||
    costFilter !== 'all';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedArea('all');
    setSelectedModality('all');
    setSelectedInstitution('all');
    setOnlyFree(false);
    setCostFilter('all');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#29243A] tracking-tight">
          Cursos y capacitaciones
        </h1>
        <p className="text-sm sm:text-base text-[#29243A]/75 max-w-2xl">
          Explorá programas de tecnología, diseño, idiomas y oficios. Filtrá fácilmente por modalidad, institución o cursos gratuitos.
        </p>
      </div>

      {/* Filters bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#29243A]/10 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative lg:col-span-2">
            <Search
              className="w-4 h-4 text-[#5B3CC4] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <label htmlFor="course-search" className="sr-only">
              Buscar curso
            </label>
            <input
              id="course-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar curso, temática o institución..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#FFF9F5] border border-[#29243A]/12 text-sm text-[#29243A] focus:outline-none focus:border-[#5B3CC4]"
            />
          </div>

          <div>
            <label htmlFor="course-area" className="sr-only">
              Área de estudio
            </label>
            <select
              id="course-area"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#FFF9F5] border border-[#29243A]/12 text-sm text-[#29243A] focus:outline-none focus:border-[#5B3CC4]"
            >
              <option value="all">Todas las áreas</option>
              {studyAreas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="course-modality" className="sr-only">
              Modalidad
            </label>
            <select
              id="course-modality"
              value={selectedModality}
              onChange={(e) => setSelectedModality(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#FFF9F5] border border-[#29243A]/12 text-sm text-[#29243A] focus:outline-none focus:border-[#5B3CC4]"
            >
              <option value="all">Todas las modalidades</option>
              <option value="Presencial">Presencial</option>
              <option value="Virtual">Virtual</option>
              <option value="Híbrida">Híbrida</option>
            </select>
          </div>

          <div>
            <label htmlFor="course-inst" className="sr-only">
              Institución
            </label>
            <select
              id="course-inst"
              value={selectedInstitution}
              onChange={(e) => setSelectedInstitution(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#FFF9F5] border border-[#29243A]/12 text-sm text-[#29243A] focus:outline-none focus:border-[#5B3CC4]"
            >
              <option value="all">Todas las instituciones</option>
              {institutions.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#29243A]/8">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setOnlyFree((prev) => !prev)}
              aria-pressed={onlyFree}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                onlyFree
                  ? 'bg-[#A9D9BD] text-[#14432C]'
                  : 'bg-[#FFF9F5] border border-[#29243A]/12 text-[#29243A] hover:bg-[#A9D9BD]/25'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>Solo cursos gratuitos</span>
            </button>

            <div className="flex items-center gap-2">
              <label htmlFor="course-cost" className="text-xs font-semibold text-[#29243A]/75">
                Costo:
              </label>
              <select
                id="course-cost"
                value={costFilter}
                onChange={(e) => setCostFilter(e.target.value as CostFilter)}
                className="px-2.5 py-1.5 rounded-lg bg-[#FFF9F5] border border-[#29243A]/12 text-xs font-semibold text-[#29243A]"
              >
                <option value="all">Cualquier costo</option>
                <option value="free">Gratuito (Gs. 0)</option>
                <option value="up-to-200k">Hasta Gs. 200.000 / mes</option>
                <option value="up-to-400k">Hasta Gs. 400.000 / mes</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#29243A]/70 font-mono-tabular">
              {filteredCourses.length} de {courses.length} cursos
            </span>

            {hasFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4A6C1]/25 hover:bg-[#F4A6C1]/40 text-xs font-bold text-[#29243A] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Limpiar</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-6 rounded-2xl bg-[#FFF1F5] border border-[#F4A6C1] text-sm text-[#7F1D1D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <span>{error}</span>
          <button
            type="button"
            onClick={onRetry}
            className="px-4 py-2 rounded-xl bg-[#5B3CC4] text-white text-xs font-bold cursor-pointer shrink-0"
          >
            Reintentar
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="h-80 rounded-2xl bg-white/70 border border-[#29243A]/8 animate-pulse"
            />
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-[#29243A]/10 text-center space-y-3">
          <h2 className="font-display text-xl font-bold text-[#29243A]">
            No encontramos cursos con los filtros elegidos
          </h2>
          <p className="text-sm text-[#29243A]/70 max-w-md mx-auto">
            Probá ampliando el rango de costo o explorando otra área de estudio.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-[#5B3CC4] text-white text-sm font-bold cursor-pointer"
          >
            Mostrar todos los cursos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onAskAboutCourse={onAskAboutCourse}
              onInspectInstitution={(instId) => {
                const found = institutions.find((i) => i.id === instId);
                if (found) onSelectInstitution(found);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
