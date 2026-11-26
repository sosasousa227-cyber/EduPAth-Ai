import {
  Clock,
  Compass,
  ExternalLink,
  Globe,
  Info,
  Mail,
  MapPin,
  Phone,
  X,
} from 'lucide-react';
import { useEffect } from 'react';
import { resolveInstitutionImage, sanitizeExternalUrl } from '../lib/mediaFallbacks';
import type { Course, Institution } from '../types/edu';

interface InstitutionModalProps {
  institution: Institution | null;
  courses: Course[];
  onClose: () => void;
  onLocateOnMap: (institution: Institution) => void;
}

export function InstitutionModal({
  institution,
  courses,
  onClose,
  onLocateOnMap,
}: InstitutionModalProps) {
  useEffect(() => {
    if (!institution) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [institution, onClose]);

  if (!institution) return null;

  const safeWebsite = sanitizeExternalUrl(institution.website);
  const imageSrc = resolveInstitutionImage(institution.image_url, institution.category);
  const institutionCourses = courses.filter(
    (c) => c.institution_id === institution.id
  );
  const osmDirectionsUrl = `https://www.openstreetmap.org/directions?to=${institution.latitude},${institution.longitude}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="institution-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#29243A]/45 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl border border-[#29243A]/10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalle de institución"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-xl bg-white/95 hover:bg-white text-[#29243A] border border-[#29243A]/12 flex items-center justify-center shadow-sm cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Banner */}
        <div className="relative h-56 sm:h-64 w-full bg-[#F5F1FA]">
          <img
            src={imageSrc}
            alt={institution.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#29243A]/75 via-[#29243A]/20 to-transparent" />
          <div className="absolute bottom-4 left-6 right-16 text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-white/90 mb-1">
              <span>{institution.category?.name || 'Institución'}</span>
              <span aria-hidden="true">·</span>
              <span>{institution.modality}</span>
              <span aria-hidden="true">·</span>
              <span>
                {institution.city}, {institution.department}
              </span>
            </div>
            <h2
              id="institution-modal-title"
              className="font-display text-2xl sm:text-3xl font-bold leading-tight"
            >
              {institution.name}
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {institution.is_demo && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#FFE08A]/35 border border-[#EAB308]/30 text-sm text-[#29243A]">
              <Info className="w-5 h-5 text-[#9A5B13] shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <span className="font-bold">Ubicación de demostración: </span>
                Esta ficha forma parte de las cinco ubicaciones de ejemplo iniciales en Paraguay para explorar las capacidades de la plataforma.
              </div>
            </div>
          )}

          <div>
            <h3 className="font-display text-base font-bold text-[#29243A] mb-2">
              Acerca de la institución
            </h3>
            <p className="text-sm sm:text-base text-[#29243A]/80 leading-relaxed">
              {institution.description}
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#29243A]/8 space-y-2.5 text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#5B3CC4] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="font-bold text-[#29243A]">Dirección</div>
                  <div className="text-[#29243A]/75">
                    {institution.address} — {institution.city}, {institution.department}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#5B3CC4] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="font-bold text-[#29243A]">Horarios</div>
                  <div className="text-[#29243A]/75">{institution.schedule}</div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Compass className="w-4 h-4 text-[#5B3CC4] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="font-bold text-[#29243A]">Coordenadas</div>
                  <div className="font-mono-tabular text-xs text-[#29243A]/75">
                    {institution.latitude.toFixed(4)}, {institution.longitude.toFixed(4)}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#FFF9F5] border border-[#29243A]/8 space-y-2.5 text-sm">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-[#5B3CC4] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="font-bold text-[#29243A]">Teléfono</div>
                  <div className="text-[#29243A]/75">
                    {institution.phone || 'No especificado'}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#5B3CC4] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="font-bold text-[#29243A]">Correo electrónico</div>
                  <div className="text-[#29243A]/75 break-all">
                    {institution.email || 'No especificado'}
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Globe className="w-4 h-4 text-[#5B3CC4] shrink-0 mt-0.5" aria-hidden="true" />
                <div>
                  <div className="font-bold text-[#29243A]">Sitio web</div>
                  {safeWebsite ? (
                    <a
                      href={safeWebsite}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#5B3CC4] font-semibold hover:underline break-all"
                    >
                      <span>Visitar enlace</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    </a>
                  ) : (
                    <div className="text-[#29243A]/75">No disponible</div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Courses at this institution */}
          <div className="pt-2 border-t border-[#29243A]/10">
            <h3 className="font-display text-base font-bold text-[#29243A] mb-3">
              Cursos y capacitaciones disponibles ({institutionCourses.length})
            </h3>
            {institutionCourses.length === 0 ? (
              <p className="text-sm text-[#29243A]/65">
                No hay cursos registrados para esta institución por el momento.
              </p>
            ) : (
              <div className="space-y-2.5">
                {institutionCourses.map((course) => (
                  <div
                    key={course.id}
                    className="p-3.5 rounded-xl bg-[#FFF9F5] border border-[#29243A]/8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                  >
                    <div>
                      <div className="font-semibold text-sm text-[#29243A]">
                        {course.title}
                      </div>
                      <div className="text-xs text-[#29243A]/70">
                        {course.study_area} · {course.modality} · {course.duration}
                      </div>
                    </div>
                    <div className="text-xs font-bold font-mono-tabular text-[#5B3CC4] shrink-0">
                      {course.is_free ? 'Gratuito' : course.cost_display}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => {
                onClose();
                onLocateOnMap(institution);
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#5B3CC4] hover:bg-[#4C31A8] text-white text-sm font-semibold transition-colors cursor-pointer"
            >
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>Ver en el mapa interactivo</span>
            </button>

            <a
              href={osmDirectionsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#29243A]/15 hover:border-[#A78BFA] bg-white text-[#29243A] text-sm font-semibold transition-colors"
            >
              <Compass className="w-4 h-4 text-[#5B3CC4]" aria-hidden="true" />
              <span>Cómo llegar (OpenStreetMap)</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-60" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
