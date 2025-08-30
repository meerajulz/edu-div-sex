INSERT INTO scenes (activity_id, name, slug, order_number, is_active) VALUES
(4, 'Escena 1: Estableciendo Límites', 'scene1', 1, true),
(4, 'Escena 2: Seguridad Personal', 'scene2', 2, true),
(5, 'Escena 1: Comunicación Asertiva', 'scene1', 1, true),
(5, 'Escena 2: Expresando Sentimientos', 'scene2', 2, true),
(6, 'Escena 1: Respeto Mutuo', 'scene1', 1, true),
(6, 'Escena 2: Valores Familiares', 'scene2', 2, true),
(6, 'Escena 3: Diversidad e Inclusión', 'scene3', 3, true),
(6, 'Escena 4: Reflexión Final', 'scene4', 4, true)
ON CONFLICT (activity_id, slug) DO NOTHING;