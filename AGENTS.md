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
