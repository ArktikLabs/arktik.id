# Repository Guidelines

## Project Structure & Module Organization
- `app/`: Next.js App Router pages, layout, and global CSS.
- `components/`: Reusable UI, split into `ui/`, `sections/`, `cards/`. Use PascalCase filenames (e.g., `Button.tsx`).
- `lib/`: Small utilities (TypeScript).
- `public/`: Static assets (images, fonts, icons).
- `styles/`: Additional style resources.
- `.next/`, `out/`: Build artifacts (do not edit).

## Build, Test, and Development Commands
- `pnpm dev`: Start local dev server with HMR.
- `pnpm build`: Production build (runs Next.js compiler).
- `pnpm start`: Serve the production build.
- `pnpm lint`: Run ESLint via Next.js.
- `pnpm preview`: Serve the static export in `out/` (if present).

## Coding Style & Naming Conventions
- Language: TypeScript + React (Next.js 15). CSS via Tailwind.
- Indentation: 2 spaces; keep lines < 100 chars when practical.
- Components: PascalCase files and component names (e.g., `FeatureCard.tsx`).
- Hooks: camelCase prefixed with `use` (e.g., `useClientOnly.ts`).
- Routes: In `app/`, use folder-based routes with lowercase names. Mark client components with `'use client'` only when necessary.
- Linting: Fix issues reported by `pnpm lint` before committing.

## Testing Guidelines
- Automated tests are not configured yet. For UI changes, include manual test notes in the PR (pages touched, states checked, browsers/devices if relevant).
- If you introduce a test setup, prefer colocated `*.test.ts(x)` near source or a `__tests__/` folder and document how to run it.

## Commit & Pull Request Guidelines
- Commits: Follow Conventional Commits (e.g., `feat:`, `fix:`, `chore:`, `build:`). Keep messages imperative and scoped (e.g., `feat: add meta-theme`).
- PRs: Provide a clear summary, screenshots for UI changes, and link issues (e.g., `Closes #123`). Note any env/config changes and manual test steps. Keep PRs focused and small.

## Security & Configuration Tips
- Environment: Use `.env.local` for secrets; never commit secrets. Client-exposed vars must be prefixed with `NEXT_PUBLIC_`.
- Assets: Put public files in `public/` and reference with absolute paths (e.g., `/logo.svg`).

## Blog content

Blog content lives in `content/` as Markdown with YAML frontmatter, one file per
document per locale: `<slug>.id.md` is required, `<slug>.en.md` is optional.
An `.en.md` replaces the whole document for `/en/`, frontmatter included, so
copy `image`, `category`, `pillar`, `author` and dates into it.
Case studies split their body on the exact English headings `## Challenge`,
`## Solution`, `## Results`; other headings yield empty sections.
Authors in `content/authors/` are not localised.
Blog images go in `public/assets/blog/` and are referenced as `/assets/blog/<file>`;
the intl middleware only skips `/assets`, so an image anywhere else under
`public/` is rewritten to a locale route and served as HTML.
Pipeline hero photos are hotlinked Unsplash CDN URLs stored in frontmatter, not
files in the repo; `next.config.mjs` allowlists `images.unsplash.com` for them.

The planner is `content/planner.csv`. A GitHub Action (`publish-content.yml`)
writes due rows on a daily cron: brief, English article, Indonesian
transcreation, edit pass, Unsplash photo, one commit per article. Rows titled
"Case Study: ..." are written only when their `facts` column holds real client
details; otherwise they become `needs-input`. Rows in the `case-studies`
category are gated the same way whatever their title: a client story is never
invented. To re-run one row, dispatch the workflow with its title. A `failed`
row is retried by setting it back to `todo`. A `needs-input` row is retried by
filling `facts` and setting the status back to `todo`.

Founder notes: put your own material for a topic in the planner's `notes`
column or in `content/notes/<slug>.md` (get the path with
`pnpm publish:due --notes-path "<title>"`). The brief uses notes first.
Anything you would not publish does not go in a note; notes are committed
and quoted in workflow logs.
Research: set the planner's `research` column to `yes` for evidence-led
rows; citations are limited to URLs the research call returned, and the
article ends with a Sources list. A dry run of a `research=yes` row still
performs the live research call. Every article carries `quality` scores
(owner, ops, developer, voice, 1-10) in frontmatter from the judge loop.
