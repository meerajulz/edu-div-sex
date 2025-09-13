INSERT INTO scenes (activity_id, name, slug, order_number, is_active) VALUES (2, 'Escena 5: Tu Cofre de la Intimidad', 'scene5', 5, true) ON CONFLICT (activity_id, slug) DO NOTHING;

SELECT s.id, s.name, s.slug, s.order_number, a.name as activity_name FROM scenes s JOIN activities a ON a.id = s.activity_id WHERE a.id = 2 ORDER BY s.order_number;