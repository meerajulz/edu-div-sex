-- Add Aventura 1 (Nivel Avanzado) activity and scenes
-- Run this script once against the Neon database.
-- Safe to re-run: uses INSERT ... ON CONFLICT DO NOTHING.

-- Activity
INSERT INTO activities (id, name, slug, description, order_number, is_active)
VALUES (
  11,
  'Aventura 1: Descubriendo mi sexualidad',
  'aventura-1',
  'Primera aventura del nivel avanzado sobre cambios en la pubertad e higiene íntima',
  11,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Scenes (ordered as they appear in the activity flow)
INSERT INTO scenes (activity_id, name, slug, order_number, is_active)
VALUES
  (11, 'Escena 1: Nuestro cuerpo cambia',           'scene1',  1,  true),
  (11, 'Escena 2: Cambios en Nico',                  'scene2',  2,  true),
  (11, 'Escena 3: La erección',                      'scene3',  3,  true),
  (11, 'Juego 1: ¿Qué ha cambiado?',                 'juego1',  4,  true),
  (11, 'Escena 4: Cuido de mi higiene',              'scene4',  5,  true),
  (11, 'Juego 2: Ayuda en la higiene',               'juego2',  6,  true),
  (11, 'Escena 5: La menstruación',                  'scene5',  7,  true),
  (11, 'Escena 6: Higiene después del WC',           'scene6',  8,  true),
  (11, 'Juego 3: Higiene menstrual',                 'juego3',  9,  true),
  (11, 'Escena 7: La tía Mar en la ginecóloga',      'scene7',  10, true),
  (11, 'Juego 4: ¡Concurso!',                        'juego4',  11, true)
ON CONFLICT (activity_id, slug) DO NOTHING;

-- Keep sequences up to date
SELECT setval('activities_id_seq', GREATEST((SELECT MAX(id) FROM activities), 11));
SELECT setval('scenes_id_seq', (SELECT MAX(id) FROM scenes));
