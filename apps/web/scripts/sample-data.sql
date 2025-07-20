-- Sample data for the educational platform with new role hierarchy
-- This script populates the database with test data including all user roles

-- Insert sample users with role hierarchy
DO $$
DECLARE
    owner_id INTEGER;
    admin_id INTEGER;
    teacher1_id INTEGER;
    teacher2_id INTEGER;
    student_user_id INTEGER;
BEGIN
    -- Insert owner (dev with full access)
    INSERT INTO users (email, password_hash, name, role, first_name, last_name) 
    VALUES ('owner@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/ewu2gGG6U7C0JaYK2', 'System Owner', 'owner', 'System', 'Owner')
    RETURNING id INTO owner_id;

    -- Insert admin (can manage teachers and students)
    INSERT INTO users (email, password_hash, name, role, created_by, first_name, last_name) 
    VALUES ('admin@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/ewu2gGG6U7C0JaYK2', 'Main Administrator', 'admin', owner_id, 'Main', 'Administrator')
    RETURNING id INTO admin_id;

    -- Insert teachers
    INSERT INTO users (email, password_hash, name, role, created_by, first_name, last_name) 
    VALUES ('teacher1@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/ewu2gGG6U7C0JaYK2', 'Maria Rodriguez', 'teacher', admin_id, 'Maria', 'Rodriguez')
    RETURNING id INTO teacher1_id;

    INSERT INTO users (email, password_hash, name, role, created_by, first_name, last_name) 
    VALUES ('teacher2@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/ewu2gGG6U7C0JaYK2', 'Carlos Martinez', 'teacher', admin_id, 'Carlos', 'Martinez')
    RETURNING id INTO teacher2_id;

    -- Insert student with login (using simple Spanish password: "gato azul correr" hashed)
    INSERT INTO users (email, password_hash, name, role, created_by, username, first_name, last_name, sex) 
    VALUES ('student@example.com', '$2b$12$f/svWN38hKA5Gj7m/TjrJu62zB625Yvz9qQOkILNy3iz2m23TL2o2', 'Alex Martinez', 'student', teacher1_id, 'alex.martinez', 'Alex', 'Martinez', 'male')
    RETURNING id INTO student_user_id;

    -- Assign admin to manage teachers
    INSERT INTO teacher_admin_assignments (teacher_id, admin_id) VALUES 
    (teacher1_id, admin_id),
    (teacher2_id, admin_id);

    -- Add more student users with simple Spanish passwords
    INSERT INTO users (email, password_hash, name, role, created_by, username, first_name, last_name, sex) 
    VALUES ('sofia.garcia@example.com', '$2b$12$UCnVwUwPgeRdCdhvPEobk.ltAONSAbt8Nb.yu.ocn/Q26aoUmQq.u', 'Sofia Garcia', 'student', teacher1_id, 'sofia.garcia', 'Sofia', 'Garcia', 'female');

    INSERT INTO users (email, password_hash, name, role, created_by, username, first_name, last_name, sex) 
    VALUES ('diego.lopez@example.com', '$2b$12$ZZw2N66jnVS2jAL7eQMw3e2jcnC/kt39oTahNXvhfTlwxeyeQ1pw6', 'Diego Lopez', 'student', teacher2_id, 'diego.lopez', 'Diego', 'Lopez', 'male');

    INSERT INTO users (email, password_hash, name, role, created_by, username, first_name, last_name, sex) 
    VALUES ('luna.rodriguez@example.com', '$2b$12$K2zCDwOO2W5x8ZE.ncciGeKnXKdzsE4wP9DEbGxYTmRo48KrXgU0m', 'Luna Rodriguez', 'student', teacher2_id, 'luna.rodriguez', 'Luna', 'Rodriguez', 'female');

    -- Insert sample students (linking some to user accounts)
    INSERT INTO students (name, age, reading_level, comprehension_level, attention_span, motor_skills, teacher_id, user_id, notes) VALUES 
    ('Alex Martinez', 12, 3, 2, 4, 3, teacher1_id, student_user_id, 'Shows good progress with visual learning. Needs extra time for reading comprehension.'),
    ('Sofia Garcia', 10, 2, 3, 2, 4, teacher1_id, (SELECT id FROM users WHERE username = 'sofia.garcia'), 'Excellent motor skills, works well with interactive games. Short attention span.'),
    ('Diego Lopez', 14, 4, 4, 3, 2, teacher2_id, (SELECT id FROM users WHERE username = 'diego.lopez'), 'Advanced reading skills but needs support with fine motor tasks.'),
    ('Luna Rodriguez', 9, 1, 2, 5, 3, teacher2_id, (SELECT id FROM users WHERE username = 'luna.rodriguez'), 'Beginning reader but very focused. Responds well to structured activities.');

END $$;

-- Insert sample activities with different difficulty levels
INSERT INTO activities (name, slug, description, required_reading_level, required_comprehension_level, required_attention_span, required_motor_skills, order_number) VALUES
('Descubriendo mi cuerpo', 'actividad-1', 'Introduction to body parts and basic anatomy', 1, 1, 2, 2, 1),
('Intimidad y límites', 'actividad-2', 'Understanding personal boundaries and privacy', 2, 2, 3, 2, 2),
('Placer sexual y salud', 'actividad-3', 'Advanced topics about sexual health and pleasure', 3, 3, 4, 3, 3),
('Cuidando mi sexualidad', 'actividad-4', 'Sexual health, protection, and self-care', 3, 4, 4, 3, 4),
('Entender y respetar', 'actividad-5', 'Consent, respect, and healthy relationships', 4, 4, 5, 3, 5),
('Diversidad sexual', 'actividad-6', 'Understanding sexual diversity and identity', 4, 5, 5, 3, 6);

-- Insert sample scenes for each activity
DO $$
DECLARE
    act_id INTEGER;
BEGIN
    -- Scenes for Actividad 1
    SELECT id INTO act_id FROM activities WHERE slug = 'actividad-1';
    INSERT INTO scenes (activity_id, name, slug, description, order_number) VALUES
    (act_id, 'Partes del cuerpo', 'scene1', 'Learning basic body parts', 1),
    (act_id, 'Mi cuerpo es único', 'scene2', 'Understanding body uniqueness', 2),
    (act_id, 'Cuidando mi cuerpo', 'scene3', 'Basic body care and hygiene', 3),
    (act_id, 'Juego de identificación', 'scene4', 'Interactive body parts game', 4),
    (act_id, 'Expresiones y emociones', 'scene5', 'Recognizing feelings and expressions', 5),
    (act_id, 'Diferencias corporales', 'scene6', 'Understanding body differences', 6),
    (act_id, 'Resumen y práctica', 'scene7', 'Review and practice session', 7);

    -- Scenes for Actividad 2
    SELECT id INTO act_id FROM activities WHERE slug = 'actividad-2';
    INSERT INTO scenes (activity_id, name, slug, description, order_number) VALUES
    (act_id, 'Espacios privados', 'scene1', 'Understanding private spaces', 1),
    (act_id, 'Partes privadas', 'scene2', 'Learning about private body parts', 2),
    (act_id, 'Límites personales', 'scene3', 'Setting personal boundaries', 3),
    (act_id, 'Situaciones apropiadas', 'scene4', 'Recognizing appropriate situations', 4);

    -- Scenes for Actividad 3
    SELECT id INTO act_id FROM activities WHERE slug = 'actividad-3';
    INSERT INTO scenes (activity_id, name, slug, description, order_number) VALUES
    (act_id, 'Cambios corporales', 'scene1', 'Understanding body changes', 1),
    (act_id, 'Salud sexual', 'scene2', 'Introduction to sexual health', 2);
END $$;

-- Insert some sample progress data
DO $$
DECLARE
    student_id INTEGER;
    activity_id INTEGER;
    scene_id INTEGER;
BEGIN
    -- Get student and activity IDs
    SELECT s.id INTO student_id FROM students s JOIN users u ON s.user_id = u.id WHERE u.email = 'student@example.com';
    SELECT id INTO activity_id FROM activities WHERE slug = 'actividad-1';
    
    -- Insert progress for first few scenes
    SELECT id INTO scene_id FROM scenes WHERE activity_id = activity_id AND slug = 'scene1';
    INSERT INTO student_progress (student_id, activity_id, scene_id, status, completion_percentage, attempts, started_at, completed_at, last_accessed_at)
    VALUES (student_id, activity_id, scene_id, 'completed', 100, 2, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days');

    SELECT id INTO scene_id FROM scenes WHERE activity_id = activity_id AND slug = 'scene2';
    INSERT INTO student_progress (student_id, activity_id, scene_id, status, completion_percentage, attempts, started_at, last_accessed_at)
    VALUES (student_id, activity_id, scene_id, 'in_progress', 65, 1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');
END $$;

-- Insert sample session data
DO $$
DECLARE
    student_id INTEGER;
BEGIN
    SELECT s.id INTO student_id FROM students s JOIN users u ON s.user_id = u.id WHERE u.email = 'student@example.com';
    
    INSERT INTO student_sessions (student_id, session_start, session_end, total_time_minutes, activities_accessed) VALUES
    (student_id, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '25 minutes', 25, 1),
    (student_id, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '18 minutes', 18, 1);
END $$;

-- Print summary
DO $$
BEGIN
    RAISE NOTICE 'Sample data inserted successfully!';
    RAISE NOTICE 'Test credentials for staff (password: "testpass123"):';
    RAISE NOTICE '- Owner: owner@example.com';
    RAISE NOTICE '- Admin: admin@example.com';
    RAISE NOTICE '- Teacher 1: teacher1@example.com';
    RAISE NOTICE '- Teacher 2: teacher2@example.com';
    RAISE NOTICE '';
    RAISE NOTICE 'Student credentials (username/password with simple Spanish passwords):';
    RAISE NOTICE '- alex.martinez / "gato azul correr"';
    RAISE NOTICE '- sofia.garcia / "perro rojo saltar"';
    RAISE NOTICE '- diego.lopez / "feliz árbol cinco"';
    RAISE NOTICE '- luna.rodriguez / "sol verde jugar"';
    RAISE NOTICE '';
    RAISE NOTICE 'Students can also login with email if needed.';
END $$;