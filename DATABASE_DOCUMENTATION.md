# Database Documentation - Educational Platform

## Table of Contents
1. [Overview](#overview)
2. [Database Architecture](#database-architecture)
3. [Tables](#tables)
4. [Relationships](#relationships)
5. [Key Concepts](#key-concepts)
6. [Indexes and Performance](#indexes-and-performance)
7. [Common Queries](#common-queries)
8. [Migration History](#migration-history)

---

## Overview

### Database Technology
- **Database**: PostgreSQL
- **Hosting**: Neon (Serverless PostgreSQL)
- **Connection**: Pooled connections via `pg` library

### Purpose
This database supports an educational platform designed to:
- Manage a hierarchy of users (Owner → Admin → Teacher → Student)
- Track student abilities and supervision levels
- Monitor student progress through educational activities and scenes
- Enable role-based access control for the dashboard

---

## Database Architecture

### Entity Relationship Diagram (Conceptual)

```
┌─────────────┐
│    users    │ (Owner, Admin, Teacher, Student)
└──────┬──────┘
       │
       ├──────────────────────┐
       │                      │
       ▼                      ▼
┌──────────────────┐   ┌────────────────┐
│teacher_admin_    │   │   students     │
│  assignments     │   └────────┬───────┘
└──────────────────┘            │
                                │
                                ▼
                         ┌──────────────────┐
                         │student_progress  │
                         └──────┬───────────┘
                                │
                    ┌───────────┴───────────┐
                    ▼                       ▼
              ┌───────────┐         ┌────────────┐
              │activities │         │   scenes   │
              └───────────┘         └────────────┘
```

---

## Tables

### 1. `users`

**Purpose**: Stores all system users (Owner, Admin, Teacher, Student)

**Columns**:

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Unique user identifier |
| `email` | VARCHAR(255) UNIQUE | User's email (for login) |
| `password_hash` | TEXT | Bcrypt hashed password |
| `name` | VARCHAR(255) | Full name |
| `role` | VARCHAR(20) | User role: 'owner', 'admin', 'teacher', 'student' |
| `is_active` | BOOLEAN | Whether the user is active (default: true) |
| `created_by` | INTEGER | Foreign key to user who created this user |
| `created_at` | TIMESTAMP | When the user was created |
| `updated_at` | TIMESTAMP | Last update timestamp |
| `deleted_at` | TIMESTAMP | Soft delete timestamp (null if active) |
| `last_password_change` | TIMESTAMP | Last password change date |
| `username` | VARCHAR(50) UNIQUE | Username (for students, optional) |
| `first_name` | VARCHAR(100) | First name |
| `last_name` | VARCHAR(100) | Last name |
| `sex` | VARCHAR(10) | 'male' or 'female' |

**Important Notes**:
- Uses **soft delete** pattern - records are never truly deleted, just marked with `deleted_at`
- Password stored using **bcrypt** (12 salt rounds)
- `role` field determines permissions throughout the system
- Students may have both `email` and `username` for login flexibility

**Constraints**:
- `role` CHECK: Must be 'owner', 'admin', 'teacher', or 'student'
- `sex` CHECK: Must be 'male' or 'female'
- `email` UNIQUE: No duplicate emails
- `username` UNIQUE: No duplicate usernames

---

### 2. `teacher_admin_assignments`

**Purpose**: Defines which admins can manage which teachers

**Columns**:

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Unique assignment identifier |
| `teacher_id` | INTEGER | Foreign key to users (teacher) |
| `admin_id` | INTEGER | Foreign key to users (admin) |
| `created_at` | TIMESTAMP | When assignment was created |

**Important Notes**:
- Enables **role-based access control**
- An admin can only see/manage teachers assigned to them
- An admin can see all students of their assigned teachers
- Unique constraint prevents duplicate assignments

**Relationships**:
- `teacher_id` → `users.id` (CASCADE DELETE)
- `admin_id` → `users.id` (CASCADE DELETE)

---

### 3. `students`

**Purpose**: Stores student profiles with abilities and metadata

**Columns**:

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Unique student identifier |
| `name` | VARCHAR(255) | Full name of student |
| `age` | INTEGER | Student's age |
| `reading_level` | INTEGER | Reading ability (1-5 scale) |
| `comprehension_level` | INTEGER | Comprehension ability (1-5 scale) |
| `attention_span` | INTEGER | Attention ability (1-5 scale) |
| `motor_skills` | INTEGER | Motor skills ability (1-5 scale) |
| `supervision_level` | INTEGER | Calculated supervision level (1-3) |
| `additional_abilities` | JSONB | Flexible JSON field for extra data |
| `notes` | TEXT | Teacher notes about student |
| `teacher_id` | INTEGER | Foreign key to users (teacher) |
| `user_id` | INTEGER | Foreign key to users (optional login) |
| `created_at` | TIMESTAMP | When student was created |
| `updated_at` | TIMESTAMP | Last update (auto-updated via trigger) |
| `is_active` | BOOLEAN | Whether student is active |

**Important Notes**:

#### Ability Levels (1-5 Scale):
Each ability is rated on a scale of 1-5:
- **1**: Basic/Low ability
- **2**: Beginner
- **3**: Intermediate
- **4**: Advanced
- **5**: Expert/High ability

#### Supervision Level (1-3 Scale):
Automatically calculated from the 4 ability levels:
- **Nivel 1 (Red)**: Needs 100% supervision (average ability 1-2.35)
- **Nivel 2 (Yellow)**: Needs 50% supervision (average ability 2.36-3.67)
- **Nivel 3 (Green)**: Independent (average ability 3.68-5)

**Calculation**:
```javascript
const avgAbility = (reading_level + comprehension_level + attention_span + motor_skills) / 4;
const percentage = (avgAbility - 1) / 4;

if (percentage >= 0.67) supervision_level = 3; // Independent
else if (percentage >= 0.34) supervision_level = 2; // 50% supervision
else supervision_level = 1; // 100% supervision
```

#### Additional Abilities (JSONB):
Stores flexible data like:
```json
{
  "evaluation_responses": [...],
  "evaluation_date": "2025-01-15T10:30:00Z",
  "special_needs": "...",
  "custom_field": "..."
}
```

**Relationships**:
- `teacher_id` → `users.id` (SET NULL on delete)
- `user_id` → `users.id` (CASCADE DELETE)

**Constraints**:
- `reading_level` CHECK: 1-5
- `comprehension_level` CHECK: 1-5
- `attention_span` CHECK: 1-5
- `motor_skills` CHECK: 1-5
- `supervision_level` CHECK: 1-3

---

### 4. `activities`

**Purpose**: Defines educational activities (e.g., "Actividad 1", "Actividad 2")

**Columns**:

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Unique activity identifier |
| `name` | VARCHAR(255) | Activity name (e.g., "Actividad 1: Conocer mi cuerpo") |
| `slug` | VARCHAR(100) UNIQUE | URL-friendly slug (e.g., "actividad-1") |
| `description` | TEXT | Activity description |
| `required_reading_level` | INTEGER | Minimum reading level (1-5) |
| `required_comprehension_level` | INTEGER | Minimum comprehension level (1-5) |
| `required_attention_span` | INTEGER | Minimum attention span (1-5) |
| `required_motor_skills` | INTEGER | Minimum motor skills (1-5) |
| `order_number` | INTEGER | Display order |
| `is_active` | BOOLEAN | Whether activity is active |
| `created_at` | TIMESTAMP | Creation timestamp |

**Important Notes**:
- Activities are **containers** for scenes
- `slug` is used in routing (e.g., `/actividad-1`)
- `required_*` fields define prerequisites (not enforced, just informational)
- `order_number` determines sequence in the app

**Constraints**:
- `slug` UNIQUE: No duplicate slugs

---

### 5. `scenes`

**Purpose**: Defines individual scenes within activities

**Columns**:

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Unique scene identifier |
| `activity_id` | INTEGER | Foreign key to activities |
| `name` | VARCHAR(255) | Scene name (e.g., "Escena 1") |
| `slug` | VARCHAR(100) | Scene slug (e.g., "scene1") |
| `description` | TEXT | Scene description |
| `order_number` | INTEGER | Display order within activity |
| `is_active` | BOOLEAN | Whether scene is active |
| `created_at` | TIMESTAMP | Creation timestamp |

**Important Notes**:
- Scenes are **sub-units** of activities
- Full route: `/actividad-1/scene1`
- `slug` is unique within an activity (not globally)

**Relationships**:
- `activity_id` → `activities.id` (CASCADE DELETE)

**Constraints**:
- UNIQUE(`activity_id`, `slug`): Slug unique per activity

---

### 6. `student_progress`

**Purpose**: Tracks student progress through activities and scenes

**Columns**:

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Unique progress entry identifier |
| `student_id` | INTEGER | Foreign key to students |
| `activity_id` | INTEGER | Foreign key to activities |
| `scene_id` | INTEGER | Foreign key to scenes |
| `status` | VARCHAR(20) | Progress status |
| `attempts` | INTEGER | Number of attempts |
| `completion_percentage` | INTEGER | Completion % (0-100) |
| `game_data` | JSONB | Game-specific data (scores, choices, etc.) |
| `started_at` | TIMESTAMP | When student started this scene |
| `completed_at` | TIMESTAMP | When student completed this scene |
| `last_accessed_at` | TIMESTAMP | Last time student accessed this scene |

**Important Notes**:

#### Status Values:
- **`not_started`**: Student hasn't begun this scene
- **`in_progress`**: Student started but didn't complete
- **`completed`**: Student finished the scene
- **`skipped`**: Scene was skipped

#### Game Data (JSONB):
Flexible storage for game-specific information:
```json
{
  "score": 85,
  "correct_answers": 8,
  "total_questions": 10,
  "choices": ["option_a", "option_b"],
  "time_spent_seconds": 120
}
```

**Relationships**:
- `student_id` → `students.id` (CASCADE DELETE)
- `activity_id` → `activities.id` (CASCADE DELETE)
- `scene_id` → `scenes.id` (CASCADE DELETE)

**Constraints**:
- `status` CHECK: Must be 'not_started', 'in_progress', 'completed', or 'skipped'
- `completion_percentage` CHECK: 0-100
- UNIQUE(`student_id`, `activity_id`, `scene_id`): One progress entry per student per scene

---

### 7. `student_sessions`

**Purpose**: Tracks student login sessions and time spent

**Columns**:

| Column | Type | Description |
|--------|------|-------------|
| `id` | SERIAL PRIMARY KEY | Unique session identifier |
| `student_id` | INTEGER | Foreign key to students |
| `session_start` | TIMESTAMP | When session started |
| `session_end` | TIMESTAMP | When session ended |
| `total_time_minutes` | INTEGER | Total session duration in minutes |
| `activities_accessed` | INTEGER | Number of activities accessed |
| `created_at` | TIMESTAMP | Creation timestamp |

**Important Notes**:
- Used for **analytics** and **reporting**
- Tracks how much time students spend in the app
- Can be used to identify engagement patterns

**Relationships**:
- `student_id` → `students.id` (CASCADE DELETE)

---

## Relationships

### User Hierarchy

```
Owner (id=1)
  ├── creates Admin (id=2)
  ├── creates Admin (id=3)
  └── creates Teacher (id=4)

Admin (id=2)
  ├── is assigned to → Teacher (id=4) [teacher_admin_assignments]
  └── is assigned to → Teacher (id=5)

Teacher (id=4)
  ├── creates Student (id=10) [students.teacher_id]
  ├── creates Student (id=11)
  └── creates Student (id=12)

Student (id=10)
  ├── has login → User (id=20) [students.user_id]
  └── has progress → student_progress entries
```

### Key Relationship Rules

1. **Owner** can:
   - Create/manage all users (Admins, Teachers, Students)
   - View all data in the system

2. **Admin** can:
   - Manage only assigned teachers (via `teacher_admin_assignments`)
   - View/manage students of assigned teachers only

3. **Teacher** can:
   - Create/manage only their own students
   - View progress of their students only

4. **Student** can:
   - View their own profile and progress only
   - Access educational activities

### Cascade Behavior

**ON DELETE CASCADE**:
- Deleting a user → deletes their `teacher_admin_assignments`
- Deleting a student → deletes their `student_progress` and `student_sessions`
- Deleting an activity → deletes its `scenes` and related `student_progress`

**ON DELETE SET NULL**:
- Deleting a teacher → sets `students.teacher_id` to NULL (preserves student data)
- Deleting the creator → sets `users.created_by` to NULL

---

## Key Concepts

### 1. Soft Delete Pattern

Users are never truly deleted from the database. Instead:
- `deleted_at` is set to the current timestamp
- `is_active` is set to `false`
- Queries filter out soft-deleted records with `WHERE deleted_at IS NULL`

**Benefits**:
- Data preservation for auditing
- Can restore accidentally deleted users
- Historical data remains intact

### 2. Role-Based Access Control (RBAC)

Access is controlled by the `users.role` field:

| Role | Can Access | Cannot Access |
|------|-----------|---------------|
| **owner** | Everything | N/A |
| **admin** | Assigned teachers + their students | Other admins' teachers |
| **teacher** | Their own students | Other teachers' students |
| **student** | Own profile and progress | Other students' data |

### 3. Supervision Level System

The supervision level is **automatically calculated** when:
- A student is created
- A student's abilities are updated

**Formula**:
```
average_ability = (reading + comprehension + attention + motor) / 4
percentage = (average_ability - 1) / 4

if percentage >= 0.67: Level 3 (Independent)
elif percentage >= 0.34: Level 2 (50% supervision)
else: Level 1 (100% supervision)
```

**Used for**:
- Determining how much help a student needs
- Filtering/sorting students by independence level
- Reporting and analytics

### 4. Progress Tracking

Progress is tracked at the **scene level**:
- Each scene within an activity gets its own progress entry
- `student_progress` table stores status, attempts, completion percentage
- `game_data` JSONB field stores game-specific information

### 5. JSONB Flexibility

Two tables use JSONB for flexible data storage:

**`students.additional_abilities`**:
```json
{
  "evaluation_responses": [
    {"question": "reading", "answer": "siempre"},
    {"question": "comprehension", "answer": "a_veces"}
  ],
  "evaluation_date": "2025-01-15",
  "special_notes": "Needs extra help with reading"
}
```

**`student_progress.game_data`**:
```json
{
  "score": 90,
  "correct_answers": 9,
  "wrong_answers": 1,
  "time_seconds": 180,
  "drag_drop_attempts": 3
}
```

---

## Indexes and Performance

### Indexes Created

**users table**:
- `idx_users_role` on `role` - Fast filtering by role
- `idx_users_created_by` on `created_by` - Fast lookup of who created a user
- `idx_users_username` on `username` - Fast login lookup
- `idx_users_deleted_at` on `deleted_at` - Efficient soft delete filtering

**teacher_admin_assignments**:
- `idx_teacher_admin_teacher_id` on `teacher_id` - Fast admin→teacher lookup
- `idx_teacher_admin_admin_id` on `admin_id` - Fast teacher→admin lookup

**students**:
- `idx_students_teacher_id` on `teacher_id` - Fast teacher→students lookup
- `idx_students_user_id` on `user_id` - Fast student login association

**student_progress**:
- `idx_student_progress_student_id` on `student_id` - Fast student→progress lookup
- `idx_student_progress_activity_scene` on `(activity_id, scene_id)` - Fast scene progress queries
- `idx_student_progress_status` on `status` - Fast filtering by status

**activities & scenes**:
- `idx_activities_slug` on `slug` - Fast routing lookups
- `idx_scenes_activity_slug` on `(activity_id, slug)` - Fast scene routing

### Performance Tips

1. **Always filter by `deleted_at IS NULL`** for soft-deleted records
2. **Use indexed columns** in WHERE clauses
3. **Limit large result sets** with LIMIT/OFFSET for pagination
4. **Use JSONB indexes** if querying inside `additional_abilities` or `game_data` frequently

---

## Common Queries

### 1. Get all active students for a teacher

```sql
SELECT s.*, u.email, u.username
FROM students s
LEFT JOIN users u ON s.user_id = u.id
WHERE s.teacher_id = $1
  AND s.is_active = true
ORDER BY s.created_at DESC;
```

### 2. Get all students for an admin (via assigned teachers)

```sql
SELECT s.*, u.email, u.username, teacher.name as teacher_name
FROM students s
LEFT JOIN users u ON s.user_id = u.id
LEFT JOIN users teacher ON s.teacher_id = teacher.id
JOIN teacher_admin_assignments taa ON s.teacher_id = taa.teacher_id
WHERE taa.admin_id = $1
  AND s.is_active = true
ORDER BY s.created_at DESC;
```

### 3. Get student progress for a specific activity

```sql
SELECT
  sp.*,
  sc.name as scene_name,
  sc.slug as scene_slug
FROM student_progress sp
JOIN scenes sc ON sp.scene_id = sc.id
WHERE sp.student_id = $1
  AND sp.activity_id = $2
ORDER BY sc.order_number;
```

### 4. Calculate overall progress for a student

```sql
SELECT
  COUNT(*) as total_scenes,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_scenes,
  COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_scenes,
  ROUND(
    (COUNT(CASE WHEN status = 'completed' THEN 1 END)::FLOAT / COUNT(*)) * 100,
    2
  ) as completion_percentage
FROM student_progress
WHERE student_id = $1;
```

### 5. Get students by supervision level

```sql
SELECT
  id, name, supervision_level,
  reading_level, comprehension_level,
  attention_span, motor_skills
FROM students
WHERE teacher_id = $1
  AND supervision_level = $2
  AND is_active = true
ORDER BY name;
```

### 6. Check if user can manage a student

```sql
-- For owner: can manage all
SELECT 1 FROM users WHERE id = $1 AND role = 'owner';

-- For admin: check if student belongs to assigned teacher
SELECT 1
FROM students s
JOIN teacher_admin_assignments taa ON s.teacher_id = taa.teacher_id
WHERE s.id = $2 AND taa.admin_id = $1;

-- For teacher: check if student belongs to them
SELECT 1
FROM students
WHERE id = $2 AND teacher_id = $1;
```

---

## Migration History

### Initial Schema (schema.sql)
- Created core tables: users, students, activities, scenes, student_progress
- Established role hierarchy
- Set up soft delete pattern

### Add Supervision Level
**File**: `add-supervision-level.js`
- Added `supervision_level` column to students table
- INTEGER type with CHECK constraint (1-3)
- Default value: 1

**Migration**:
```sql
ALTER TABLE students
ADD COLUMN supervision_level INTEGER DEFAULT 1
CHECK (supervision_level >= 1 AND supervision_level <= 3);
```

### Populate Activities
**File**: `populate-activities.sql`
- Inserted activities (Actividad 1-6)
- Inserted scenes for each activity

### Add Missing Scenes
**File**: `add-scenes.sql`, `add-remaining-scenes.sql`
- Added additional scenes to existing activities
- Filled gaps in scene sequences

---

## Database Maintenance

### Regular Tasks

1. **Monitor deleted users**:
```sql
SELECT role, COUNT(*)
FROM users
WHERE deleted_at IS NOT NULL
GROUP BY role;
```

2. **Check orphaned students** (students without teachers):
```sql
SELECT id, name
FROM students
WHERE teacher_id IS NULL
  AND is_active = true;
```

3. **Identify inactive students**:
```sql
SELECT s.id, s.name, MAX(sp.last_accessed_at) as last_active
FROM students s
LEFT JOIN student_progress sp ON s.student_id = sp.student_id
WHERE s.is_active = true
GROUP BY s.id, s.name
HAVING MAX(sp.last_accessed_at) < NOW() - INTERVAL '30 days'
   OR MAX(sp.last_accessed_at) IS NULL;
```

### Backup Recommendations

1. **Daily backups** of the entire database
2. **Before migrations**, create a backup
3. **Test restore** procedures regularly

---

## Connection Configuration

### Environment Variables

```env
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
```

### Connection Pooling

**File**: `src/lib/db.ts`

```typescript
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20, // Maximum connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const query = (text: string, params?: any[]) => {
  return pool.query(text, params);
};
```

---

## Security Considerations

### 1. Password Security
- Passwords stored as **bcrypt hashes** (12 salt rounds)
- Never store plaintext passwords
- Password changes tracked via `last_password_change`

### 2. Parameterized Queries
- Always use `$1, $2, $3` placeholders
- Never concatenate user input into SQL strings
- Prevents SQL injection attacks

### 3. Role-Based Access
- All API routes check user role before allowing operations
- Students cannot access other students' data
- Teachers cannot access other teachers' students
- Admins can only access assigned teachers

### 4. Soft Deletes
- Preserves data for auditing
- `deleted_at` filter prevents access to deleted records
- Can be restored if needed

---

## Future Considerations

### Potential Improvements

1. **Add full-text search** for student/teacher names
2. **Partition student_progress** table by date for better performance
3. **Add caching layer** (Redis) for frequently accessed data
4. **Implement database replication** for read scaling
5. **Add audit logs** table for tracking all changes
6. **Create materialized views** for complex reporting queries

---

**Last Updated**: 2025-01-15
**Database Version**: PostgreSQL 14+
**Schema Version**: 1.2





## Database

The application uses Neon PostgreSQL database. Environment variables are configured in `apps/web/.env`.

Test credentials:
- Email: `test@example.com`
- Password: `testpass123`

## Deployment

The web app is configured for Vercel deployment. Point Vercel to the `apps/web` directory for builds.


