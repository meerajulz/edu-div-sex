-- Add Aventura 6 (Nivel Avanzado) activity and scenes
-- Run this script once against the Neon database.
-- Safe to re-run: uses INSERT ... ON CONFLICT DO NOTHING.

-- Activity
INSERT INTO activities (id, name, slug, description, order_number, is_active)
VALUES (
  16,
  'Aventura 6: Relaciones de pareja',
  'aventura-6',
  'Sexta aventura del nivel avanzado sobre relaciones de pareja',
  16,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Scenes (ordered as they appear in the activity flow)
INSERT INTO scenes (activity_id, name, slug, order_number, is_active)
VALUES
  (16, 'Escena 1: La relación de pareja',      'scene1',   1, true),
  (16, 'Escena 1-1: Los celos',                'scene1-1', 2, true),
  (16, 'Escena 2: ¿Puedo tener dos parejas?',  'scene2',   3, true),
  (16, 'Escena 3: ¿Cómo cortar con tu pareja?','scene3',   4, true),
  (16, 'Escena 4: ¿Qué hacemos cuando nos dejan?', 'scene4', 5, true)
ON CONFLICT (activity_id, slug) DO NOTHING;

-- Keep sequences up to date
SELECT setval('activities_id_seq', GREATEST((SELECT MAX(id) FROM activities), 16));
SELECT setval('scenes_id_seq', (SELECT MAX(id) FROM scenes));
