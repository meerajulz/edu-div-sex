-- Add scene1-1 to Activity 3 for the new scene structure
-- This script adds the scene1-1 scene for Activity 3

-- Insert the new scene between scene1 and scene2
INSERT INTO scenes (activity_id, name, slug, order_number, is_active) VALUES
(3, 'Escena 1-1: El orgasmo masculino: la eyaculación', 'scene1-1', 2, true);

-- Update scene2 order number to make room for scene1-1
UPDATE scenes
SET order_number = 3
WHERE activity_id = 3 AND slug = 'scene2';

-- Verify the update
SELECT id, activity_id, name, slug, order_number, is_active
FROM scenes
WHERE activity_id = 3
ORDER BY order_number;