# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

This is a Turborepo monorepo with the following structure:
- `apps/web/` - Next.js frontend application
- `packages/` - Shared packages (for future use)
- Root-level package.json manages workspaces

## Development Commands

Run from the root directory:

- `npm run dev` - Start development server for all apps
- `npm run build` - Build all applications
- `npm run lint` - Run linting across all packages
- `npm run setup-db` - Set up the database

## Frontend Application (apps/web/)

Educational Next.js application focused on sexual education for children. The app is structured as an interactive learning platform with multiple activities and scenes.

### Key Technologies
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + DaisyUI for component library
- **Animations**: Framer Motion for smooth transitions and animations
- **Drag & Drop**: @dnd-kit for interactive games and activities
- **Authentication**: NextAuth v5 with Neon PostgreSQL database
- **Database**: PostgreSQL (Neon) with pg client and bcrypt password hashing
- **Icons**: Lucide React
- **SVG Handling**: @svgr/webpack for importing SVGs as components

### Application Structure

The app is organized around educational activities (`actividad-1`, `actividad-2`, `actividad-3`), each containing multiple scenes with interactive games:

**Activity Structure**:
- Each activity has multiple scenes (`scene1`, `scene2`, etc.)
- Each scene typically contains one or more games (`JuegoUno`, `JuegoDos`, etc.)
- Games are self-contained components with their own config, hooks, and UI components

**Game Components Pattern**:
- Main game component (e.g., `JuegoUno.tsx`)
- Configuration file (`config.ts`) with game data and settings
- Custom hooks (`hooks.ts`) for game logic and state management
- UI components: overlays (feedback, congratulations), interactive elements
- Drag & drop games use DraggablePart and DropZone components

**Shared Components**:
- `components/` contains reusable UI elements
- Animation components for characters (Alex, Cris, Dani, Noa) with various states (talk, walk, static)
- Environmental animations (birds, clouds, sky, etc.)
- Layout components for landscape orientation (app is designed for tablets/landscape mode)

### Authentication System

Uses NextAuth with Neon PostgreSQL database:
- Database connection in `src/lib/db.ts` with connection pooling
- Real bcrypt password hashing (12 salt rounds)
- Test credentials: `test@example.com` / `testpass123`
- Redirects to `/home` after successful login
- Dashboard area protected with middleware
- Database setup scripts in `scripts/` directory

### Database

PostgreSQL database hosted on Neon with:
- Users table with proper schema and indexes
- Environment variables in `apps/web/.env`
- Setup script: `npm run setup-db`
- Connection utility with pooling in `src/lib/db.ts`

### Mobile/Tablet Considerations

The app enforces landscape orientation through meta tags and is optimized for tablet use. Audio handling utilities exist for interactive sound effects.

### File Organization

- Games follow a consistent pattern: each game type has its own folder with all related components
- SVG assets are organized by activity and character type
- Shared utilities in `app/utils/`
- Type definitions and configuration files are co-located with components
- Dashboard area has separate layout and middleware

### Development Notes

- The app uses Turbopack for faster development builds
- SVGs are configured to be imported as React components via webpack
- DaisyUI themes are enabled - uses light theme by default
- Audio preloading component suggests multimedia content is important
- Framer Motion is used extensively for character and environmental animations
- Database connection uses connection pooling for performance

### Deployment

- Configured for Vercel deployment
- Point Vercel build to `apps/web` directory
- Environment variables need to be set in Vercel dashboard
- Build command handles Turborepo structure automatically