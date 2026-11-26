import { Bot, Minimize2, X } from 'lucide-react';
import type { ChatMessage } from '../types/edu';
import { ChatConversation } from './ChatConversation';

interface ChatbotWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  messages: ChatMessage[];
  isSending: boolean;
  onSendMessage: (text: string) => Promise<void>;
}

export function ChatbotWidget({
  isOpen,
  onToggle,
  onClose,
  messages,
  isSending,
  onSendMessage,
}: ChatbotWidgetProps) {
  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end">
      {isOpen && (
        <section
          aria-label="Ventana de conversación con EduPath AI"
          className="mb-3 w-[calc(100vw-2rem)] sm:w-[390px] rounded-3xl bg-[#FFF9F5] border border-[#29243A]/12 shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-[#A78BFA] to-[#F4A6C1] text-[#29243A] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/90 flex items-center justify-center shadow-xs">
                <Bot className="w-5 h-5 text-[#5B3CC4]" aria-hidden="true" />
              </div>
              <div>
                <h2 className="font-display text-sm font-bold leading-tight">
                  EduPath AI
                </h2>
                <p className="text-xs font-semibold text-[#29243A]/80">
                  Orientación educativa de Paraguay
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onClose}
                aria-label="Minimizar chat"
                className="w-8 h-8 rounded-lg hover:bg-white/40 flex items-center justify-center transition-colors cursor-pointer"
              >
                <Minimize2 className="w-4 h-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Cerrar chat"
                className="w-8 h-8 rounded-lg hover:bg-white/40 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            </div>
          </div>

          <ChatConversation
            messages={messages}
            isSending={isSending}
            onSendMessage={onSendMessage}
            compact={true}
          />
        </section>
      )}

      {/* Floating launcher button in lavender & pastel pink */}
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Ocultar asistente EduPath AI' : 'Abrir asistente EduPath AI'}
        className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#A78BFA] to-[#F4A6C1] text-[#29243A] font-display text-sm font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-150 cursor-pointer border border-white/70"
      >
        <Bot className="w-5 h-5 text-[#29243A]" aria-hidden="true" />
        <span>{isOpen ? 'Cerrar EduPath AI' : 'EduPath AI'}</span>
      </button>
    </div>
  );
}
