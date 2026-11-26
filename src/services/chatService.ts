import type { ChatMessage, DataSourceStatus } from '../types/edu';

export interface ChatApiResponse {
  reply: string;
  source: DataSourceStatus;
  institutionsCount: number;
  coursesCount: number;
}

export async function sendAssistantMessage(
  message: string,
  history: ChatMessage[]
): Promise<ChatApiResponse> {
  const payloadHistory = history
    .filter((m) => !m.isError)
    .slice(-10)
    .map((m) => ({
      role: m.role,
      content: m.content,
    }));

  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message,
      history: payloadHistory,
    }),
  });

  const data = (await response.json().catch(() => ({}))) as Partial<ChatApiResponse> & {
    error?: string;
  };

  if (!response.ok) {
    throw new Error(
      data.error ||
        `No pudimos conectar con EduPath AI (código ${response.status}).`
    );
  }

  if (!data.reply) {
    throw new Error('EduPath AI no pudo generar una respuesta en este momento.');
  }

  return {
    reply: data.reply,
    source: data.source || 'demo-fallback',
    institutionsCount: data.institutionsCount ?? 0,
    coursesCount: data.coursesCount ?? 0,
  };
}
