INSERT INTO activities (id, name, slug, description, order_number, is_active) VALUES
(1, 'Actividad 1: Conociendo nuestro cuerpo', 'actividad-1', 'Primera actividad sobre educación sexual', 1, true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO scenes (activity_id, name, slug, order_number, is_active) VALUES
(1, 'Escena 1: Introducción', 'scene1', 1, true)
ON CONFLICT (activity_id, slug) DO NOTHING;