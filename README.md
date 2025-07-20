# edu-div-sex Monorepo

Educational platform for sexual education using Next.js, built as a Turborepo monorepo.

## Structure

```
├── apps/
│   └── web/          # Next.js frontend application
├── packages/         # Shared packages (future)
├── package.json      # Root package.json with workspaces
└── turbo.json        # Turborepo configuration
```
where
## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build all apps
npm run build

# Run linting
npm run lint

# Set up database
npm run setup-db
```

## Database

The application uses Neon PostgreSQL database. Environment variables are configured in `apps/web/.env`.

Test credentials:
- Email: `test@example.com`
- Password: `testpass123`

## Deployment

The web app is configured for Vercel deployment. Point Vercel to the `apps/web` directory for builds.