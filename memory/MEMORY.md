# Project Memory: EduDivSex App

## Project Overview
Educational web app for sexual education (children ages 9-12). Next.js 15 monorepo (Turborepo), deployed on Vercel.
Root: `/Users/julianaleon/Desktop/EduDivSexAPP/app/edu-div-sex/`
Frontend: `apps/web/src/app/`

## Activity Completion Status
| Activity | Scenes | Status |
|----------|--------|--------|
| actividad-1 (El Cuerpo) | scene1-scene7 | ✅ Complete |
| actividad-2 (Intimidad) | scene1-scene5 | ✅ Complete |
| actividad-3 (Placer Sexual) | scene1, scene1-1, scene1-2, scene2 | ✅ Complete |
| actividad-4 (Higiene Sexual) | scene1-scene2 | ✅ Complete |
| actividad-5 (Entender y Respetar) | scene1, scene1-1, scene1-2, scene2 | ⚠️ Audio TODOs in scene1-2 |
| actividad-6 (Abuso) | scene1-scene3, scene4, scene4-1 | ✅ Complete |

## Supervision Level System (Updated)
- **2 levels only**: Level 1 (basic, default) and Level 2 = "Nivel Avanzado" (advanced)
- Level is set directly via radio selector (no longer auto-calculated from 12-question evaluation)
- Default on create = Level 1
- Badge colors: Level 1 = blue, Nivel Avanzado (≥2) = green
- Edit: available in `students/[id]/edit` and `owner/users/[id]/edit` (for students)
- API: `PUT /api/students/[id]` accepts direct `supervision_level`; `PUT /api/admin/users/[id]` updates students table if student role

## Key Known Issues
1. **Middleware disabled** - `/middleware.ts` route protection commented out (edge runtime issue)
2. **Audio placeholders** - actividad-5/scene1-2/JuedoTresActicidad5/config.ts has TODO audio
3. **Typos in folder names** - "JuedoTresActicidad5" (should be JuegoTresActividad5), "JuegoDosActvidad3"
4. **Debug components** - ErrorLogPanel, GlobalErrorLogViewer in components dir, console.logs throughout
5. **Auth system** - NextAuth v5, JWT sessions, bcryptjs (12 rounds), Neon PostgreSQL

## Architecture Patterns
- Each game: main component + config.ts + hooks.ts + UI components
- Drag-drop games: DraggablePart + DropZone components
- FeedbackOverlay + CongratsOverlay used in all games
- Progress saved via `useProgressSaver` hook → `/api/user/activity-progress`
- Role-based auth: student, teacher, admin, owner

## Critical Files
- `apps/web/src/auth.ts` - NextAuth config
- `apps/web/src/lib/db.ts` - Neon DB connection pooling
- `apps/web/src/middleware.ts` - Disabled route protection
- `apps/web/src/app/components/ActivityMenu/activityConfig.ts` - Activity definitions
- `apps/web/src/app/hooks/useProgressSaver.ts` - Progress persistence
