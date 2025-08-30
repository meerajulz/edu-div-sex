INSERT INTO students (name, user_id, age, reading_level, comprehension_level, attention_span, motor_skills, additional_abilities, notes) 
SELECT name, 42, 8, 3, 3, 3, 3, '{}', 'Auto-created student record'
FROM users 
WHERE id = 42 AND NOT EXISTS (SELECT 1 FROM students WHERE user_id = 42);