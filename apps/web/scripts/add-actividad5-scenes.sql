-- Add actividad-5 and its scenes to the database
-- This adds the 4-scene structure for "Entender y respetar"

-- First, add the activity (if it doesn't exist)
INSERT INTO activities (id, name, slug, description, order_number, is_active, created_at, updated_at)
VALUES (
    5,
    'Entender y respetar',
    'actividad-5',
    'Activity about understanding emotions and respect through facial expressions, voice tone, and social interactions',
    5,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    order_number = EXCLUDED.order_number,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Add scene1: ¿Qué dice mi cara?
INSERT INTO scenes (id, activity_id, name, slug, description, order_number, is_active, created_at, updated_at)
VALUES (
    16, -- Assuming we continue from existing scene IDs
    5,
    '¿Qué dice mi cara?',
    'scene1',
    'Game about understanding facial expressions and emotions',
    1,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    activity_id = EXCLUDED.activity_id,
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    order_number = EXCLUDED.order_number,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Add scene1-1: ¿Qué dice mi tono de voz?
INSERT INTO scenes (id, activity_id, name, slug, description, order_number, is_active, created_at, updated_at)
VALUES (
    17,
    5,
    '¿Qué dice mi tono de voz?',
    'scene1-1',
    'Game about understanding voice tone and emotions',
    2,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    activity_id = EXCLUDED.activity_id,
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    order_number = EXCLUDED.order_number,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Add scene1-2: ¿Qué cara pondrá...?
INSERT INTO scenes (id, activity_id, name, slug, description, order_number, is_active, created_at, updated_at)
VALUES (
    18,
    5,
    '¿Qué cara pondrá...?',
    'scene1-2',
    'Game about predicting facial expressions in different situations',
    3,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    activity_id = EXCLUDED.activity_id,
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    order_number = EXCLUDED.order_number,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Add scene2: ¿Cómo ligamos?
INSERT INTO scenes (id, activity_id, name, slug, description, order_number, is_active, created_at, updated_at)
VALUES (
    19,
    5,
    '¿Cómo ligamos?',
    'scene2',
    'Game about social connections and relationships',
    4,
    true,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    activity_id = EXCLUDED.activity_id,
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    order_number = EXCLUDED.order_number,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Display results
SELECT 'Activity 5 and scenes added successfully' as result;