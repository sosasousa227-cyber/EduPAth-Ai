import { BookOpenCheck, Code2, Compass, GraduationCap } from 'lucide-react';
import { ChatConversation } from '../components/ChatConversation';
import { AI_EMBLEM_ILLUSTRATION } from '../lib/mediaFallbacks';
import type { ChatMessage, DataSourceStatus } from '../types/edu';

interface AssistantPageProps {
  messages: ChatMessage[];
  isSending: boolean;
  onSendMessage: (text: string) => Promise<void>;
  institutionsCount: number;
  coursesCount: number;
  dataSource: DataSourceStatus;
}

export function AssistantPage({
  messages,
  isSending,
  onSendMessage,
  institutionsCount,
  coursesCount,
  dataSource,
}: AssistantPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Info Column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-[#29243A]/10 shadow-xs space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-[#29243A]/10 bg-[#FFF9F5] shrink-0">
                <img
                  src={AI_EMBLEM_ILLUSTRATION}
                  alt="Ilustración de EduPath AI"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#29243A]">
                  EduPath AI
                </h1>
                <p className="text-xs font-semibold text-[#5B3CC4] mt-0.5">
                  Asistente educativo inteligente de Paraguay
                </p>
              </div>
            </div>

            <p className="text-sm text-[#29243A]/80 leading-relaxed">
              Conversá en lenguaje natural para recibir recomendaciones reales del catálogo de EduPath AI, descubrir cursos gratuitos y resolver dudas sobre programación, informática o rutas de aprendizaje.
            </p>

            <div className="p-3.5 rounded-2xl bg-[#FFF9F5] border border-[#29243A]/8 text-xs text-[#29243A]/80 space-y-1">
              <div className="font-bold text-[#29243A]">
                Catálogo conectado al asistente
              </div>
              <div className="font-mono-tabular">
                {institutionsCount} instituciones · {coursesCount} cursos
              </div>
              <div className="text-[#5B3CC4] font-semibold">
                {dataSource === 'supabase'
                  ? 'Consultando base de datos en Supabase en tiempo real'
                  : 'Usando las 5 ubicaciones de demostración (conectá Supabase para tu base propia)'}
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <h2 className="font-display text-sm font-bold text-[#29243A]">
                ¿En qué te puede ayudar?
              </h2>
              <ul className="space-y-2.5 text-sm text-[#29243A]/80">
                <li className="flex items-start gap-2.5">
                  <GraduationCap className="w-4 h-4 text-[#5B3CC4] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Recomendar academias, bibliotecas y centros registrados en Paraguay.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <BookOpenCheck className="w-4 h-4 text-[#5B3CC4] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Encontrar cursos gratuitos, virtuales, presenciales o híbridos.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Code2 className="w-4 h-4 text-[#5B3CC4] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Explicar conceptos de programación, lógica, bases de datos e informática.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Compass className="w-4 h-4 text-[#5B3CC4] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>Orientar tus próximos pasos de estudio sin inventar datos ni precios.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Interactive Chat Studio */}
        <div className="lg:col-span-7 bg-[#FFF9F5] rounded-3xl border border-[#29243A]/12 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 bg-gradient-to-r from-[#A78BFA]/30 via-[#F4A6C1]/25 to-[#91C9F7]/25 border-b border-[#29243A]/10">
            <h2 className="font-display text-base font-bold text-[#29243A]">
              Sesión de orientación educativa
            </h2>
            <p className="text-xs text-[#29243A]/70">
              El historial se conserva durante tu visita actual. Acceso público sin registro.
            </p>
          </div>

          <ChatConversation
            messages={messages}
            isSending={isSending}
            onSendMessage={onSendMessage}
            compact={false}
          />
        </div>
      </div>
    </div>
  );
}
