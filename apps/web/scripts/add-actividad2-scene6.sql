INSERT INTO scenes (activity_id, name, slug, order_number, is_active)
VALUES (2, 'Escena 6: El círculo de confianza', 'scene6', 6, true)
ON CONFLICT (activity_id, slug) DO NOTHING;

SELECT setval('scenes_id_seq', (SELECT MAX(id) FROM scenes));
