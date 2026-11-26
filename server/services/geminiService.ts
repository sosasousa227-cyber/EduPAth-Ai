import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import type { SanitizedHistoryTurn } from '../middleware/rateLimiter.ts';
import type { CatalogSnapshot } from './supabaseService.ts';

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

export function isGeminiConfigured(): boolean {
  const apiKey = (process.env.GEMINI_API_KEY || '').trim();
  return Boolean(apiKey) && apiKey !== 'MY_GEMINI_API_KEY';
}

function buildGroundedSystemPrompt(catalog: CatalogSnapshot): string {
  const institutionsSummary =
    catalog.institutions.length > 0
      ? catalog.institutions
          .map(
            (inst) =>
              `- ${inst.name} | Categoría: ${inst.category?.name ?? 'Sin categoría'} | Ciudad: ${inst.city}, ${inst.department} | Dirección: ${inst.address} | Modalidad: ${inst.modality} | Horario: ${inst.schedule} | Teléfono: ${inst.phone || 'No especificado'} | Correo: ${inst.email || 'No especificado'} | Coordenadas: (${inst.latitude}, ${inst.longitude}) | ${inst.is_demo ? 'UBICACIÓN DE DEMOSTRACIÓN' : 'Registro verificado'}`
          )
          .join('\n')
      : 'No hay instituciones registradas actualmente.';

  const coursesSummary =
    catalog.courses.length > 0
      ? catalog.courses
          .map(
            (course) =>
              `- "${course.title}" | Área: ${course.study_area} | Institución: ${course.institution?.name ?? 'No especificada'} (${course.institution?.city ?? 'Paraguay'}) | Modalidad: ${course.modality} | Duración: ${course.duration} | Horario: ${course.schedule} | Costo: ${course.cost_display} | Gratuito: ${course.is_free ? 'Sí' : 'No'} | Requisitos: ${course.requirements} | ${course.is_demo ? 'Registro de demostración' : 'Registro en catálogo'}`
          )
          .join('\n')
      : 'No hay cursos registrados actualmente.';

  const sourceNotice =
    catalog.source === 'supabase'
      ? 'Fuente de datos actual: Base de datos real en Supabase.'
      : 'Fuente de datos actual: Modo demostración (aún no se configuraron las credenciales de Supabase; los registros marcados como demostración son ejemplos iniciales).';

  return `Sos EduPath AI, el asistente educativo inteligente de la plataforma EduPath AI de Paraguay.

PERSONALIDAD Y TONO:
- Amable, claro, educativo, respetuoso y alentador.
- Respondé siempre en español natural y cercano (podés usar voseo paraguayo amable como "descubrí", "podés", "te recomiendo" sin exagerar).
- Mantené las respuestas ordenadas, fáciles de leer y concretas (máximo 250-350 palabras salvo que pidan una explicación técnica paso a paso).

REGLAS ESTRICTAS DE VERACIDAD SOBRE INSTITUCIONES Y CURSOS:
1. Cuando recomiendes instituciones, academias, bibliotecas, centros de capacitación o cursos, debés basarte ÚNICAMENTE en los datos reales listados abajo.
2. NUNCA inventes nombres de instituciones, precios, direcciones, teléfonos, horarios, coordenadas ni cursos que no aparezcan en el catálogo provisto.
3. Si el visitante pide una ciudad, departamento, área o curso que no figura en el catálogo actual, decí claramente que por el momento no hay información suficiente o coincidencias registradas en el catálogo de EduPath AI, y sugerí opciones reales cercanas si existen.
4. Si recomendás un registro marcado como "UBICACIÓN DE DEMOSTRACIÓN" o "Registro de demostración", aclaralo con transparencia.

CAPACIDADES ADICIONALES PERMITIDAS:
- Orientar a estudiantes sobre qué ruta de aprendizaje elegir según sus objetivos.
- Explicar conceptos de informática, programación, desarrollo web, datos y tecnología de forma didáctica y clara (podés dar ejemplos de código breves cuando ayuden).
- Responder preguntas sobre cómo usar EduPath AI (explorar el catálogo de instituciones, filtrar cursos gratuitos o por modalidad, usar el mapa interactivo de Paraguay con OpenStreetMap y geolocalización).

${sourceNotice}

INSTITUCIONES DISPONIBLES EN CATÁLOGO:
${institutionsSummary}

CURSOS Y CAPACITACIONES DISPONIBLES EN CATÁLOGO:
${coursesSummary}`;
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        const delayMs = 350 * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
    }
  }
  throw lastError;
}

export async function generateEduPathReply(params: {
  message: string;
  history: SanitizedHistoryTurn[];
  catalog: CatalogSnapshot;
}): Promise<string> {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error(
      'GEMINI_API_KEY no está configurada en el servidor. Configurala en Settings > Secrets o en tu archivo .env del backend.'
    );
  }

  const systemInstruction = buildGroundedSystemPrompt(params.catalog);

  const contents = [
    ...params.history.map((turn) => ({
      role: turn.role === 'assistant' ? ('model' as const) : ('user' as const),
      parts: [{ text: turn.content }],
    })),
    {
      role: 'user' as const,
      parts: [{ text: params.message }],
    },
  ];

  const response = await withRetry(() =>
    ai.models.generateContent({
      model: 'gemini-4-hydrogen',
      contents,
      config: {
        systemInstruction,
        thinkingConfig: {
          thinkingLevel: ThinkingLevel.LOW,
        },
      },
    })
  );

  const replyText = response.text?.trim();
  if (!replyText) {
    throw new Error('El modelo no devolvió una respuesta válida. Intentá reformular tu consulta.');
  }

  return replyText;
}
