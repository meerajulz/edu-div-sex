-- Add Aventura 4 (Nivel Avanzado) activity and scenes
-- Run this script once against the Neon database.
-- Safe to re-run: uses INSERT ... ON CONFLICT DO NOTHING.

-- Activity
INSERT INTO activities (id, name, slug, description, order_number, is_active)
VALUES (
  14,
  'Aventura 4: Nos entendemos y respetamos',
  'aventura-4',
  'Cuarta aventura del nivel avanzado sobre comunicación y relaciones',
  14,
  true
)
ON CONFLICT (slug) DO NOTHING;

-- Scenes (ordered as they appear in the activity flow)
INSERT INTO scenes (activity_id, name, slug, order_number, is_active)
VALUES
  (14, 'Escena 1: ¿Qué dice mi cara?',                              'scene1', 1, true),
  (14, 'Escena 2: ¿Qué dice mi tono de voz?',                       'scene2', 2, true),
  (14, 'Escena 3: ¿Qué dicen mi cara y mi tono de voz?',            'scene3', 3, true),
  (14, 'Escena 4: ¿Qué cara pondrá?',                               'scene4', 4, true),
  (14, 'Escena 5: Aprendemos a ligar',                               'scene5', 5, true),
  (14, 'Escena 6: ¿Cómo le pido salir a la persona que me gusta?',  'scene6', 6, true),
  (14, 'Escena 7: ¿Cómo decir que no?',                             'scene7', 7, true)
ON CONFLICT (activity_id, slug) DO NOTHING;

-- Keep sequences up to date
SELECT setval('activities_id_seq', GREATEST((SELECT MAX(id) FROM activities), 14));
SELECT setval('scenes_id_seq', (SELECT MAX(id) FROM scenes));
