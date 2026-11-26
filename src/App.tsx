import { Database, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { ChatbotWidget } from './components/ChatbotWidget';
import { Footer } from './components/Footer';
import { InstitutionModal } from './components/InstitutionModal';
import { Navbar } from './components/Navbar';
import { useEduData } from './hooks/useEduData';
import { AssistantPage } from './pages/AssistantPage';
import { CoursesPage } from './pages/CoursesPage';
import { HomePage } from './pages/HomePage';
import { InstitutionsPage } from './pages/InstitutionsPage';
import { MapPage } from './pages/MapPage';
import { sendAssistantMessage } from './services/chatService';
import type { ChatMessage, Course, Institution, NavSection } from './types/edu';

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome-edupath',
  role: 'assistant',
  content:
    '¡Hola! Soy EduPath AI, tu guía educativa en Paraguay. Podés preguntarme sobre academias, bibliotecas, centros de capacitación, cursos gratuitos disponibles o conceptos de programación y tecnología. ¿Qué te gustaría aprender hoy?',
  timestamp: new Date().toISOString(),
};

export default function App() {
  const {
    categories,
    institutions,
    courses,
    source,
    loading,
    error,
    reload,
  } = useEduData();

  const [activeSection, setActiveSection] = useState<NavSection>('inicio');
  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);
  const [focusedMapInstitution, setFocusedMapInstitution] =
    useState<Institution | null>(null);

  const [instInitialSearch, setInstInitialSearch] = useState('');
  const [instInitialCategory, setInstInitialCategory] = useState('all');
  const [courseInitialSearch, setCourseInitialSearch] = useState('');
  const [filterSessionKey, setFilterSessionKey] = useState(0);

  const [demoNoticeDismissed, setDemoNoticeDismissed] = useState(false);

  // Chatbot session state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    INITIAL_WELCOME_MESSAGE,
  ]);
  const [isSendingChat, setIsSendingChat] = useState(false);

  const navigateTo = useCallback((section: NavSection) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleGlobalSearch = useCallback(
    (query: string) => {
      const q = query.toLowerCase();
      const matchesInst = institutions.some((i) =>
        `${i.name} ${i.city} ${i.department} ${i.description}`
          .toLowerCase()
          .includes(q)
      );
      const matchesCourse = courses.some((c) =>
        `${c.title} ${c.study_area} ${c.description}`
          .toLowerCase()
          .includes(q)
      );

      setFilterSessionKey((k) => k + 1);
      if (!matchesInst && matchesCourse) {
        setCourseInitialSearch(query);
        navigateTo('cursos');
      } else {
        setInstInitialSearch(query);
        setInstInitialCategory('all');
        navigateTo('instituciones');
      }
    },
    [institutions, courses, navigateTo]
  );

  const handleFilterCategory = useCallback(
    (categoryId: string) => {
      setInstInitialCategory(categoryId);
      setInstInitialSearch('');
      setFilterSessionKey((k) => k + 1);
      navigateTo('instituciones');
    },
    [navigateTo]
  );

  const handleLocateOnMap = useCallback(
    (institution: Institution) => {
      setFocusedMapInstitution(institution);
      navigateTo('mapa');
    },
    [navigateTo]
  );

  const handleSendMessage = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: text,
        timestamp: new Date().toISOString(),
      };

      const snapshotHistory = [...chatMessages, userMsg];
      setChatMessages(snapshotHistory);
      setIsSendingChat(true);

      try {
        const res = await sendAssistantMessage(text, chatMessages);
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: res.reply,
          timestamp: new Date().toISOString(),
        };
        setChatMessages((prev) => [...prev, aiMsg]);
      } catch (err) {
        const errText =
          err instanceof Error
            ? err.message
            : 'No pudimos conectar con el asistente en este momento.';
        const errMsg: ChatMessage = {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: errText,
          timestamp: new Date().toISOString(),
          isError: true,
        };
        setChatMessages((prev) => [...prev, errMsg]);
      } finally {
        setIsSendingChat(false);
      }
    },
    [chatMessages]
  );

  const handleAskAboutCourse = useCallback(
    (course: Course) => {
      setChatOpen(true);
      void handleSendMessage(
        `Contame más sobre el curso "${course.title}" en ${course.institution?.name || 'Paraguay'}, sus requisitos y si me conviene según mi nivel inicial.`
      );
    },
    [handleSendMessage]
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF9F5] text-[#29243A]">
      <Navbar
        activeSection={activeSection}
        onNavigate={navigateTo}
        onOpenChat={() => setChatOpen(true)}
      />

      {/* Transparent notice when running on the 5 demonstration locations before Supabase env vars are set */}
      {!loading && !error && source === 'demo-fallback' && !demoNoticeDismissed && (
        <div className="bg-[#FFE08A]/40 border-b border-[#EAB308]/25">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-4 text-xs font-semibold text-[#29243A]">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-[#9A5B13] shrink-0" aria-hidden="true" />
              <span>
                Visualizando las <strong>5 ubicaciones de demostración</strong> en Paraguay. Para conectar tu base real, configurá <code className="font-mono-tabular">VITE_SUPABASE_URL</code> y <code className="font-mono-tabular">VITE_SUPABASE_ANON_KEY</code>.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setDemoNoticeDismissed(true)}
              aria-label="Ocultar aviso"
              className="p-1 rounded-lg hover:bg-white/60 transition-colors shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <main className="flex-1">
        {error && activeSection !== 'instituciones' && activeSection !== 'cursos' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div className="p-4 rounded-2xl bg-[#FFF1F5] border border-[#F4A6C1] text-sm text-[#7F1D1D] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => void reload()}
                className="px-4 py-2 rounded-xl bg-[#5B3CC4] text-white text-xs font-bold cursor-pointer shrink-0"
              >
                Reintentar
              </button>
            </div>
          </div>
        )}
        {activeSection === 'inicio' && (
          <HomePage
            categories={categories}
            institutions={institutions}
            courses={courses}
            loading={loading}
            onNavigate={navigateTo}
            onSearchGlobal={handleGlobalSearch}
            onFilterCategory={handleFilterCategory}
            onSelectInstitution={setSelectedInstitution}
            onLocateOnMap={handleLocateOnMap}
            onAskAboutCourse={handleAskAboutCourse}
            onOpenChat={() => setChatOpen(true)}
          />
        )}

        {activeSection === 'instituciones' && (
          <InstitutionsPage
            key={`inst-${filterSessionKey}`}
            categories={categories}
            institutions={institutions}
            loading={loading}
            error={error}
            initialSearch={instInitialSearch}
            initialCategoryId={instInitialCategory}
            onRetry={reload}
            onSelectInstitution={setSelectedInstitution}
            onLocateOnMap={handleLocateOnMap}
          />
        )}

        {activeSection === 'cursos' && (
          <CoursesPage
            key={`course-${filterSessionKey}`}
            courses={courses}
            institutions={institutions}
            loading={loading}
            error={error}
            initialSearch={courseInitialSearch}
            onRetry={reload}
            onSelectInstitution={setSelectedInstitution}
            onAskAboutCourse={handleAskAboutCourse}
          />
        )}

        {activeSection === 'mapa' && (
          <MapPage
            categories={categories}
            institutions={institutions}
            focusedInstitution={focusedMapInstitution}
            onFocusInstitution={setFocusedMapInstitution}
            onSelectInstitution={setSelectedInstitution}
          />
        )}

        {activeSection === 'asistente' && (
          <AssistantPage
            messages={chatMessages}
            isSending={isSendingChat}
            onSendMessage={handleSendMessage}
            institutionsCount={institutions.length}
            coursesCount={courses.length}
            dataSource={source}
          />
        )}
      </main>

      <Footer onNavigate={navigateTo} />

      <InstitutionModal
        institution={selectedInstitution}
        courses={courses}
        onClose={() => setSelectedInstitution(null)}
        onLocateOnMap={handleLocateOnMap}
      />

      {activeSection !== 'asistente' && (
        <ChatbotWidget
          isOpen={chatOpen}
          onToggle={() => setChatOpen((prev) => !prev)}
          onClose={() => setChatOpen(false)}
          messages={chatMessages}
          isSending={isSendingChat}
          onSendMessage={handleSendMessage}
        />
      )}
    </div>
  );
}
