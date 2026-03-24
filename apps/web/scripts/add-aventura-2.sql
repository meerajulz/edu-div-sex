-- Add Aventura 2 (Nivel Avanzado) activity and scenes
-- Run this script once against the Neon database.
-- Safe to re-run: uses INSERT ... ON CONFLICT DO NOTHING.

-- Activity
INSERT INTO activities (id, name, slug, description, order_number, is_active)
VALUES (
  12,
  'Aventura 2: Intimidad',
  'aventura-2',
  'Segunda aventura del nivel avanzado sobre la intimidad y el espacio personal',
  12,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Scenes (ordered as they appear in the activity flow)
INSERT INTO scenes (activity_id, name, slug, order_number, is_active)
VALUES
  (12, 'Escena 1: ¿Es privado?',                                   'scene1',  1,  true),
  (12, 'Escena 2: Mi cuerpo y mi espacio',                          'scene2',  2,  true),
  (12, 'Escena 3: ¿Qué es privado y qué es público?',              'scene3',  3,  true),
  (12, 'Escena 4: ¿Qué hacer si alguien no respeta tu intimidad?', 'scene4',  4,  true),
  (12, 'Escena 5: Próximamente',                                    'scene5',  5,  true),
  (12, 'Escena 6: Tu cofre de la intimidad',                        'scene6',  6,  true)
ON CONFLICT (activity_id, slug) DO NOTHING;

-- Keep sequences up to date
SELECT setval('activities_id_seq', GREATEST((SELECT MAX(id) FROM activities), 12));
SELECT setval('scenes_id_seq', (SELECT MAX(id) FROM scenes));
