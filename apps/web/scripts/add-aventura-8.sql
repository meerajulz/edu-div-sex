-- Add Aventura 8 (Nivel Avanzado) activity and scenes
-- Run this script once against the Neon database.
-- Safe to re-run: uses INSERT ... ON CONFLICT DO NOTHING.

-- Activity
INSERT INTO activities (id, name, slug, description, order_number, is_active)
VALUES (
  18,
  'Aventura 8: Abuso sexual',
  'aventura-8',
  'Octava aventura del nivel avanzado sobre abuso sexual',
  18,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Scenes
INSERT INTO scenes (activity_id, name, slug, order_number, is_active)
VALUES
  (18, 'Zonas privadas', 'scene1', 1, true),
  (18, 'Me defiendo', 'scene2', 2, true),
  (18, 'Secretos buenos y malos', 'scene3', 3, true),
  (18, 'Aprendo a preguntar y a no insistir', 'scene4', 4, true),
  (18, 'Aprendo a decir no', 'scene5', 5, true),
  (18, '¿Qué hacer si sucede?', 'scene6', 6, true)
ON CONFLICT (activity_id, slug) DO NOTHING;

-- Keep sequences up to date
SELECT setval('activities_id_seq', GREATEST((SELECT MAX(id) FROM activities), 18));
SELECT setval('scenes_id_seq', (SELECT MAX(id) FROM scenes));
