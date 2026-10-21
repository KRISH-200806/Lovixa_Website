# CMS Marketing Site Template

Generic base scaffold installed by `../setup.sh`.

## After setup

```bash
cp .env.example .env

# Optional: Instant local DB
docker compose up -d

pnpm install
pnpm run doctor

# For PostgreSQL:
pnpm run payload:migrate:create && pnpm run payload:migrate

pnpm run generate:types
pnpm run seed
pnpm dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin

## Customize first

1. `src/lib/seo-constants.js` — site name, URL, description
2. `tailwind.config.js` — brand colors
3. `src/globals/` — content model
4. `src/collections/shared/BlockSections.ts` — section blocks

## Architecture included

- Payload 3 + PostgreSQL
- Section source map pattern (home page example)
- ID sanitizer hooks
- Cached CMS queries
- Next.js App Router `(frontend)` + `(payload)` groups
- Tailwind design token structure
