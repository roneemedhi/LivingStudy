# LivingStudy

A local-first active-recall study workspace that turns product notes into source-linked prompts and requires manual approval before they enter the verified library.

## Run & Operate

- `pnpm --filter @workspace/living-study run dev` — run the LivingStudy web app
- `pnpm --filter @workspace/living-study run typecheck` — typecheck the LivingStudy client
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/living-study/src/App.tsx` — client state, review queue, library, quiz, and settings
- `artifacts/living-study/src/index.css` — LivingStudy theme and responsive styles
- LivingStudy currently has no backend; notes and progress are stored in browser LocalStorage

## Architecture decisions

- Generated prompts remain pending until the user explicitly approves them; discarding removes them from local state.
- Each prompt retains its source note and exact source sentence. Approval is blocked if that sentence is no longer present or its answer no longer matches the source.
- The local passphrase is a simulated lock, not account security. Its salted verifier and all study data are in LocalStorage; study data is not encrypted.

## Product

LivingStudy lets users ingest product-management notes, review sentence-anchored recall prompts, maintain a searchable approved-only library, and practice in flashcard, written-answer, or multiple-choice modes. Quiz progress and appearance preferences persist in the current browser.

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

_Populate as you build — sharp edges, "always run X before Y" rules._

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
