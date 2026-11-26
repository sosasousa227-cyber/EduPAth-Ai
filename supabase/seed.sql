-- ============================================================================
-- EduPath AI — Datos iniciales y 5 ubicaciones de demostración en Paraguay
-- Ejecutar después de supabase/schema.sql en el SQL Editor de Supabase
-- ============================================================================

INSERT INTO public.categories (id, name, slug, description, color)
VALUES
  ('11111111-1111-4111-8111-111111111101', 'Academias', 'academias', 'Espacios especializados en idiomas, tecnología, arte, música y refuerzo académico.', '#A78BFA'),
  ('11111111-1111-4111-8111-111111111102', 'Bibliotecas', 'bibliotecas', 'Bibliotecas públicas y comunitarias con acceso libre a lectura, estudio y recursos digitales.', '#A9D9BD'),
  ('11111111-1111-4111-8111-111111111103', 'Centros de capacitación', 'centros-de-capacitacion', 'Centros técnicos y de formación profesional orientados a oficios y empleo.', '#91C9F7')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color = EXCLUDED.color;

-- 5 ubicaciones de demostración claramente identificadas (is_demo = true)
INSERT INTO public.institutions (
  id, category_id, name, description, image_url, address, city, department,
  phone, email, website, schedule, modality, latitude, longitude, is_featured, is_demo
)
VALUES
  (
    '22222222-2222-4222-8222-222222222201',
    '11111111-1111-4111-8111-111111111101',
    'Academia Ñandutí Digital (Demo)',
    'Centro de demostración enfocado en desarrollo web, diseño UI/UX y pensamiento computacional para jóvenes y estudiantes universitarios en Asunción.',
    NULL,
    'Av. Mariscal López 1450 casi Perú',
    'Asunción',
    'Capital',
    '+595 21 555 0101',
    'contacto@nandutidigital.demo.py',
    'https://edupath.paraguay.demo/nanduti-digital',
    'Lunes a Viernes de 08:30 a 20:30 · Sábados de 09:00 a 13:00',
    'Híbrida',
    -25.2867,
    -57.6145,
    TRUE,
    TRUE
  ),
  (
    '22222222-2222-4222-8222-222222222202',
    '11111111-1111-4111-8111-111111111102',
    'Biblioteca Comunitaria Lapacho (Demo)',
    'Espacio de demostración con salas silenciosas de lectura, acceso libre a computadoras, talleres de escritura creativa y clubes de lectura juvenil.',
    NULL,
    'Calle España 620 esq. Constitución',
    'Asunción',
    'Capital',
    '+595 21 555 0102',
    'biblioteca@lapacho.demo.py',
    'https://edupath.paraguay.demo/biblioteca-lapacho',
    'Lunes a Sábado de 08:00 a 19:00',
    'Presencial',
    -25.2809,
    -57.6309,
    TRUE,
    TRUE
  ),
  (
    '22222222-2222-4222-8222-222222222203',
    '11111111-1111-4111-8111-111111111103',
    'Centro de Capacitación Técnica Alto Paraná (Demo)',
    'Institución de demostración orientada a formación laboral rápida en electricidad domiciliaria, soporte informático, energías renovables y gestión emprendedora.',
    NULL,
    'Av. San Blas Km 3,5',
    'Ciudad del Este',
    'Alto Paraná',
    '+595 61 555 0103',
    'info@ctap.demo.py',
    'https://edupath.paraguay.demo/alto-parana',
    'Lunes a Viernes de 07:30 a 21:00',
    'Presencial',
    -25.5097,
    -54.6111,
    TRUE,
    TRUE
  ),
  (
    '22222222-2222-4222-8222-222222222204',
    '11111111-1111-4111-8111-111111111101',
    'Academia Lingüística Guaraní & Global (Demo)',
    'Academia de demostración dedicada a la enseñanza práctica de inglés, portugués, guaraní comunicativo y preparación para becas internacionales.',
    NULL,
    'Av. Mariscal Estigarribia 840',
    'San Lorenzo',
    'Central',
    '+595 21 555 0104',
    'admisiones@guaraniglobal.demo.py',
    'https://edupath.paraguay.demo/guarani-global',
    'Lunes a Viernes de 09:00 a 20:00 · Sábados de 08:30 a 12:30',
    'Híbrida',
    -25.3426,
    -57.5089,
    FALSE,
    TRUE
  ),
  (
    '22222222-2222-4222-8222-222222222205',
    '11111111-1111-4111-8111-111111111103',
    'Centro Tecnológico del Sur (Demo)',
    'Centro de demostración en Itapúa para capacitación en análisis de datos, ofimática avanzada, robótica educativa y marketing digital.',
    NULL,
    'Calle Constitución Nacional 412',
    'Encarnación',
    'Itapúa',
    '+595 71 555 0105',
    'hola@centrosur.demo.py',
    'https://edupath.paraguay.demo/centro-sur',
    'Lunes a Viernes de 08:00 a 19:30',
    'Virtual',
    -27.3306,
    -55.8667,
    TRUE,
    TRUE
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.courses (
  id, institution_id, title, description, study_area, modality,
  duration, schedule, cost_gs, cost_display, is_free, requirements, is_featured, is_demo
)
VALUES
  (
    '33333333-3333-4333-8333-333333333301',
    '22222222-2222-4222-8222-222222222201',
    'Desarrollo Web Full-Stack con TypeScript',
    'Aprendé a construir aplicaciones web modernas desde cero con HTML, Tailwind CSS, React y APIs REST.',
    'Programación y Tecnología',
    'Híbrida',
    '12 semanas',
    'Martes y Jueves de 18:30 a 20:30',
    0,
    'Gratuito (Beca juvenil)',
    TRUE,
    'Manejo básico de computadora e internet',
    TRUE,
    TRUE
  ),
  (
    '33333333-3333-4333-8333-333333333302',
    '22222222-2222-4222-8222-222222222201',
    'Diseño de Interfaces y Experiencia de Usuario (UI/UX)',
    'Fundamentos de diseño centrado en personas, prototipado interactivo y sistemas visuales accesibles.',
    'Diseño y Creatividad',
    'Virtual',
    '8 semanas',
    'Miércoles de 19:00 a 21:00',
    350000,
    'Gs. 350.000 / mes',
    FALSE,
    'No requiere experiencia previa en diseño',
    TRUE,
    TRUE
  ),
  (
    '33333333-3333-4333-8333-333333333303',
    '22222222-2222-4222-8222-222222222202',
    'Alfabetización Digital y Herramientas de Estudio',
    'Taller práctico de búsqueda académica, uso de planillas, presentaciones y organización digital para estudiantes.',
    'Habilidades Digitales',
    'Presencial',
    '4 semanas',
    'Sábados de 09:30 a 11:30',
    0,
    'Gratuito',
    TRUE,
    'Acceso libre para toda la comunidad',
    TRUE,
    TRUE
  ),
  (
    '33333333-3333-4333-8333-333333333304',
    '22222222-2222-4222-8222-222222222203',
    'Soporte Técnico y Redes de Computadoras',
    'Mantenimiento de hardware, instalación de sistemas operativos y configuración de redes domésticas y de oficina.',
    'Programación y Tecnología',
    'Presencial',
    '10 semanas',
    'Lunes, Miércoles y Viernes de 18:00 a 20:00',
    220000,
    'Gs. 220.000 / mes',
    FALSE,
    'Mayor de 16 años y educación básica concluida',
    FALSE,
    TRUE
  ),
  (
    '33333333-3333-4333-8333-333333333305',
    '22222222-2222-4222-8222-222222222204',
    'Inglés Comunicativo para Becas y Tecnología',
    'Práctica intensiva de comprensión lectora, conversación técnica y redacción para postulaciones académicas.',
    'Idiomas',
    'Híbrida',
    '16 semanas',
    'Martes y Jueves de 17:30 a 19:00',
    280000,
    'Gs. 280.000 / mes',
    FALSE,
    'Nivel A1 o entrevista de ubicación sin costo',
    TRUE,
    TRUE
  ),
  (
    '33333333-3333-4333-8333-333333333306',
    '22222222-2222-4222-8222-222222222205',
    'Introducción a Python y Análisis de Datos',
    'Lógica de programación con Python, limpieza de datos y gráficos claros para proyectos académicos y laborales.',
    'Programación y Tecnología',
    'Virtual',
    '6 semanas',
    'Lunes y Miércoles de 19:00 a 20:30',
    0,
    'Gratuito',
    TRUE,
    'Conocimientos básicos de matemática y lógica',
    TRUE,
    TRUE
  ),
  (
    '33333333-3333-4333-8333-333333333307',
    '22222222-2222-4222-8222-222222222203',
    'Instalaciones Eléctricas y Energía Solar Básica',
    'Capacitación práctica en seguridad eléctrica, armado de tableros e introducción a paneles fotovoltaicos.',
    'Oficios y Energía',
    'Presencial',
    '14 semanas',
    'Sábados de 08:00 a 12:00',
    180000,
    'Gs. 180.000 / mes',
    FALSE,
    'Mayor de 18 años',
    FALSE,
    TRUE
  )
ON CONFLICT (id) DO NOTHING;
