INSERT INTO activities (id, name, slug, description, order_number, is_active) VALUES
(4, 'Actividad 4: Límites personales', 'actividad-4', 'Cuarta actividad sobre límites y seguridad', 4, true),
(5, 'Actividad 5: Comunicación', 'actividad-5', 'Quinta actividad sobre comunicación efectiva', 5, true),
(6, 'Actividad 6: Respeto y valores', 'actividad-6', 'Sexta actividad sobre respeto y valores', 6, true)
ON CONFLICT (id) DO NOTHING;