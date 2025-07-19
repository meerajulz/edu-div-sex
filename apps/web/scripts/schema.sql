-- Educational Platform Database Schema
-- For tracking student progress and teacher management

-- Update users table to include roles
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student' CHECK (role IN ('teacher', 'student'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Students table - stores student information and abilities
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INTEGER,
    
    -- Ability tracking (customize based on your needs)
    reading_level INTEGER DEFAULT 1 CHECK (reading_level >= 1 AND reading_level <= 5),
    comprehension_level INTEGER DEFAULT 1 CHECK (comprehension_level >= 1 AND comprehension_level <= 5),
    attention_span INTEGER DEFAULT 1 CHECK (attention_span >= 1 AND attention_span <= 5), -- 1=short, 5=long
    motor_skills INTEGER DEFAULT 1 CHECK (motor_skills >= 1 AND motor_skills <= 5),
    
    -- Additional abilities as JSON for flexibility
    additional_abilities JSONB DEFAULT '{}',
    
    -- Notes from teacher
    notes TEXT,
    
    -- Relationships
    teacher_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- If student has login
    
    -- Metadata
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

-- Activities table - defines the structure of your educational content
CREATE TABLE IF NOT EXISTS activities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL, -- e.g., 'actividad-1'
    description TEXT,
    required_reading_level INTEGER DEFAULT 1,
    required_comprehension_level INTEGER DEFAULT 1,
    required_attention_span INTEGER DEFAULT 1,
    required_motor_skills INTEGER DEFAULT 1,
    order_number INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scenes table - individual scenes within activities
CREATE TABLE IF NOT EXISTS scenes (
    id SERIAL PRIMARY KEY,
    activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL, -- e.g., 'scene1'
    description TEXT,
    order_number INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(activity_id, slug)
);

-- Progress tracking table - tracks student progress through activities and scenes
CREATE TABLE IF NOT EXISTS student_progress (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    activity_id INTEGER REFERENCES activities(id) ON DELETE CASCADE,
    scene_id INTEGER REFERENCES scenes(id) ON DELETE CASCADE,
    
    -- Progress tracking
    status VARCHAR(20) DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'skipped')),
    attempts INTEGER DEFAULT 0,
    completion_percentage INTEGER DEFAULT 0 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    
    -- Game-specific data (scores, choices, etc.)
    game_data JSONB DEFAULT '{}',
    
    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint to prevent duplicate progress entries
    UNIQUE(student_id, activity_id, scene_id)
);

-- Student sessions table - tracks login sessions and time spent
CREATE TABLE IF NOT EXISTS student_sessions (
    id SERIAL PRIMARY KEY,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_end TIMESTAMP WITH TIME ZONE,
    total_time_minutes INTEGER,
    activities_accessed INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_teacher_id ON students(teacher_id);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_activity_scene ON student_progress(activity_id, scene_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_status ON student_progress(status);
CREATE INDEX IF NOT EXISTS idx_student_sessions_student_id ON student_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_activities_slug ON activities(slug);
CREATE INDEX IF NOT EXISTS idx_scenes_activity_slug ON scenes(activity_id, slug);

-- Update trigger for students table
CREATE OR REPLACE FUNCTION update_updated_at_column_students()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON students 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column_students();