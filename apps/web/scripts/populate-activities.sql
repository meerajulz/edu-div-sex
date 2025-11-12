-- Populate activities and scenes for the educational platform
-- This script creates the activities and scenes structure based on the frontend code

-- Clear existing data
DELETE FROM student_progress;
DELETE FROM scenes;
DELETE FROM activities;

-- Insert activities
INSERT INTO activities (id, name, slug, description, order_number, is_active) VALUES
(1, 'Actividad 1: Descubriendo Mi Cuerpo', 'actividad-1', 'Primera actividad sobre educación sexual', 1, true),
(2, 'Actividad 2: Intimidad', 'actividad-2', 'Segunda actividad sobre intimidad y privacidad', 2, true),
(3, 'Actividad 3: Placer sexual', 'actividad-3', 'Tercera actividad sobre placer sexual', 3, true),
(4, 'Actividad 4: Higiene Sexual', 'actividad-4', 'Cuarta actividad sobre higiene sexual', 4, true),
(5, 'Actividad 5: Entender y respetar', 'actividad-5', 'Quinta actividad sobre entender y respetar', 5, true),
(6, 'Actividad 6: Abuso', 'actividad-6', 'Sexta actividad sobre prevención de abuso', 6, true);

-- Insert scenes for Activity 1
INSERT INTO scenes (activity_id, name, slug, order_number, is_active) VALUES
(1, 'Escena 1: El cuerpo de los niños y las niñas', 'scene1', 1, true),
(1, 'Escena 2: ¿Es privado?', 'scene2', 2, true),
(1, 'Escena 3: Mi cuerpo de chico', 'scene3', 3, true),
(1, 'Escena 4: Mi cuerpo de chica', 'scene4', 4, true),
(1, 'Escena 5: Diferencias', 'scene5', 5, true),
(1, 'Escena 6: Igualdad', 'scene6', 6, true),
(1, 'Escena 7: Repaso', 'scene7', 7, true);

-- Insert scenes for Activity 2
INSERT INTO scenes (activity_id, name, slug, order_number, is_active) VALUES
(2, 'Escena 1: ¿Es privado?', 'scene1', 1, true),
(2, 'Escena 2: Mi cuerpo y mi espacio', 'scene2', 2, true),
(2, 'Escena 3: ¿Qué es privado y qué es público?', 'scene3', 3, true),
(2, 'Escena 4: ¿Qué hacer si alguien no respeta tu intimidad?', 'scene4', 4, true),
(2, 'Escena 5: Tu cofre de la intimidad', 'scene5', 5, true);

-- Insert scenes for Activity 3
INSERT INTO scenes (activity_id, name, slug, order_number, is_active) VALUES
(3, 'Escena 1: ¿Qué pasa cuando me excito?', 'scene1', 1, true),
(3, 'Escena 1-1: El Orgasmo Masculino: La Eyaculación', 'scene1-1', 2, true),
(3, 'Escena 1-2: El Orgasmo Femenino', 'scene1-2', 3, true),
(3, 'Escena 2: La Masturbación', 'scene2', 4, true);

-- Insert scenes for Activity 4
INSERT INTO scenes (activity_id, name, slug, order_number, is_active) VALUES
(4, 'Escena 1: La higiene de los chicos y las chicas', 'scene1', 1, true),
(4, 'Escena 2: Higiene menstrual', 'scene2', 2, true);

-- Insert scenes for Activity 5
INSERT INTO scenes (activity_id, name, slug, order_number, is_active) VALUES
(5, 'Escena 1: ¿Qué dice mi cara?', 'scene1', 1, true),
(5, 'Escena 1-1: ¿Qué dice mi tono de voz?', 'scene1-1', 2, true),
(5, 'Escena 1-2: ¿Qué cara pondrá?', 'scene1-2', 3, true),
(5, 'Escena 2: ¿Cómo ligamos?', 'scene2', 4, true);

-- Insert scenes for Activity 6
INSERT INTO scenes (activity_id, name, slug, order_number, is_active) VALUES
(6, 'Escena 1: Mis partes privadas', 'scene1', 1, true),
(6, 'Escena 2: Me defiendo', 'scene2', 2, true),
(6, 'Escena 3: Secretos buenos y malos', 'scene3', 3, true),
(6, 'Escena 4: Respetamos', 'scene4', 4, true),
(6, 'Escena 4-1: ¿Qué hacer si sucede?', 'scene4-1', 5, true);

-- Reset sequence to avoid conflicts
SELECT setval('activities_id_seq', (SELECT MAX(id) FROM activities));
SELECT setval('scenes_id_seq', (SELECT MAX(id) FROM scenes));