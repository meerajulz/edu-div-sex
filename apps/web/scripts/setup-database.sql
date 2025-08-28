-- Educational Platform Database Setup
-- Complete schema for educational platform with role hierarchy

-- Create base users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add new columns to users table for role hierarchy and student-specific fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'student';

-- Drop existing constraint if it exists to avoid conflicts
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

-- Update any existing users without valid roles
UPDATE users SET role = 'student' WHERE role IS NULL OR role NOT IN ('owner', 'admin', 'teacher', 'student');

-- Add check constraint
ALTER TABLE users ADD CONSTRAINT users_role_check 
CHECK (role IN ('owner', 'admin', 'teacher', 'student'));
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_password_change TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE users ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;

-- Add student-specific fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);
ALTER TABLE users ADD COLUMN IF NOT EXISTS sex VARCHAR(10);

-- Drop and recreate sex constraint  
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_sex_check;
ALTER TABLE users ADD CONSTRAINT users_sex_check 
CHECK (sex IS NULL OR sex IN ('male', 'female'));

-- Teacher-Admin relationships table - tracks which admins can manage which teachers
CREATE TABLE IF NOT EXISTS teacher_admin_assignments (
    id SERIAL PRIMARY KEY,
    teacher_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    admin_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(teacher_id, admin_id)
);

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
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_by ON users(created_by);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_teacher_admin_teacher_id ON teacher_admin_assignments(teacher_id);
CREATE INDEX IF NOT EXISTS idx_teacher_admin_admin_id ON teacher_admin_assignments(admin_id);
CREATE INDEX IF NOT EXISTS idx_students_teacher_id ON students(teacher_id);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_student_id ON student_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_activity_scene ON student_progress(activity_id, scene_id);
CREATE INDEX IF NOT EXISTS idx_student_progress_status ON student_progress(status);
CREATE INDEX IF NOT EXISTS idx_student_sessions_student_id ON student_sessions(student_id);
CREATE INDEX IF NOT EXISTS idx_activities_slug ON activities(slug);
CREATE INDEX IF NOT EXISTS idx_scenes_activity_slug ON scenes(activity_id, slug);

-- Update trigger functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION update_updated_at_column_students()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_students_updated_at ON students;
CREATE TRIGGER update_students_updated_at 
    BEFORE UPDATE ON students 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column_students();

-- Insert test users with different roles (password: testpass123)
INSERT INTO users (email, password_hash, name, role, username, first_name, last_name) 
VALUES ('test@example.com', '$2b$12$ZacLJuTu6S3frCLVN0OGn.mp.r9xYCvVydlwvP9YRh5WI8tpmq3MK', 'Test User', 'owner', 'testuser', 'Test', 'User')
ON CONFLICT (email) DO UPDATE SET 
    role = EXCLUDED.role,
    username = EXCLUDED.username,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    password_hash = EXCLUDED.password_hash;

INSERT INTO users (email, password_hash, name, role, username, first_name, last_name) 
VALUES ('admin@example.com', '$2b$12$ZacLJuTu6S3frCLVN0OGn.mp.r9xYCvVydlwvP9YRh5WI8tpmq3MK', 'Admin User', 'admin', 'adminuser', 'Admin', 'User')
ON CONFLICT (email) DO UPDATE SET 
    role = EXCLUDED.role,
    username = EXCLUDED.username,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    password_hash = EXCLUDED.password_hash;

INSERT INTO users (email, password_hash, name, role, username, first_name, last_name) 
VALUES ('teacher@example.com', '$2b$12$ZacLJuTu6S3frCLVN0OGn.mp.r9xYCvVydlwvP9YRh5WI8tpmq3MK', 'Teacher User', 'teacher', 'teacheruser', 'Teacher', 'User')
ON CONFLICT (email) DO UPDATE SET 
    role = EXCLUDED.role,
    username = EXCLUDED.username,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    password_hash = EXCLUDED.password_hash;

INSERT INTO users (email, password_hash, name, role, username, first_name, last_name, sex) 
VALUES ('bill@example.com', '$2b$12$ZacLJuTu6S3frCLVN0OGn.mp.r9xYCvVydlwvP9YRh5WI8tpmq3MK', 'Bill Student', 'student', 'bill', 'Bill', 'Student', 'male')
ON CONFLICT (email) DO UPDATE SET 
    role = EXCLUDED.role,
    username = EXCLUDED.username,
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    sex = EXCLUDED.sex,
    password_hash = EXCLUDED.password_hash;