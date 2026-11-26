import type { NavSection } from '../types/edu';

interface FooterProps {
  onNavigate: (section: NavSection) => void;
}

export function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="mt-20 border-t border-[#29243A]/10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#A78BFA] to-[#F4A6C1] flex items-center justify-center"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
                  <path d="m9 10 2 2 4-4" />
                </svg>
              </span>
              <span className="font-display text-lg font-bold text-[#29243A]">
                EduPath AI
              </span>
            </div>
            <p className="text-sm text-[#29243A]/70 leading-relaxed max-w-sm">
              Plataforma educativa pública de Paraguay para descubrir academias, bibliotecas, centros de capacitación, cursos y orientación con inteligencia artificial.
            </p>
          </div>

          <div>
            <h3 className="font-display text-sm font-bold text-[#29243A] mb-3">
              Explorar plataforma
            </h3>
            <ul className="space-y-2 text-sm text-[#29243A]/75">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('inicio')}
                  className="hover:text-[#5B3CC4] transition-colors cursor-pointer"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('instituciones')}
                  className="hover:text-[#5B3CC4] transition-colors cursor-pointer"
                >
                  Directorio de instituciones
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('cursos')}
                  className="hover:text-[#5B3CC4] transition-colors cursor-pointer"
                >
                  Cursos y capacitaciones
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('mapa')}
                  className="hover:text-[#5B3CC4] transition-colors cursor-pointer"
                >
                  Mapa interactivo de Paraguay
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('asistente')}
                  className="hover:text-[#5B3CC4] transition-colors cursor-pointer"
                >
                  Asistente EduPath AI
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="font-display text-sm font-bold text-[#29243A] mb-2">
              Acceso abierto y tecnología
            </h3>
            <p className="text-sm text-[#29243A]/70 leading-relaxed">
              Navegación libre sin registro ni cuentas de usuario. Cartografía abierta con OpenStreetMap y Leaflet, catálogo público en Supabase y orientación educativa impulsada por Gemini.
            </p>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#29243A]/8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#29243A]/60">
          <p>EduPath AI · Oportunidades educativas en Paraguay</p>
          <p>Asunción · Central · Alto Paraná · Itapúa</p>
        </div>
      </div>
    </footer>
  );
}
