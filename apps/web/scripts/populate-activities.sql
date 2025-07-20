-- Populate activities and scenes for the educational platform
-- This script creates the activities and scenes structure based on the frontend code

-- Clear existing data
DELETE FROM student_progress;
DELETE FROM scenes;
DELETE FROM activities;

-- Insert activities
INSERT INTO activities (id, name, slug, description, order_number, is_active) VALUES
(1, 'Actividad 1: Conociendo nuestro cuerpo', 'actividad-1', 'Primera actividad sobre educación sexual', 1, true),
(2, 'Actividad 2: Partes del cuerpo', 'actividad-2', 'Segunda actividad sobre partes del cuerpo', 2, true),
(3, 'Actividad 3: Situaciones y comportamientos', 'actividad-3', 'Tercera actividad sobre situaciones apropiadas', 3, true);

-- Insert scenes for Activity 1
INSERT INTO scenes (activity_id, name, slug, order_number, is_active) VALUES
(1, 'Escena 1: Introducción', 'scene1', 1, true),
(1, 'Escena 2: Juego de Identificación', 'scene2', 2, true),
(1, 'Escena 3: Partes Íntimas', 'scene3', 3, true),
(1, 'Escena 4: Diferencias de Género', 'scene4', 4, true),
(1, 'Escena 5: Higiene Personal', 'scene5', 5, true),
(1, 'Escena 6: Límites Personales', 'scene6', 6, true),
(1, 'Escena 7: Resumen', 'scene7', 7, true);

-- Insert scenes for Activity 2
INSERT INTO scenes (activity_id, name, slug, order_number, is_active) VALUES
(2, 'Escena 1: Introducción al Cuerpo', 'scene1', 1, true),
(2, 'Escena 2: Partes del Cuerpo', 'scene2', 2, true),
(2, 'Escena 3: Situaciones Apropiadas', 'scene3', 3, true),
(2, 'Escena 4: Juegos Interactivos', 'scene4', 4, true);

-- Insert scenes for Activity 3
INSERT INTO scenes (activity_id, name, slug, order_number, is_active) VALUES
(3, 'Escena 1: Situaciones de Riesgo', 'scene1', 1, true),
(3, 'Escena 2: Comportamientos Apropiados', 'scene2', 2, true);

-- Reset sequence to avoid conflicts
SELECT setval('activities_id_seq', (SELECT MAX(id) FROM activities));
SELECT setval('scenes_id_seq', (SELECT MAX(id) FROM scenes));