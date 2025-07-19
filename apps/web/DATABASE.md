# Database Schema Documentation

## Overview

This database is designed for an educational platform that teaches mentally disabled children about sexual education. It tracks student abilities, progress, and teacher management.

## Tables

### 1. `users` (Extended)
Main authentication table for all user types with role hierarchy and student-specific fields.

```sql
- id (SERIAL PRIMARY KEY)
- email (VARCHAR UNIQUE)
- password_hash (VARCHAR)
- name (VARCHAR) - Full name (generated for students)
- role (VARCHAR) - 'owner', 'admin', 'teacher', or 'student'
- is_active (BOOLEAN)
- created_by (INTEGER) - References users(id) for audit trail
- last_password_change (TIMESTAMP)
- username (VARCHAR UNIQUE) - Student login username (firstname.lastname format)
- first_name (VARCHAR) - Student's first name
- last_name (VARCHAR) - Student's last name  
- sex (VARCHAR) - 'male' or 'female' for students
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

### 7. `teacher_admin_assignments`
Manages which admins can supervise which teachers.

```sql
- id (SERIAL PRIMARY KEY)
- teacher_id (INTEGER) - References users(id)
- admin_id (INTEGER) - References users(id)
- created_at (TIMESTAMP)
- UNIQUE(teacher_id, admin_id)
```

## Key Features

### Role-Based Access Control
Four-tier user hierarchy with specific permissions:
- **Owner**: Full system access, can manage all users and data
- **Admin**: Manages assigned teachers and their students, can reset passwords
- **Teacher**: Manages own students, can create/modify student accounts
- **Student**: Access to own progress and assigned content

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

### Hierarchical Management
- Owners can manage all users
- Admins supervise specific teachers through assignments
- Teachers manage their own students
- Comprehensive audit trail through created_by relationships

### Student Authentication System
- **Dual Login Support**: Students can login with either username or email
- **Simple Spanish Passwords**: Three-word Spanish passwords (e.g., "gato azul correr") for accessibility
- **Auto-Generated Usernames**: Format firstname.lastname (e.g., alex.martinez)
- **Teacher-Set Passwords**: Teachers create and manage student passwords
- **Secure but Memorable**: ~1.9M combinations with 196 easy-to-remember Spanish words
- **Accessible Vocabulary**: Animals, colors, family, actions, food, and body parts in Spanish
- **Accent Support**: Includes proper Spanish accents (á, é, í, ó, ú, ñ)

## Setup Commands

```bash
# Set up basic users table
npm run setup-db

# Set up complete schema
npm run setup-schema
```

## Default Data

After running `setup-schema`:
- **Owner**: `owner@example.com` / `testpass123`
- **Admin**: `admin@example.com` / `testpass123`
- **Teacher 1**: `teacher1@example.com` / `testpass123` (Maria Rodriguez)
- **Teacher 2**: `teacher2@example.com` / `testpass123` (Carlos Martinez)
- **Students with Spanish passwords**:
  - `alex.martinez` / `"gato azul correr"`
  - `sofia.garcia` / `"perro rojo saltar"`
  - `diego.lopez` / `"feliz árbol cinco"`
  - `luna.rodriguez` / `"sol verde jugar"`
- Sample students with varying ability levels
- All current activities (actividad-1 through actividad-6)
- Corresponding scenes for each activity
- Teacher-admin assignments and sample progress data

## API Endpoints

### User Management
- `GET/POST /api/admin/users` - User management (owners/admins)
- `GET/PUT/DELETE /api/admin/users/[id]` - Individual user operations
- `GET/POST /api/admin/teacher-assignments` - Teacher-admin assignments
- `DELETE /api/admin/teacher-assignments/[id]` - Remove assignments

### Student Management
- `GET/POST /api/students` - Student management with new fields (first_name, last_name, sex)
- `GET/PUT/DELETE /api/students/[id]` - Individual student operations
- `GET /api/students/[id]/progress` - Progress tracking
- `GET /api/students/[id]/accessible-content` - Available content

### Password Management
- `GET /api/admin/generate-password` - Generate simple Spanish password for students
- `POST /api/admin/generate-password` - Validate custom Spanish simple password

### Progress & Sessions
- `POST /api/progress` - Save student progress
- `GET/POST /api/sessions` - Session management

### Activities
- `GET /api/activities` - Get all activities (teachers+)

### Authentication
- Supports both email and username login
- Backwards compatible with existing email-based logins
- Spanish simple password validation for student accounts
- Error messages in Spanish for user-facing content