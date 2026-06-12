INSERT INTO scenes (activity_id, name, slug, order_number, is_active)
VALUES (11, 'Juego 4: Concurso - El cuerpo de los mayores', 'juego4', 5, true)
ON CONFLICT (activity_id, slug) DO NOTHING;

SELECT setval('scenes_id_seq', (SELECT MAX(id) FROM scenes));
