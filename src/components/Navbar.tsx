import { Menu, MessageSquareHeart, X } from 'lucide-react';
import { useState } from 'react';
import type { NavSection } from '../types/edu';

interface NavbarProps {
  activeSection: NavSection;
  onNavigate: (section: NavSection) => void;
  onOpenChat: () => void;
}

const NAV_ITEMS: Array<{ id: NavSection; label: string }> = [
  { id: 'inicio', label: 'Inicio' },
  { id: 'instituciones', label: 'Instituciones' },
  { id: 'cursos', label: 'Cursos' },
  { id: 'mapa', label: 'Mapa' },
  { id: 'asistente', label: 'EduPath AI' },
];

export function Navbar({ activeSection, onNavigate, onOpenChat }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelect = (section: NavSection) => {
    onNavigate(section);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F5]/95 backdrop-blur-md border-b border-[#29243A]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand mark (single-line wordmark) */}
        <button
          type="button"
          onClick={() => handleSelect('inicio')}
          className="flex items-center gap-2.5 text-left whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5B3CC4] rounded-lg cursor-pointer"
        >
          <span
            aria-hidden="true"
            className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#A78BFA] to-[#F4A6C1] flex items-center justify-center shadow-sm"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4.5 h-4.5 text-white"
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
          <span className="font-display text-lg font-bold tracking-tight text-[#29243A]">
            EduPath AI
          </span>
        </button>

        {/* Zone 2: Clean typography nav links (desktop) */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#29243A]/75"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#5B3CC4] ${
                  isActive
                    ? 'text-[#5B3CC4]'
                    : 'hover:text-[#29243A]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 -bottom-0.5 h-0.5 rounded-full bg-[#A78BFA]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary CTA + mobile drawer toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenChat}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#5B3CC4] hover:bg-[#4C31A8] text-white text-sm font-semibold shadow-sm transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#5B3CC4]"
          >
            <MessageSquareHeart className="w-4 h-4" aria-hidden="true" />
            <span>Consultar IA</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            className="md:hidden inline-flex items-center justify-center w-11 h-11 rounded-xl border border-[#29243A]/12 bg-white text-[#29243A] hover:bg-[#A78BFA]/10 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#29243A]/10 bg-white px-4 py-4 space-y-1 shadow-lg">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#A78BFA]/15 text-[#5B3CC4]'
                    : 'text-[#29243A] hover:bg-[#FFF9F5]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false);
                onOpenChat();
              }}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#5B3CC4] text-white text-sm font-semibold cursor-pointer"
            >
              <MessageSquareHeart className="w-4 h-4" aria-hidden="true" />
              <span>Hablar con EduPath AI</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
