import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  MessageSquareHeart,
  Wallet,
} from 'lucide-react';
import type { Course } from '../types/edu';

interface CourseCardProps {
  course: Course;
  onAskAboutCourse?: (course: Course) => void;
  onInspectInstitution?: (institutionId: string) => void;
}

const AREA_SURFACE_ACCENT: Record<string, string> = {
  'Programación y Tecnología': 'from-[#A78BFA]/20 via-[#91C9F7]/15 to-white',
  Tecnología: 'from-[#A78BFA]/22 via-[#91C9F7]/18 to-white',
  'Diseño y Creatividad': 'from-[#F4A6C1]/25 via-[#FFE08A]/15 to-white',
  Diseño: 'from-[#F4A6C1]/25 via-[#FFE08A]/15 to-white',
  'Habilidades Digitales': 'from-[#A9D9BD]/25 via-[#91C9F7]/15 to-white',
  Educación: 'from-[#A9D9BD]/25 via-[#91C9F7]/15 to-white',
  Literatura: 'from-[#A9D9BD]/25 via-[#FFE08A]/18 to-white',
  Idiomas: 'from-[#FFE08A]/30 via-[#F4A6C1]/15 to-white',
  'Oficios y Energía': 'from-[#91C9F7]/25 via-[#A9D9BD]/20 to-white',
  Oficios: 'from-[#91C9F7]/25 via-[#A9D9BD]/20 to-white',
  Marketing: 'from-[#F4A6C1]/25 via-[#A78BFA]/15 to-white',
  'Arte y cultura': 'from-[#FFE08A]/28 via-[#F4A6C1]/20 to-white',
};

export function CourseCard({
  course,
  onAskAboutCourse,
  onInspectInstitution,
}: CourseCardProps) {
  const headerGradient =
    AREA_SURFACE_ACCENT[course.study_area] ||
    'from-[#A78BFA]/18 via-[#FFF9F5] to-white';

  return (
    <article className="flex flex-col bg-white rounded-2xl border border-[#29243A]/10 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
      <div className={`px-5 pt-5 pb-4 bg-gradient-to-br ${headerGradient} border-b border-[#29243A]/8`}>
        {/* Unboxed metadata kicker */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-[#29243A]/75 mb-2">
          <span className="text-[#5B3CC4]">{course.study_area}</span>
          <span aria-hidden="true" className="text-[#29243A]/30">·</span>
          <span>{course.modality}</span>
          {course.is_demo && (
            <>
              <span aria-hidden="true" className="text-[#29243A]/30">·</span>
              <span className="text-[#9A5B13]">Ejemplo demo</span>
            </>
          )}
        </div>

        <h3 className="font-display text-lg font-bold text-[#29243A] leading-snug">
          {course.title}
        </h3>
      </div>

      <div className="flex-1 p-5 flex flex-col">
        <p className="text-sm text-[#29243A]/75 leading-relaxed mb-4">
          {course.description}
        </p>

        <dl className="space-y-2 text-xs text-[#29243A]/80 mb-4">
          <div className="flex items-start gap-2">
            <Building2 className="w-3.5 h-3.5 text-[#5B3CC4] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <dt className="sr-only">Institución</dt>
              <dd className="font-semibold text-[#29243A]">
                {course.institution ? (
                  onInspectInstitution ? (
                    <button
                      type="button"
                      onClick={() => onInspectInstitution(course.institution!.id)}
                      className="text-left hover:text-[#5B3CC4] underline decoration-[#A78BFA]/60 underline-offset-2 cursor-pointer"
                    >
                      {course.institution.name} ({course.institution.city})
                    </button>
                  ) : (
                    `${course.institution.name} (${course.institution.city})`
                  )
                ) : (
                  'Institución registrada'
                )}
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Clock className="w-3.5 h-3.5 text-[#5B3CC4] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <dt className="sr-only">Duración</dt>
              <dd>Duración: {course.duration}</dd>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#5B3CC4] shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <dt className="sr-only">Horario</dt>
              <dd>{course.schedule}</dd>
            </div>
          </div>
        </dl>

        <div className="mt-auto pt-3 border-t border-[#29243A]/8 space-y-3">
          <div className="text-xs text-[#29243A]/70">
            <span className="font-semibold text-[#29243A]">Requisitos: </span>
            {course.requirements}
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              {course.is_free ? (
                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1B6B46]">
                  <CheckCircle2 className="w-4 h-4 shrink-0" aria-hidden="true" />
                  <span>{course.cost_display || 'Gratuito'}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 text-sm font-bold font-mono-tabular text-[#29243A]">
                  <Wallet className="w-4 h-4 text-[#5B3CC4] shrink-0" aria-hidden="true" />
                  <span>{course.cost_display}</span>
                </span>
              )}
            </div>

            {onAskAboutCourse && (
              <button
                type="button"
                onClick={() => onAskAboutCourse(course)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#A78BFA]/15 hover:bg-[#A78BFA]/28 text-[#29243A] text-xs font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <MessageSquareHeart className="w-3.5 h-3.5 text-[#5B3CC4]" aria-hidden="true" />
                <span>Consultar IA</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
