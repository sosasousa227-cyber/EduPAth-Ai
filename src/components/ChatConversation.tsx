import { AlertCircle, Bot, Send, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { ChatMessage } from '../types/edu';

interface ChatConversationProps {
  messages: ChatMessage[];
  isSending: boolean;
  onSendMessage: (text: string) => Promise<void>;
  compact?: boolean;
}

const STARTER_QUESTIONS = [
  '¿Qué cursos gratuitos hay disponibles?',
  'Busco cursos de programación en Paraguay',
  '¿Qué bibliotecas o academias hay en Asunción?',
  'Explicame qué es una API REST de forma sencilla',
];

export function ChatConversation({
  messages,
  isSending,
  onSendMessage,
  compact = false,
}: ChatConversationProps) {
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isSending) return;
    setInput('');
    await onSendMessage(trimmed);
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Messages stream */}
      <div
        className={`flex-1 overflow-y-auto px-4 py-4 space-y-4 ${
          compact ? 'max-h-[380px]' : 'min-h-[380px] max-h-[540px]'
        }`}
      >
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                isUser ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                aria-hidden="true"
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-[#91C9F7]/35 text-[#29243A]'
                    : msg.isError
                      ? 'bg-[#F4A6C1]/40 text-[#991B1B]'
                      : 'bg-gradient-to-br from-[#A78BFA] to-[#F4A6C1] text-white'
                }`}
              >
                {isUser ? (
                  <User className="w-4 h-4" />
                ) : msg.isError ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  isUser
                    ? 'bg-[#5B3CC4] text-white rounded-tr-sm'
                    : msg.isError
                      ? 'bg-[#FFF1F5] border border-[#F4A6C1] text-[#7F1D1D] rounded-tl-sm'
                      : 'bg-white border border-[#29243A]/10 text-[#29243A] rounded-tl-sm shadow-xs'
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}

        {isSending && (
          <div className="flex items-start gap-2.5">
            <div
              aria-hidden="true"
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#A78BFA] to-[#F4A6C1] text-white flex items-center justify-center shrink-0"
            >
              <Bot className="w-4 h-4" />
            </div>
            <div className="rounded-2xl rounded-tl-sm px-4 py-3 bg-white border border-[#29243A]/10 text-xs font-semibold text-[#29243A]/70">
              EduPath AI está escribiendo...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Quick prompts when conversation just started */}
      {messages.length <= 1 && !isSending && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {STARTER_QUESTIONS.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => void onSendMessage(q)}
              className="text-left px-3 py-1.5 rounded-xl bg-[#A78BFA]/12 hover:bg-[#A78BFA]/22 border border-[#A78BFA]/25 text-xs font-semibold text-[#29243A] transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input form */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-[#29243A]/10 bg-white flex items-center gap-2"
      >
        <label htmlFor={compact ? 'chat-widget-input' : 'chat-page-input'} className="sr-only">
          Escribí tu consulta para EduPath AI
        </label>
        <input
          id={compact ? 'chat-widget-input' : 'chat-page-input'}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          maxLength={1000}
          placeholder="Preguntá sobre cursos, instituciones o tecnología..."
          className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl bg-[#FFF9F5] border border-[#29243A]/12 text-sm text-[#29243A] placeholder:text-[#29243A]/45 focus:outline-none focus:border-[#5B3CC4]"
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          aria-label="Enviar mensaje"
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-[#A78BFA] to-[#F4A6C1] hover:opacity-95 disabled:opacity-45 text-[#29243A] shadow-xs transition-opacity shrink-0 cursor-pointer"
        >
          <Send className="w-4 h-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}
