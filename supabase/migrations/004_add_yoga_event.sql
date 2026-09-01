-- NEXOS Agenda — NEXperiencia Yoga (DH). Pega esto en el SQL Editor de Supabase.
--
-- Supuesto: no diste obligatorio/voluntario, así que la puse como voluntaria — igual que
-- Integración Comfama y Nexolimpiadas, las otras actividades de bienestar/diversión que ya
-- marcaste como voluntarias. Si debía ser obligatoria, avísame y la cambio con un UPDATE.

insert into events (title, category, character, start_time, location, extra_info) values
('NEXperiencia Yoga', 'Talento Humano (DH)', 'voluntario',
 '2026-09-03 18:00', 'El Domo',
 'Si es posible, llevar mat de yoga.');
