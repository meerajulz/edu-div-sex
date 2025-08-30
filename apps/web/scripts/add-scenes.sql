INSERT INTO scenes (activity_id, name, slug, order_number, is_active) VALUES
(1, 'Escena 2: Juego de Identificación', 'scene2', 2, true),
(1, 'Escena 3: Partes Íntimas', 'scene3', 3, true),
(1, 'Escena 4: Diferencias de Género', 'scene4', 4, true),
(1, 'Escena 5: Higiene Personal', 'scene5', 5, true),
(1, 'Escena 6: Límites Personales', 'scene6', 6, true),
(1, 'Escena 7: Resumen', 'scene7', 7, true)
ON CONFLICT (activity_id, slug) DO NOTHING;