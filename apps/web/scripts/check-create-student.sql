-- Check if student record exists for user ID 42
SELECT 
  u.id as user_id, 
  u.email, 
  u.name as user_name, 
  u.role,
  s.id as student_id,
  s.name as student_name
FROM users u
LEFT JOIN students s ON s.user_id = u.id
WHERE u.id = 42;

-- Create student record if missing (only run this if no student record exists)
-- INSERT INTO students (name, user_id, age, reading_level, comprehension_level, attention_span, motor_skills, additional_abilities, notes) 
-- VALUES (
--   (SELECT name FROM users WHERE id = 42),
--   42,
--   8,  -- default age
--   3,  -- default reading level
--   3,  -- default comprehension level  
--   3,  -- default attention span
--   3,  -- default motor skills
--   '{}', -- empty additional abilities
--   'Auto-created student record'
-- );