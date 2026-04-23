# Aventura 5 – Nivel Avanzado: Diversidad Sexual
## Task Checklist (complete before building)

---

## Overview

- **Slug**: `aventura-5`
- **DB id**: 15
- **Topic**: Diversidad Sexual
- **Hub button label**: "Diversidad sexual"
- **Architecture**: Self-contained scene pages (NOT chain wrappers — aventura-5 has brand-new content, not a remix of existing actividad-X pages)
- **Scenes**: 2

| Scene | Title | Game (placeholder) | Video file |
|---|---|---|---|
| scene1 | Los diferentes tipos de pareja | ¿Cómo te sientes? | `/video/Actividad_5_scene_1.mp4` ✅ exists |
| scene2 | El respeto a los diferentes tipos de pareja | ¿Qué harías? | `/video/Actividad_5_scene_2.mp4` ✅ exists |

---

## 1. DATABASE

- [ ] **Create** `apps/web/scripts/add-aventura-5.sql`
  - Activity: id=15, name='Aventura 5: Diversidad Sexual', slug='aventura-5', order_number=15
  - 2 scenes: scene1, scene2
  - Follow same pattern as `add-aventura-4.sql`
- [ ] **Run** the SQL script against Neon DB

---

## 2. FRONTEND – New Files

### Hub page
- [ ] Create `apps/web/src/app/aventura-5/page.tsx`
  - Copy aventura-4 hub (`aventura-4/page.tsx`) as base
  - Change JugarButton text → `"Diversidad sexual"`
  - Change import → `AVENTURA_5_CONFIG`
  - Change localStorage key → `aventura-5-intro-seen`
  - Change bg music key → `aventura-5-bg`
  - No intro video yet (same as aventura-4 pattern — button goes straight to menu)

### Scene pages (self-contained, NOT chain wrappers)
- [ ] Create `apps/web/src/app/aventura-5/scene1/page.tsx`
  - Video: `/video/Actividad_5_scene_1.mp4`
  - Scene title display: "Los diferentes tipos de pareja"
  - After video ends → show placeholder game modal "¿Cómo te sientes?" (same "¡Próximamente!" modal used in other aventuras)
  - On game/modal dismiss → `saveProgress('aventura-5', 'scene1', 'completed', 100)` → navigate to `/aventura-5`

- [ ] Create `apps/web/src/app/aventura-5/scene2/page.tsx`
  - Video: `/video/Actividad_5_scene_2.mp4`
  - Scene title display: "El respeto a los diferentes tipos de pareja"
  - After video ends → show placeholder game modal "¿Qué harías?"
  - On game/modal dismiss → `saveProgress('aventura-5', 'scene2', 'completed', 100)` → navigate to `/aventura-5`

---

## 3. CONFIG FILES TO UPDATE

- [ ] **`apps/web/src/app/components/ActivityMenu/activityConfig.ts`**
  - Add `export const AVENTURA_5_CONFIG: ActivityConfig` with activityId=15, activitySlug='aventura-5'
  - 2 sections:
    - Section 1: title="LOS DIFERENTES TIPOS DE PAREJA", scenes=['/aventura-5/scene1']
    - Section 2: title="EL RESPETO A LOS DIFERENTES TIPOS DE PAREJA", scenes=['/aventura-5/scene2']
  - Add case 15 in `getActivityConfig()` switch

- [ ] **`apps/web/src/app/components/OrbitalCarousel/menuLevelConfig.ts`**
  - Add aventura-5 to `NIVEL_AVANZADO_ITEMS` array:
    ```ts
    { id: 5, label: 'Aventura 5', url: '/aventura-5', svgPath: '/svg/menu/orbital/activity6.svg' }
    ```
  - Note: no dedicated SVG exists yet for "Diversidad Sexual" — using activity6.svg temporarily. Provide a new SVG if one exists.

- [ ] **`apps/web/src/app/utils/activityMapping.ts`**
  - Import `AVENTURA_5_CONFIG`
  - Add `case 'aventura-5': return AVENTURA_5_CONFIG;` in `getActivityConfigBySlug()`
  - This makes reports-by-center and student detail pages display correct titles automatically

---

## 4. API – activity-progress route

- [ ] **`apps/web/src/app/api/user/activity-progress/route.ts`**
  - Add inside the switch:
    ```ts
    case 15:
      // Aventura 5 completed when scene2 (final) is done
      isActivityCompleted = activity.scenes['scene2']?.status === 'completed' &&
                           activity.scenes['scene2']?.progress >= 100;
      break;
    ```

---

## 5. AUDIO — `apps/web/public/audio/advance-aventura5/` ✅ all files exist

| File | Used for |
|---|---|
| `aventura5-title.mp3` | Hub JugarButton click sound |
| `scene1.mp3` | ActivityMenu section 1 soundClick |
| `scene2.mp3` | ActivityMenu section 2 soundClick |
| `juego1.mp3` | Game 1 audio — wire up when real game is built |
| `juego2.mp3` | Game 2 audio — wire up when real game is built |

All audio paths use prefix: `/audio/advance-aventura5/`

---

## 6. DASHBOARD – What's already handled automatically

The following pages need NO code change — they work dynamically:

| URL | Why no change needed |
|---|---|
| `/dashboard/students/[id]` | Filters `aventura-` slugs for advanced students — picks up aventura-5 automatically from DB |
| `/dashboard/owner/reports-by-center` | Uses `getActivityTitle()` from activityMapping — covered by task in section 3 |
| `/dashboard/owner/analytics` | Shows aggregate counts only, no per-activity breakdown |

---

## 7. MEMORY DOCS

- [ ] Update `memory/MEMORY.md`
  - Add row to DB Activity IDs table: `Aventura 5 (Avanzado) | aventura-5 | 15`
  - Add aventura-5 entry under "Pending / Placeholder Work"
  - Add aventura-5 to "ActivityMenu activeItemScale={2} Status" table (after build)

- [ ] Update `memory/aventura-1-chain-system.md`
  - Add aventura-5 section noting it uses self-contained scene pages (different from chain wrapper pattern)

---

## What you did NOT miss

- `useActivityProtection.tsx` — no change needed. Protection only applies to `/actividad-X` paths. Aventura-5 scenes don't use the localStorage chain flag system.
- Student detail page progress display — handled by the dynamic aventura filter already in place.

---

## Build order recommendation

1. SQL script → run against DB
2. `activityConfig.ts` + `activityMapping.ts` + `menuLevelConfig.ts`
3. `activity-progress/route.ts`
4. Hub page (`aventura-5/page.tsx`)
5. Scene pages (`scene1`, `scene2`)
6. Test full flow: home → aventura-5 hub → scene1 → back to hub → scene2 → back to hub
7. Verify dashboard student detail shows aventura-5 progress correctly
8. Update memory docs
