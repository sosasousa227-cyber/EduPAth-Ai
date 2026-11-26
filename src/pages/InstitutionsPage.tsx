import { RotateCcw, Search, SlidersHorizontal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { InstitutionCard } from '../components/InstitutionCard';
import type { Category, Institution } from '../types/edu';

interface InstitutionsPageProps {
  categories: Category[];
  institutions: Institution[];
  loading: boolean;
  error: string | null;
  initialSearch?: string;
  initialCategoryId?: string;
  onRetry: () => void;
  onSelectInstitution: (institution: Institution) => void;
  onLocateOnMap: (institution: Institution) => void;
}

type SortOption = 'featured' | 'name-asc' | 'name-desc' | 'city';

export function InstitutionsPage({
  categories,
  institutions,
  loading,
  error,
  initialSearch = '',
  initialCategoryId = 'all',
  onRetry,
  onSelectInstitution,
  onLocateOnMap,
}: InstitutionsPageProps) {
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategoryId);
  const [selectedCity, setSelectedCity] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedModality, setSelectedModality] = useState('all');
  const [sortBy, setSortBy] = useState<SortOption>('featured');

  const cities = useMemo(
    () => Array.from(new Set(institutions.map((i) => i.city))).sort(),
    [institutions]
  );

  const departments = useMemo(
    () => Array.from(new Set(institutions.map((i) => i.department))).sort(),
    [institutions]
  );

  const filteredInstitutions = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    const list = institutions.filter((inst) => {
      if (selectedCategory !== 'all' && inst.category_id !== selectedCategory) {
        return false;
      }
      if (selectedCity !== 'all' && inst.city !== selectedCity) {
        return false;
      }
      if (
        selectedDepartment !== 'all' &&
        inst.department !== selectedDepartment
      ) {
        return false;
      }
      if (selectedModality !== 'all' && inst.modality !== selectedModality) {
        return false;
      }
      if (q) {
        const hay = `${inst.name} ${inst.description} ${inst.city} ${inst.department} ${inst.address}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
      if (sortBy === 'city') return a.city.localeCompare(b.city);
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, [
    institutions,
    searchTerm,
    selectedCategory,
    selectedCity,
    selectedDepartment,
    selectedModality,
    sortBy,
  ]);

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedCategory !== 'all' ||
    selectedCity !== 'all' ||
    selectedDepartment !== 'all' ||
    selectedModality !== 'all';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('all');
    setSelectedCity('all');
    setSelectedDepartment('all');
    setSelectedModality('all');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#29243A] tracking-tight">
          Directorio de instituciones en Paraguay
        </h1>
        <p className="text-sm sm:text-base text-[#29243A]/75 max-w-2xl">
          Explorá academias, bibliotecas y centros de capacitación filtrando por categoría, ciudad, departamento o modalidad de cursado.
        </p>
      </div>

      {/* Category segmented filter tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
            selectedCategory === 'all'
              ? 'bg-[#5B3CC4] text-white shadow-xs'
              : 'bg-white border border-[#29243A]/12 text-[#29243A] hover:bg-[#A78BFA]/12'
          }`}
        >
          Todas ({institutions.length})
        </button>
        {categories.map((cat) => {
          const count = institutions.filter((i) => i.category_id === cat.id).length;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#5B3CC4] text-white shadow-xs'
                  : 'bg-white border border-[#29243A]/12 text-[#29243A] hover:bg-[#A78BFA]/12'
              }`}
            >
              {cat.name} ({count})
            </button>
          );
        })}
      </div>

      {/* Filter & Sort Panel */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-[#29243A]/10 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search
              className="w-4 h-4 text-[#5B3CC4] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <label htmlFor="inst-search" className="sr-only">
              Buscar institución por nombre
            </label>
            <input
              id="inst-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre o dirección..."
              className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-[#FFF9F5] border border-[#29243A]/12 text-sm text-[#29243A] focus:outline-none focus:border-[#5B3CC4]"
            />
          </div>

          {/* City */}
          <div>
            <label htmlFor="inst-city" className="sr-only">
              Filtrar por ciudad
            </label>
            <select
              id="inst-city"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#FFF9F5] border border-[#29243A]/12 text-sm text-[#29243A] focus:outline-none focus:border-[#5B3CC4]"
            >
              <option value="all">Todas las ciudades</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label htmlFor="inst-dept" className="sr-only">
              Filtrar por departamento
            </label>
            <select
              id="inst-dept"
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#FFF9F5] border border-[#29243A]/12 text-sm text-[#29243A] focus:outline-none focus:border-[#5B3CC4]"
            >
              <option value="all">Todos los departamentos</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Modality */}
          <div>
            <label htmlFor="inst-modality" className="sr-only">
              Filtrar por modalidad
            </label>
            <select
              id="inst-modality"
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
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#29243A]/8">
          <div className="text-xs font-semibold text-[#29243A]/70 font-mono-tabular">
            Mostrando {filteredInstitutions.length} de {institutions.length} instituciones
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#5B3CC4]" aria-hidden="true" />
              <label htmlFor="inst-sort" className="text-xs font-semibold text-[#29243A]/75">
                Ordenar:
              </label>
              <select
                id="inst-sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-2.5 py-1.5 rounded-lg bg-[#FFF9F5] border border-[#29243A]/12 text-xs font-semibold text-[#29243A]"
              >
                <option value="featured">Destacadas primero</option>
                <option value="name-asc">Nombre (A–Z)</option>
                <option value="name-desc">Nombre (Z–A)</option>
                <option value="city">Ciudad</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F4A6C1]/25 hover:bg-[#F4A6C1]/40 text-xs font-bold text-[#29243A] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Limpiar filtros</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* States */}
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
              className="h-96 rounded-2xl bg-white/70 border border-[#29243A]/8 animate-pulse"
            />
          ))}
        </div>
      ) : filteredInstitutions.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white border border-[#29243A]/10 text-center space-y-3">
          <h2 className="font-display text-xl font-bold text-[#29243A]">
            No encontramos instituciones con esos filtros
          </h2>
          <p className="text-sm text-[#29243A]/70 max-w-md mx-auto">
            Probá limpiando los filtros o buscando otra ciudad o categoría educativa.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-5 py-2.5 rounded-xl bg-[#5B3CC4] text-white text-sm font-bold cursor-pointer"
          >
            Ver todas las instituciones
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredInstitutions.map((inst) => (
            <InstitutionCard
              key={inst.id}
              institution={inst}
              onSelect={onSelectInstitution}
              onLocateOnMap={onLocateOnMap}
            />
          ))}
        </div>
      )}
    </div>
  );
}
