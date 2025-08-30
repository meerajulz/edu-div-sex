-- Add all activities based on actual codebase structure
INSERT INTO activities (id, name, slug, description, order_number, is_active) VALUES
(1, 'Actividad 1: Conociendo nuestro cuerpo', 'actividad-1', 'Primera actividad sobre educación sexual', 1, true),
(2, 'Actividad 2: Partes del cuerpo', 'actividad-2', 'Segunda actividad sobre partes del cuerpo', 2, true),
(3, 'Actividad 3: Situaciones y comportamientos', 'actividad-3', 'Tercera actividad sobre situaciones apropiadas', 3, true),
(4, 'Actividad 4: Límites personales', 'actividad-4', 'Cuarta actividad sobre límites y seguridad', 4, true),
(5, 'Actividad 5: Comunicación', 'actividad-5', 'Quinta actividad sobre comunicación efectiva', 5, true),
(6, 'Actividad 6: Respeto y valores', 'actividad-6', 'Sexta actividad sobre respeto y valores', 6, true)
ON CONFLICT (id) DO NOTHING;

-- Add scenes for Actividad-1 (7 scenes)
INSERT INTO scenes (activity_id, name, slug, order_number, is_active) VALUES
(1, 'Escena 1: Introducción', 'scene1', 1, true),
(1, 'Escena 2: Juego de Identificación', 'scene2', 2, true),
(1, 'Escena 3: Partes Íntimas', 'scene3', 3, true),
(1, 'Escena 4: Diferencias de Género', 'scene4', 4, true),
(1, 'Escena 5: Higiene Personal', 'scene5', 5, true),
(1, 'Escena 6: Límites Personales', 'scene6', 6, true),
(1, 'Escena 7: Resumen', 'scene7', 7, true),

-- Add scenes for Actividad-2 (4 scenes)
(2, 'Escena 1: Introducción al Cuerpo', 'scene1', 1, true),
(2, 'Escena 2: Partes del Cuerpo', 'scene2', 2, true),
(2, 'Escena 3: Situaciones Apropiadas', 'scene3', 3, true),
(2, 'Escena 4: Juegos Interactivos', 'scene4', 4, true),

-- Add scenes for Actividad-3 (2 scenes)
(3, 'Escena 1: Situaciones de Riesgo', 'scene1', 1, true),
(3, 'Escena 2: Comportamientos Apropiados', 'scene2', 2, true),

-- Add scenes for Actividad-4 (2 scenes)
(4, 'Escena 1: Estableciendo Límites', 'scene1', 1, true),
(4, 'Escena 2: Seguridad Personal', 'scene2', 2, true),

-- Add scenes for Actividad-5 (2 scenes)
(5, 'Escena 1: Comunicación Asertiva', 'scene1', 1, true),
(5, 'Escena 2: Expresando Sentimientos', 'scene2', 2, true),

-- Add scenes for Actividad-6 (4 scenes)
(6, 'Escena 1: Respeto Mutuo', 'scene1', 1, true),
(6, 'Escena 2: Valores Familiares', 'scene2', 2, true),
(6, 'Escena 3: Diversidad e Inclusión', 'scene3', 3, true),
(6, 'Escena 4: Reflexión Final', 'scene4', 4, true)
ON CONFLICT (activity_id, slug) DO NOTHING;