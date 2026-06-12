-- Update Aventura 4 scenes to match new 3-section structure

INSERT INTO scenes (activity_id, name, slug, order_number, is_active)
VALUES
  (14, 'Juego 1: La cara habla mas que las palabras', 'juego1', 2, true)
ON CONFLICT (activity_id, slug) DO NOTHING;

UPDATE scenes SET is_active = false
WHERE activity_id = 14 AND slug IN ('scene3', 'scene4', 'scene5', 'scene6', 'scene7');

UPDATE scenes SET order_number = 1 WHERE activity_id = 14 AND slug = 'scene1';
UPDATE scenes SET order_number = 2 WHERE activity_id = 14 AND slug = 'juego1';
UPDATE scenes SET order_number = 3 WHERE activity_id = 14 AND slug = 'scene2';

UPDATE scenes SET is_active = true, name = 'Escena 2: Aprendemos a ligar'
WHERE activity_id = 14 AND slug = 'scene2';

UPDATE scenes SET is_active = true, order_number = 4, name = 'Escena 3: Como le pido salir'
WHERE activity_id = 14 AND slug = 'scene3';

SELECT setval('scenes_id_seq', (SELECT MAX(id) FROM scenes));
