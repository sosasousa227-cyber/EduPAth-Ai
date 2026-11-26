import {
  ArrowRight,
  BookOpen,
  Bot,
  Compass,
  Cpu,
  GraduationCap,
  Languages,
  MapPin,
  Search,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';
import { CourseCard } from '../components/CourseCard';
import { InstitutionCard } from '../components/InstitutionCard';
import { AI_EMBLEM_ILLUSTRATION, HERO_ILLUSTRATION } from '../lib/mediaFallbacks';
import type { Category, Course, Institution, NavSection } from '../types/edu';

interface HomePageProps {
  categories: Category[];
  institutions: Institution[];
  courses: Course[];
  loading: boolean;
  onNavigate: (section: NavSection) => void;
  onSearchGlobal: (query: string) => void;
  onFilterCategory: (categoryId: string) => void;
  onSelectInstitution: (institution: Institution) => void;
  onLocateOnMap: (institution: Institution) => void;
  onAskAboutCourse: (course: Course) => void;
  onOpenChat: () => void;
}

const CATEGORY_STYLE: Record<
  string,
  { bg: string; border: string; icon: typeof GraduationCap }
> = {
  academias: {
    bg: 'bg-[#A78BFA]/15 hover:bg-[#A78BFA]/24',
    border: 'border-[#A78BFA]/35',
    icon: GraduationCap,
  },
  bibliotecas: {
    bg: 'bg-[#A9D9BD]/22 hover:bg-[#A9D9BD]/35',
    border: 'border-[#A9D9BD]/45',
    icon: BookOpen,
  },
  'centros-de-capacitacion': {
    bg: 'bg-[#91C9F7]/22 hover:bg-[#91C9F7]/35',
    border: 'border-[#91C9F7]/45',
    icon: Wrench,
  },
  tecnologia: {
    bg: 'bg-[#F4A6C1]/20 hover:bg-[#F4A6C1]/32',
    border: 'border-[#F4A6C1]/45',
    icon: Cpu,
  },
  idiomas: {
    bg: 'bg-[#FFE08A]/28 hover:bg-[#FFE08A]/42',
    border: 'border-[#FFE08A]/60',
    icon: Languages,
  },
};

export function HomePage({
  categories,
  institutions,
  courses,
  loading,
  onNavigate,
  onSearchGlobal,
  onFilterCategory,
  onSelectInstitution,
  onLocateOnMap,
  onAskAboutCourse,
  onOpenChat,
}: HomePageProps) {
  const [heroQuery, setHeroQuery] = useState('');

  const featuredInstitutions = (
    institutions.filter((i) => i.is_featured).length > 0
      ? institutions.filter((i) => i.is_featured)
      : institutions
  ).slice(0, 3);

  const featuredCourses = (
    courses.filter((c) => c.is_featured).length > 0
      ? courses.filter((c) => c.is_featured)
      : courses
  ).slice(0, 3);

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchGlobal(heroQuery.trim());
  };

  return (
    <div className="space-y-20 pb-8">
      {/* HERO PRINCIPAL */}
      <section className="relative overflow-hidden pt-10 sm:pt-14 pb-8">
        {/* Soft pastel ambient shapes */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#A78BFA]/18 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-10 right-0 w-72 h-72 rounded-full bg-[#F4A6C1]/20 blur-3xl"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left column */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <p className="text-sm font-bold tracking-wide text-[#5B3CC4]">
                Plataforma educativa abierta · Paraguay
              </p>

              <h1
                className="font-display font-extrabold tracking-tight text-[#29243A] leading-[1.12] [text-wrap:balance]"
                style={{ fontSize: 'clamp(2.2rem, 4vw, 3.5rem)' }}
              >
                Tu camino hacia nuevas oportunidades comienza aquí
              </h1>

              <p className="text-base sm:text-lg text-[#29243A]/80 leading-relaxed max-w-2xl">
                Descubrí academias, bibliotecas y centros de capacitación en Paraguay. Explorá nuevas oportunidades de aprendizaje con EduPath AI.
              </p>

              {/* Main Search Bar */}
              <form
                onSubmit={handleHeroSubmit}
                className="flex flex-col sm:flex-row gap-2.5 p-2 rounded-2xl bg-white border border-[#29243A]/12 shadow-sm max-w-2xl"
              >
                <div className="relative flex-1 flex items-center">
                  <Search
                    className="w-4.5 h-4.5 text-[#5B3CC4] absolute left-3.5 pointer-events-none"
                    aria-hidden="true"
                  />
                  <label htmlFor="hero-search-input" className="sr-only">
                    Buscar instituciones, ciudades o cursos
                  </label>
                  <input
                    id="hero-search-input"
                    type="text"
                    value={heroQuery}
                    onChange={(e) => setHeroQuery(e.target.value)}
                    placeholder="Buscá por institución, ciudad o área de estudio..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-transparent text-sm text-[#29243A] placeholder:text-[#29243A]/45 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#5B3CC4] hover:bg-[#4C31A8] text-white text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  Buscar ahora
                </button>
              </form>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onNavigate('instituciones')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#A78BFA]/22 hover:bg-[#A78BFA]/35 text-[#29243A] text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Explorar instituciones</span>
                  <ArrowRight className="w-4 h-4 text-[#5B3CC4]" aria-hidden="true" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('cursos')}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-[#FFF9F5] border border-[#29243A]/15 text-[#29243A] text-sm font-bold transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <span>Descubrir cursos</span>
                </button>
              </div>
            </div>

            {/* Right column: Editorial illustration */}
            <div className="lg:col-span-5 flex">
              <div className="relative w-full rounded-3xl overflow-hidden border border-[#29243A]/10 bg-white shadow-md flex">
                <img
                  src={HERO_ILLUSTRATION}
                  alt="Estudiantes en Paraguay aprendiendo en un espacio educativo luminoso"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover min-h-[280px]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS EDUCATIVAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#29243A] tracking-tight">
              Categorías educativas
            </h2>
            <p className="text-sm sm:text-base text-[#29243A]/75 mt-1">
              Elegí el tipo de espacio de aprendizaje que mejor acompaña tus metas.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const style =
              CATEGORY_STYLE[cat.slug] || CATEGORY_STYLE.academias;
            const Icon = style.icon;
            const count = institutions.filter(
              (i) => i.category_id === cat.id
            ).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onFilterCategory(cat.id)}
                className={`text-left p-6 rounded-3xl border ${style.border} ${style.bg} transition-all duration-200 hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between gap-4`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/90 border border-[#29243A]/8 flex items-center justify-center shadow-xs">
                    <Icon className="w-6 h-6 text-[#5B3CC4]" aria-hidden="true" />
                  </div>
                  <span className="font-mono-tabular text-xs font-bold text-[#29243A]/70">
                    {count} {count === 1 ? 'espacio' : 'espacios'}
                  </span>
                </div>

                <div>
                  <h3 className="font-display text-xl font-bold text-[#29243A] mb-1.5">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-[#29243A]/75 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <span className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5B3CC4]">
                  <span>Explorar categoría</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* INSTITUCIONES DESTACADAS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#29243A] tracking-tight">
              Instituciones destacadas
            </h2>
            <p className="text-sm sm:text-base text-[#29243A]/75 mt-1">
              Espacios educativos registrados en distintos puntos de Paraguay.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('instituciones')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5B3CC4] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Ver directorio completo</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-96 rounded-2xl bg-white/70 border border-[#29243A]/8 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredInstitutions.map((inst) => (
              <InstitutionCard
                key={inst.id}
                institution={inst}
                onSelect={onSelectInstitution}
                onLocateOnMap={onLocateOnMap}
              />
            ))}
          </div>
        )}
      </section>

      {/* CURSOS RECOMENDADOS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#29243A] tracking-tight">
              Cursos recomendados
            </h2>
            <p className="text-sm sm:text-base text-[#29243A]/75 mt-1">
              Opciones presenciales, virtuales e híbridas, incluyendo cursos gratuitos.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('cursos')}
            className="inline-flex items-center gap-1.5 text-sm font-bold text-[#5B3CC4] hover:underline whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span>Explorar todos los cursos</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="h-80 rounded-2xl bg-white/70 border border-[#29243A]/8 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
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
      </section>

      {/* PRESENTACIÓN DEL MAPA + ASISTENTE INTELIGENTE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* Map Showcase */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#91C9F7]/25 via-white to-[#A9D9BD]/20 border border-[#29243A]/10 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-white border border-[#29243A]/10 flex items-center justify-center shadow-xs">
                <Compass className="w-6 h-6 text-[#5B3CC4]" aria-hidden="true" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[#29243A]">
                Mapa interactivo de Paraguay
              </h2>
              <p className="text-sm sm:text-base text-[#29243A]/75 leading-relaxed">
                Visualizá academias, bibliotecas y centros de capacitación en todo el país con OpenStreetMap. Activá tu ubicación actual para medir distancias y consultar rutas abiertas sin barreras.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate('mapa')}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#5B3CC4] hover:bg-[#4C31A8] text-white text-sm font-bold transition-colors cursor-pointer"
              >
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span>Abrir mapa interactivo</span>
              </button>
            </div>
          </div>

          {/* EduPath AI Showcase */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#A78BFA]/20 via-white to-[#F4A6C1]/22 border border-[#29243A]/10 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden border border-[#29243A]/10 bg-[#FFF9F5] shrink-0">
              <img
                src={AI_EMBLEM_ILLUSTRATION}
                alt="Ilustración del asistente EduPath AI"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4 flex-1">
              <div>
                <h2 className="font-display text-2xl font-bold text-[#29243A] mb-2">
                  Orientación con EduPath AI
                </h2>
                <p className="text-sm text-[#29243A]/75 leading-relaxed">
                  Consultá en lenguaje natural sobre cursos gratuitos, instituciones registradas o conceptos de programación e informática. El asistente responde usando únicamente datos reales del catálogo.
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                <button
                  type="button"
                  onClick={onOpenChat}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#A78BFA] to-[#F4A6C1] text-[#29243A] text-sm font-bold shadow-xs hover:opacity-95 transition-opacity cursor-pointer"
                >
                  <Bot className="w-4 h-4" aria-hidden="true" />
                  <span>Abrir chat</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('asistente')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#29243A]/15 text-[#29243A] text-sm font-bold hover:bg-[#FFF9F5] transition-colors cursor-pointer"
                >
                  <span>Ir a EduPath AI</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFICIOS DE EDUPATH AI */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#29243A] tracking-tight">
            ¿Por qué usar EduPath AI?
          </h2>
          <p className="text-sm sm:text-base text-[#29243A]/75 mt-1">
            Diseñada para facilitar el acceso al aprendizaje en todo Paraguay.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              title: '01. Acceso 100% público',
              body: 'Explorá todo el catálogo, mapas y orientaciones sin crear cuentas ni recordar contraseñas.',
              tint: 'bg-[#A78BFA]/12',
            },
            {
              title: '02. Información centralizada',
              body: 'Academias, bibliotecas y centros de capacitación reunidos con horarios, costos y modalidades claras.',
              tint: 'bg-[#F4A6C1]/18',
            },
            {
              title: '03. Cartografía abierta',
              body: 'Ubicaciones exactas en Paraguay sobre OpenStreetMap con rutas abiertas y geolocalización opcional.',
              tint: 'bg-[#91C9F7]/20',
            },
            {
              title: '04. Guía inteligente real',
              body: 'Asistente conectado al catálogo real para recomendar cursos gratuitos y explicar temas tecnológicos.',
              tint: 'bg-[#A9D9BD]/22',
            },
          ].map((item) => (
            <div
              key={item.title}
              className={`p-6 rounded-2xl ${item.tint} border border-[#29243A]/8 space-y-2`}
            >
              <h3 className="font-display text-base font-bold text-[#29243A]">
                {item.title}
              </h3>
              <p className="text-sm text-[#29243A]/75 leading-relaxed">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
