-- Add Aventura 3 (Nivel Avanzado) activity and scenes
-- Run this script once against the Neon database.
-- Safe to re-run: uses INSERT ... ON CONFLICT DO NOTHING.

-- Activity
INSERT INTO activities (id, name, slug, description, order_number, is_active)
VALUES (
  13,
  'Aventura 3: Placer Sexual',
  'aventura-3',
  'Tercera aventura del nivel avanzado sobre el placer sexual',
  13,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Scenes (ordered as they appear in the activity flow)
INSERT INTO scenes (activity_id, name, slug, order_number, is_active)
VALUES
  (13, 'Escena 1: ¿Qué pasa cuando me excito?',          'scene1',  1,  true),
  (13, 'Escena 2: El orgasmo masculino',                  'scene2',  2,  true),
  (13, 'Juego 1: ¿Qué pasa cuando me excito?',           'juego1',  3,  true),
  (13, 'Escena 3: El orgasmo femenino',                   'scene3',  4,  true),
  (13, 'Escena 4: La masturbación',                       'scene4',  5,  true),
  (13, 'Escena 5: Próximamente',                          'scene5',  6,  true)
ON CONFLICT (activity_id, slug) DO NOTHING;

-- Keep sequences up to date
SELECT setval('activities_id_seq', GREATEST((SELECT MAX(id) FROM activities), 13));
SELECT setval('scenes_id_seq', (SELECT MAX(id) FROM scenes));
