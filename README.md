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

