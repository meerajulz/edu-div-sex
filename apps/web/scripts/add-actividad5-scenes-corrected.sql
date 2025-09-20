-- Update actividad-5 and replace its scenes with the new 4-scene structure
-- This updates "Comunicación" to "Entender y respetar"

-- First, update the existing activity
UPDATE activities SET
    name = 'Entender y respetar',
    slug = 'actividad-5',
    description = 'Activity about understanding emotions and respect through facial expressions, voice tone, and social interactions',
    order_number = 5,
    is_active = true
WHERE id = 5;

-- Remove old scenes for actividad-5 (if any exist)
DELETE FROM scenes WHERE activity_id = 5;

-- Add scene1: ¿Qué dice mi cara?
INSERT INTO scenes (activity_id, name, slug, description, order_number, is_active, created_at)
VALUES (
    5,
    '¿Qué dice mi cara?',
    'scene1',
    'Game about understanding facial expressions and emotions',
    1,
    true,
    NOW()
);

-- Add scene1-1: ¿Qué dice mi tono de voz?
INSERT INTO scenes (activity_id, name, slug, description, order_number, is_active, created_at)
VALUES (
    5,
    '¿Qué dice mi tono de voz?',
    'scene1-1',
    'Game about understanding voice tone and emotions',
    2,
    true,
    NOW()
);

-- Add scene1-2: ¿Qué cara pondrá...?
INSERT INTO scenes (activity_id, name, slug, description, order_number, is_active, created_at)
VALUES (
    5,
    '¿Qué cara pondrá...?',
    'scene1-2',
    'Game about predicting facial expressions in different situations',
    3,
    true,
    NOW()
);

-- Add scene2: ¿Cómo ligamos?
INSERT INTO scenes (activity_id, name, slug, description, order_number, is_active, created_at)
VALUES (
    5,
    '¿Cómo ligamos?',
    'scene2',
    'Game about social connections and relationships',
    4,
    true,
    NOW()
);

-- Display results
SELECT 'Activity 5 updated and new scenes added successfully' as result;