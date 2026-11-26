import { MapPin } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ParaguayMap } from '../components/ParaguayMap';
import type { Category, Institution } from '../types/edu';

interface MapPageProps {
  categories: Category[];
  institutions: Institution[];
  focusedInstitution: Institution | null;
  onFocusInstitution: (institution: Institution) => void;
  onSelectInstitution: (institution: Institution) => void;
}

const EXCLUDED_MAP_SLUGS = new Set([
  'tecnologia',
  'idiomas',
  'arte-y-cultura',
  'oficios',
  'educacion',
]);

export function MapPage({
  categories,
  institutions,
  focusedInstitution,
  onFocusInstitution,
  onSelectInstitution,
}: MapPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const mapCategories = useMemo(
    () => categories.filter((cat) => !EXCLUDED_MAP_SLUGS.has(cat.slug)),
    [categories]
  );

  const visibleInstitutions = useMemo(() => {
    if (selectedCategory === 'all') return institutions;
    return institutions.filter((i) => i.category_id === selectedCategory);
  }, [institutions, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="font-display text-3xl sm:text-4xl font-extrabold text-[#29243A] tracking-tight">
            Mapa interactivo de Paraguay
          </h1>
          <p className="text-sm sm:text-base text-[#29243A]/75 max-w-2xl">
            Explorá las instituciones sobre OpenStreetMap. Seleccioná un marcador para ver su ficha completa o calcular tu ruta abierta.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-[#5B3CC4] text-white'
                : 'bg-white border border-[#29243A]/12 text-[#29243A] hover:bg-[#A78BFA]/12'
            }`}
          >
            Todas ({institutions.length})
          </button>
          {mapCategories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#5B3CC4] text-white'
                  : 'bg-white border border-[#29243A]/12 text-[#29243A] hover:bg-[#A78BFA]/12'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-8">
          <ParaguayMap
            institutions={visibleInstitutions}
            focusedInstitution={focusedInstitution}
            onSelectInstitution={onSelectInstitution}
          />
        </div>

        {/* Side directory list synchronized with map */}
        <aside className="lg:col-span-4 bg-white rounded-3xl border border-[#29243A]/10 p-4 shadow-xs space-y-3 max-h-[620px] overflow-y-auto">
          <h2 className="font-display text-base font-bold text-[#29243A] px-1">
            Ubicaciones en pantalla ({visibleInstitutions.length})
          </h2>

          {visibleInstitutions.length === 0 ? (
            <p className="text-sm text-[#29243A]/65 px-1 py-4">
              No hay instituciones para mostrar en esta categoría.
            </p>
          ) : (
            <div className="space-y-2.5">
              {visibleInstitutions.map((inst) => {
                const isSelected = focusedInstitution?.id === inst.id;
                return (
                  <div
                    key={inst.id}
                    className={`p-3.5 rounded-2xl border transition-colors ${
                      isSelected
                        ? 'bg-[#A78BFA]/15 border-[#5B3CC4]/45'
                        : 'bg-[#FFF9F5] border-[#29243A]/8 hover:border-[#A78BFA]/45'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-[#5B3CC4] mb-1">
                      <span>{inst.category?.name}</span>
                      {inst.is_demo && (
                        <span className="text-[#9A5B13]">Demostración</span>
                      )}
                    </div>
                    <h3 className="font-display text-sm font-bold text-[#29243A] leading-snug">
                      {inst.name}
                    </h3>
                    <p className="text-xs text-[#29243A]/70 mt-1">
                      {inst.city}, {inst.department}
                    </p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onFocusInstitution(inst)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-[#29243A]/12 hover:border-[#5B3CC4] text-xs font-bold text-[#29243A] cursor-pointer"
                      >
                        <MapPin className="w-3 h-3 text-[#5B3CC4]" aria-hidden="true" />
                        <span>Centrar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectInstitution(inst)}
                        className="px-2.5 py-1.5 rounded-lg bg-[#5B3CC4] text-white text-xs font-bold cursor-pointer"
                      >
                        Ver ficha
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
