-- Add remaining activities
INSERT INTO activities (id, name, slug, description, order_number, is_active) VALUES
(2, 'Actividad 2: Partes del cuerpo', 'actividad-2', 'Segunda actividad sobre partes del cuerpo', 2, true),
(3, 'Actividad 3: Situaciones y comportamientos', 'actividad-3', 'Tercera actividad sobre situaciones apropiadas', 3, true)
ON CONFLICT (id) DO NOTHING;

-- Add scenes for Activity 2
INSERT INTO scenes (activity_id, name, slug, order_number, is_active) VALUES
(2, 'Escena 1: Introducción al Cuerpo', 'scene1', 1, true),
(2, 'Escena 2: Partes del Cuerpo', 'scene2', 2, true),
(2, 'Escena 3: Situaciones Apropiadas', 'scene3', 3, true),
(2, 'Escena 4: Juegos Interactivos', 'scene4', 4, true)
ON CONFLICT (activity_id, slug) DO NOTHING;

-- Add scenes for Activity 3
INSERT INTO scenes (activity_id, name, slug, order_number, is_active) VALUES
(3, 'Escena 1: Situaciones de Riesgo', 'scene1', 1, true),
(3, 'Escena 2: Comportamientos Apropiados', 'scene2', 2, true)
ON CONFLICT (activity_id, slug) DO NOTHING;

-- Reset sequences to avoid conflicts
SELECT setval('activities_id_seq', (SELECT MAX(id) FROM activities));
SELECT setval('scenes_id_seq', (SELECT MAX(id) FROM scenes));