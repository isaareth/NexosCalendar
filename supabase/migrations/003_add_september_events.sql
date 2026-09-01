-- NEXOS Agenda — eventos de septiembre 2026 (diagnósticos, integración, lanzamientos,
-- Nexolimpiadas). Pega esto una vez en el SQL Editor de Supabase.
--
-- Supuestos que hice al no tener el dato exacto (ajustables con un UPDATE si hace falta):
--   * Diagnósticos: hora/lugar no fijos → uso 8:00am-5:00pm como ventana representativa y
--     location = "Por confirmar", con la aclaración en extra_info.
--   * Lanzamiento interno DH: no diste lugar → location = "Por confirmar".
--   * Nexolimpiadas y "lanzamiento interno DH": interpreté la "dh" que mencionaste como
--     categoría Talento Humano (DH). Si en realidad era otra cosa (ej. solo el lugar se
--     llama "DH"), dime y lo corrijo.

insert into events (title, category, character, start_time, end_time, location, extra_info) values

-- Diagnósticos (semana 1)
('Diagnósticos', 'General', 'obligatorio',
 '2026-09-14 08:00', '2026-09-18 17:00', 'Por confirmar',
 'Hora y lugar exactos por definir día a día.'),

-- Integración — Comfama Guatapé
('Integración — Comfama Guatapé', 'General', 'voluntario',
 '2026-09-19 06:30', '2026-09-19 17:00', 'Comfama Guatapé (salida desde la universidad)',
 'Llegar a las 6:30am a la universidad para salir juntos. Llevar ropa cómoda y traje de baño de licra. Regreso a la universidad aprox. 7:00pm.'),

-- Lanzamiento interno DH
('Lanzamiento interno DH', 'Talento Humano (DH)', 'obligatorio',
 '2026-09-21 18:00', null, 'Por confirmar', null),

-- Lanzamiento externo
('Lanzamiento externo', 'General', 'obligatorio',
 '2026-09-22 08:00', '2026-09-22 17:00', 'Laboratorio Financiero', null),

-- Nexolimpiadas
('Nexolimpiadas', 'Talento Humano (DH)', 'voluntario',
 '2026-09-26 10:00', '2026-09-26 17:00', 'Cancha Norte', null),

-- Diagnósticos (semana 2)
('Diagnósticos', 'General', 'obligatorio',
 '2026-09-28 08:00', '2026-10-02 17:00', 'Por confirmar',
 'Hora y lugar exactos por definir día a día.');
