import { ArrowUpRight, Clock, MapPin } from 'lucide-react';
import { useState } from 'react';
import { resolveInstitutionImage } from '../lib/mediaFallbacks';
import type { Institution } from '../types/edu';

interface InstitutionCardProps {
  institution: Institution;
  onSelect: (institution: Institution) => void;
  onLocateOnMap?: (institution: Institution) => void;
}

const CATEGORY_STRIP_COLOR: Record<string, string> = {
  academias: 'bg-[#A78BFA]',
  bibliotecas: 'bg-[#A9D9BD]',
  'centros-de-capacitacion': 'bg-[#91C9F7]',
};

export function InstitutionCard({
  institution,
  onSelect,
  onLocateOnMap,
}: InstitutionCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const imageSrc = resolveInstitutionImage(institution.image_url, institution.category);
  const slug = institution.category?.slug || 'academias';
  const stripColor = CATEGORY_STRIP_COLOR[slug] || 'bg-[#A78BFA]';

  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-[#29243A]/10 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      {/* Top pastel identity bar */}
      <div className={`h-1.5 w-full ${stripColor}`} aria-hidden="true" />

      {/* Media container 4:3 with guaranteed fallback */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#F5F1FA]">
        {!imgFailed ? (
          <img
            src={imageSrc}
            alt={`Instalaciones de ${institution.name}`}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#A78BFA]/20 via-[#FFF9F5] to-[#91C9F7]/25">
            <MapPin className="w-8 h-8 text-[#5B3CC4] mb-2" aria-hidden="true" />
            <span className="font-display text-sm font-semibold text-[#29243A]">
              {institution.category?.name || 'Institución educativa'}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-5 flex flex-col">
        {/* Clean unboxed metadata kicker */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-[#5B3CC4] mb-2">
          <span>{institution.category?.name || 'Institución'}</span>
          <span aria-hidden="true" className="text-[#29243A]/30">·</span>
          <span className="text-[#29243A]/70">{institution.modality}</span>
          {institution.is_demo && (
            <>
              <span aria-hidden="true" className="text-[#29243A]/30">·</span>
              <span className="text-[#9A5B13]">Ubicación de demostración</span>
            </>
          )}
        </div>

        <h3 className="font-display text-lg font-bold text-[#29243A] leading-snug mb-2">
          {institution.name}
        </h3>

        <p className="text-sm text-[#29243A]/75 leading-relaxed line-clamp-2 mb-4">
          {institution.description}
        </p>

        <div className="mt-auto space-y-1.5 pt-3 border-t border-[#29243A]/8 text-xs text-[#29243A]/70">
          <div className="flex items-start gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#5B3CC4] shrink-0 mt-0.5" aria-hidden="true" />
            <span className="line-clamp-1">
              {institution.city}, {institution.department} — {institution.address}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="w-3.5 h-3.5 text-[#5B3CC4] shrink-0 mt-0.5" aria-hidden="true" />
            <span className="line-clamp-1">{institution.schedule}</span>
          </div>
        </div>

        <div className="mt-4 pt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onSelect(institution)}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#A78BFA]/18 hover:bg-[#A78BFA]/30 text-[#29243A] text-sm font-bold transition-colors cursor-pointer"
          >
            <span>Ver detalles</span>
            <ArrowUpRight className="w-4 h-4 text-[#5B3CC4]" aria-hidden="true" />
          </button>

          {onLocateOnMap && (
            <button
              type="button"
              onClick={() => onLocateOnMap(institution)}
              aria-label={`Ubicar ${institution.name} en el mapa`}
              className="inline-flex items-center justify-center px-3 py-2.5 rounded-xl border border-[#29243A]/12 hover:border-[#A78BFA] hover:bg-[#FFF9F5] text-[#29243A] text-sm font-semibold transition-colors cursor-pointer"
              title="Ver en el mapa"
            >
              <MapPin className="w-4 h-4 text-[#5B3CC4]" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
