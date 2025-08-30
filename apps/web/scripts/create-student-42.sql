-- Create student record for user ID 42 if it doesn't exist
INSERT INTO students (name, user_id, age, reading_level, comprehension_level, attention_span, motor_skills, additional_abilities, notes, teacher_id) 
SELECT 
  u.name,
  42,
  8,  -- default age
  3,  -- default reading level
  3,  -- default comprehension level  
  3,  -- default attention span
  3,  -- default motor skills
  '{}', -- empty additional abilities
  'Auto-created student record',
  NULL -- no teacher assigned
FROM users u
WHERE u.id = 42 
  AND NOT EXISTS (SELECT 1 FROM students WHERE user_id = 42);