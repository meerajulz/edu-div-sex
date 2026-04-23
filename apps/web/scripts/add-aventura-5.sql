-- Add Aventura 5 (Nivel Avanzado) activity and scenes
-- Run this script once against the Neon database.
-- Safe to re-run: uses INSERT ... ON CONFLICT DO NOTHING.

-- Activity
INSERT INTO activities (id, name, slug, description, order_number, is_active)
VALUES (
  15,
  'Aventura 5: Diversidad Sexual',
  'aventura-5',
  'Quinta aventura del nivel avanzado sobre diversidad sexual',
  15,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Scenes (ordered as they appear in the activity flow)
INSERT INTO scenes (activity_id, name, slug, order_number, is_active)
VALUES
  (15, 'Escena 1: Los diferentes tipos de pareja',              'scene1', 1, true),
  (15, 'Escena 2: El respeto a los diferentes tipos de pareja', 'scene2', 2, true)
ON CONFLICT (activity_id, slug) DO NOTHING;

-- Keep sequences up to date
SELECT setval('activities_id_seq', GREATEST((SELECT MAX(id) FROM activities), 15));
SELECT setval('scenes_id_seq', (SELECT MAX(id) FROM scenes));
