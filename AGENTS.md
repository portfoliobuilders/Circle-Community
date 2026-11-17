<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# CIRCLE

Read `docs/PROJECT_BRIEF.md` before any task.

## Stack

Latest stable Next.js (App Router, TypeScript strict, Server Components by default), Tailwind CSS, shadcn/ui themed to brand tokens, Supabase (Postgres, Auth, Storage, RLS), zod for all input validation, React Hook Form, deployed on Vercel.

## Security

- Every table has RLS enabled with explicit policies.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.
- All writes go through server actions or route handlers that validate with zod and check the user's role server-side.
- Never trust role or ids sent from the client.

```ts
// ❌ BAD — role from the client
await supabase.from("collabs").insert({ ...input, brand_id: input.brandId });

// ✅ GOOD — role and id from the server session
const { user, profile } = await requireBrand();
const data = collabSchema.parse(input);
await supabase.from("collabs").insert({ ...data, brand_id: profile.id });
```

## Data

- Money stored as integer INR (no floats). Example: ₹1,500 is `1500`, never `1500.00`.
- Timestamps are `timestamptz`, displayed in `Asia/Kolkata`.

## UI

- Mobile-first (375px up), visible focus states, labels on every input, buttons ≥44px tall, verb-first button labels.
- No lorem ipsum, no fake stats or testimonials — use clearly marked placeholders.
- Lime (`#C6FF00`) and Ice Silver (`#C7CBD1`) only on dark backgrounds. On white, use Obsidian (`#080808`).

## Migrations

SQL files in `supabase/migrations`. Never edit an applied migration; add a new one.

## After each task

Run typecheck and lint. List what you created. List anything left as TODO.

## How to work in this repo
- Read docs/PROJECT_BRIEF.md before any task.
- Before writing code, produce an Implementation Plan and wait for my approval. If my prompt and an approved plan document disagree, stop and ask.
- Never run destructive commands (git reset --hard, git push --force, dropping tables, deleting migrations) and never apply migrations to a production database. Ask first.
- Never print, commit or log secrets. .env files stay out of git.
- New database changes go in a new file under supabase/migrations; never edit an applied migration.
- After each task: run typecheck and lint, then write a Walkthrough listing what you created, the proof for each acceptance check (test output or screenshot), and anything left as TODO.
- When a task has UI, open it in the browser at 375px and 1440px width and include screenshots in the Walkthrough.
- No invented numbers, testimonials or lorem ipsum. Use [PLACEHOLDER] for missing facts.
