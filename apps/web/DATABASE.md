# Database Schema Documentation

## Overview

This database is designed for an educational platform that teaches mentally disabled children about sexual education. It tracks student abilities, progress, and teacher management.

## Tables

### 1. `users` (Extended)
Main authentication table for both teachers and students.

```sql
- id (SERIAL PRIMARY KEY)
- email (VARCHAR UNIQUE)
- password_hash (VARCHAR)
- name (VARCHAR)
- role (VARCHAR) - 'teacher' or 'student'
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

### 2. `students`
Stores student information and their individual abilities.

```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR) - Student's display name
- age (INTEGER)
- reading_level (INTEGER 1-5) - Reading comprehension ability
- comprehension_level (INTEGER 1-5) - General understanding ability
- attention_span (INTEGER 1-5) - Focus duration (1=short, 5=long)
- motor_skills (INTEGER 1-5) - Physical interaction ability
- additional_abilities (JSONB) - Flexible storage for custom abilities
- notes (TEXT) - Teacher notes about the student
- teacher_id (INTEGER) - References users(id)
- user_id (INTEGER) - References users(id) if student has login
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMP)
```

### 3. `activities`
Defines the main educational modules.

```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR) - Display name
- slug (VARCHAR UNIQUE) - URL-friendly identifier (e.g., 'actividad-1')
- description (TEXT)
- required_reading_level (INTEGER) - Minimum ability requirements
- required_comprehension_level (INTEGER)
- required_attention_span (INTEGER)
- required_motor_skills (INTEGER)
- order_number (INTEGER) - Sequence order
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
```

### 4. `scenes`
Individual scenes within each activity.

```sql
- id (SERIAL PRIMARY KEY)
- activity_id (INTEGER) - References activities(id)
- name (VARCHAR) - Display name
- slug (VARCHAR) - Scene identifier (e.g., 'scene1')
- description (TEXT)
- order_number (INTEGER) - Order within activity
- is_active (BOOLEAN)
- created_at (TIMESTAMP)
```

### 5. `student_progress`
Tracks student progress through activities and scenes.

```sql
- id (SERIAL PRIMARY KEY)
- student_id (INTEGER) - References students(id)
- activity_id (INTEGER) - References activities(id)
- scene_id (INTEGER) - References scenes(id)
- status (VARCHAR) - 'not_started', 'in_progress', 'completed', 'skipped'
- attempts (INTEGER) - Number of attempts
- completion_percentage (INTEGER 0-100) - Progress within scene
- game_data (JSONB) - Stores game scores, choices, etc.
- started_at (TIMESTAMP) - When first accessed
- completed_at (TIMESTAMP) - When finished
- last_accessed_at (TIMESTAMP) - Last interaction
```

### 6. `student_sessions`
Tracks login sessions and time spent.

```sql
- id (SERIAL PRIMARY KEY)
- student_id (INTEGER) - References students(id)
- session_start (TIMESTAMP)
- session_end (TIMESTAMP)
- total_time_minutes (INTEGER)
- activities_accessed (INTEGER)
- created_at (TIMESTAMP)
```

## Key Features

### Ability-Based Content Filtering
Students see content based on their ability levels:
- Activities have minimum requirements
- Content adapts to student capabilities
- Teachers can adjust abilities as students progress

### Progress Tracking
- Granular tracking at scene level
- Flexible game data storage (JSON)
- Resume capability from last position
- Attempt counting for assessment

### Teacher Management
- Teachers can manage multiple students
- Detailed ability profiling
- Progress monitoring and reporting
- Notes and observations

## Setup Commands

```bash
# Set up basic users table
npm run setup-db

# Set up complete schema
npm run setup-schema
```

## Default Data

After running `setup-schema`:
- Test teacher: `test@example.com` / `testpass123`
- Sample student: "Alex Martinez" with mixed ability levels
- All current activities (actividad-1, actividad-2, actividad-3)
- Corresponding scenes for each activity

## API Endpoints (To Be Implemented)

- `GET/POST /api/students` - Student management
- `GET/PUT /api/students/[id]/progress` - Progress tracking
- `POST /api/progress/save` - Save student progress
- `GET /api/activities/accessible/[studentId]` - Get available content