-- Add Aventura 7 (Nivel Avanzado) activity and scenes
-- Run this script once against the Neon database.
-- Safe to re-run: uses INSERT ... ON CONFLICT DO NOTHING.

-- Activity
INSERT INTO activities (id, name, slug, description, order_number, is_active)
VALUES (
  17,
  'Aventura 7: Prácticas sexuales, asertividad y pornografía',
  'aventura-7',
  'Séptima aventura del nivel avanzado sobre prácticas sexuales, asertividad y pornografía',
  17,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Scenes
INSERT INTO scenes (activity_id, name, slug, order_number, is_active)
VALUES
  (17, 'Escena 1: Diferentes gustos, diferentes prácticas sexuales', 'scene1', 1, true),
  (17, 'Escena 2: El preservativo nos protege',                       'scene2', 2, true),
  (17, 'Escena 3: ¿Qué hacemos con el preservativo usado?',           'scene3', 3, true),
  (17, 'Escena 4: Las películas no siempre muestran la realidad',     'scene4', 4, true),
  (17, 'Escena 5: Final',                                             'scene5', 5, true)
ON CONFLICT (activity_id, slug) DO NOTHING;

-- Keep sequences up to date
SELECT setval('activities_id_seq', GREATEST((SELECT MAX(id) FROM activities), 17));
SELECT setval('scenes_id_seq', (SELECT MAX(id) FROM scenes));
