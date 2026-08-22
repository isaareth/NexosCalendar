-- NEXOS Agenda — datos de prueba (calendario real de partidos, temporada ago-nov 2026)
-- Fuente: tablas de Vóley/Básquet/Fútbol M/F provistas por NEXOS.
-- Uso: pegar en el SQL Editor de Supabase DESPUÉS de haber aplicado schema.sql.
--
-- Valores que las tablas originales no traían y se rellenaron con un default —
-- ajustables después con un UPDATE si hace falta:
--   * location: 'Cancha NEXOS (por confirmar)' para todos los partidos.
--   * character: 'obligatorio' para todos (son partidos oficiales del club).

insert into events (title, category, gender, character, start_time, end_time, location) values
-- Vóley (horario 2:00–3:00 PM en todas las fechas de la tabla)
('SERES vs NEXOS',       'Deportes - Vóley', 'no_aplica', 'obligatorio', '2026-08-18 14:00', '2026-08-18 15:00', 'Cancha NEXOS (por confirmar)'),
('NEXOS vs PARTNERS',    'Deportes - Vóley', 'no_aplica', 'obligatorio', '2026-09-01 14:00', '2026-09-01 15:00', 'Cancha NEXOS (por confirmar)'),
('NEXOS vs GPG',         'Deportes - Vóley', 'no_aplica', 'obligatorio', '2026-09-08 14:00', '2026-09-08 15:00', 'Cancha NEXOS (por confirmar)'),
('NEXOS vs CLUBMERC',    'Deportes - Vóley', 'no_aplica', 'obligatorio', '2026-09-15 14:00', '2026-09-15 15:00', 'Cancha NEXOS (por confirmar)'),
('NEXOS vs CLUBIN',      'Deportes - Vóley', 'no_aplica', 'obligatorio', '2026-09-22 14:00', '2026-09-22 15:00', 'Cancha NEXOS (por confirmar)'),

-- Básquet (sin hora de fin en la tabla original)
('OE vs NEXOS',          'Deportes - Básquet', 'no_aplica', 'obligatorio', '2026-08-19 14:00', null, 'Cancha NEXOS (por confirmar)'),
('CLUBIN vs NEXOS',      'Deportes - Básquet', 'no_aplica', 'obligatorio', '2026-08-26 14:00', null, 'Cancha NEXOS (por confirmar)'),
('NEXOS vs GPG',         'Deportes - Básquet', 'no_aplica', 'obligatorio', '2026-09-02 14:00', null, 'Cancha NEXOS (por confirmar)'),
('NEXOS vs SERES',       'Deportes - Básquet', 'no_aplica', 'obligatorio', '2026-09-09 14:30', null, 'Cancha NEXOS (por confirmar)'),
('NEXOS vs TUTORES',     'Deportes - Básquet', 'no_aplica', 'obligatorio', '2026-09-16 14:30', null, 'Cancha NEXOS (por confirmar)'),
('TVU vs NEXOS',         'Deportes - Básquet', 'no_aplica', 'obligatorio', '2026-09-30 14:30', null, 'Cancha NEXOS (por confirmar)'),
('PARTNERS vs NEXOS',    'Deportes - Básquet', 'no_aplica', 'obligatorio', '2026-10-14 14:30', null, 'Cancha NEXOS (por confirmar)'),
('SERES (2) vs NEXOS',   'Deportes - Básquet', 'no_aplica', 'obligatorio', '2026-10-21 14:00', null, 'Cancha NEXOS (por confirmar)'),

-- Fútbol masculino
('NEXOS vs PARTNERS',     'Deportes - Fútbol', 'masculino', 'obligatorio', '2026-08-13 11:00', null, 'Cancha NEXOS (por confirmar)'),
('NEXOS vs TUTORES FC',   'Deportes - Fútbol', 'masculino', 'obligatorio', '2026-08-21 11:00', null, 'Cancha NEXOS (por confirmar)'),
('NEXOS vs SERES',        'Deportes - Fútbol', 'masculino', 'obligatorio', '2026-09-04 10:00', null, 'Cancha NEXOS (por confirmar)'),
('NEXOS vs CLUBMERC',     'Deportes - Fútbol', 'masculino', 'obligatorio', '2026-09-11 10:00', null, 'Cancha NEXOS (por confirmar)'),
('NEXOS vs ATHLETIC OE',  'Deportes - Fútbol', 'masculino', 'obligatorio', '2026-09-17 11:00', null, 'Cancha NEXOS (por confirmar)'),
('NEXOS vs KREPRES',      'Deportes - Fútbol', 'masculino', 'obligatorio', '2026-09-25 11:00', null, 'Cancha NEXOS (por confirmar)'),
('NEXOS vs UN SOCIETY',   'Deportes - Fútbol', 'masculino', 'obligatorio', '2026-08-28 11:00', null, 'Cancha NEXOS (por confirmar)'),
('NEXOS vs CLUBIN',       'Deportes - Fútbol', 'masculino', 'obligatorio', '2026-10-02 10:00', null, 'Cancha NEXOS (por confirmar)'),
('NEXOS vs SUPERNOVAS',   'Deportes - Fútbol', 'masculino', 'obligatorio', '2026-10-16 11:00', null, 'Cancha NEXOS (por confirmar)'),
('NEXOS vs TVU',          'Deportes - Fútbol', 'masculino', 'obligatorio', '2026-10-22 11:00', null, 'Cancha NEXOS (por confirmar)'),
('NEXOS vs GPG',          'Deportes - Fútbol', 'masculino', 'obligatorio', '2026-10-30 10:00', null, 'Cancha NEXOS (por confirmar)'),
('NEXOS vs AIESEC',       'Deportes - Fútbol', 'masculino', 'obligatorio', '2026-11-13 10:00', null, 'Cancha NEXOS (por confirmar)'),

-- Fútbol femenino
('NEXOS vs CLUBIN-TVU',   'Deportes - Fútbol', 'femenino', 'obligatorio', '2026-08-20 10:00', null, 'Cancha NEXOS (por confirmar)'),
('NEXOS vs KREPRES',      'Deportes - Fútbol', 'femenino', 'obligatorio', '2026-09-04 11:00', null, 'Cancha NEXOS (por confirmar)'),
('NEXOS vs PARTNERS',     'Deportes - Fútbol', 'femenino', 'obligatorio', '2026-09-10 10:00', null, 'Cancha NEXOS (por confirmar)'),
('NEXOS vs AIESEC-UN',    'Deportes - Fútbol', 'femenino', 'obligatorio', '2026-09-18 10:00', null, 'Cancha NEXOS (por confirmar)'),
('NEXOS vs SERES',        'Deportes - Fútbol', 'femenino', 'obligatorio', '2026-09-24 10:00', null, 'Cancha NEXOS (por confirmar)'),
('NEXOS vs TUTOMERC',     'Deportes - Fútbol', 'femenino', 'obligatorio', '2026-10-01 11:00', null, 'Cancha NEXOS (por confirmar)'),
('NEXOS vs ATHLETIC OE',  'Deportes - Fútbol', 'femenino', 'obligatorio', '2026-10-15 10:00', null, 'Cancha NEXOS (por confirmar)'),
('NEXOS vs GPG',          'Deportes - Fútbol', 'femenino', 'obligatorio', '2026-10-22 11:00', null, 'Cancha NEXOS (por confirmar)');
