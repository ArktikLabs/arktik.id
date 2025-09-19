# arktik.id Landing Site

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/arktik-labs/v0-landing-page-design)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/Aa1ed1VaO78)

Marketing/landing website for Arktik, built with Next.js (App Router), TypeScript, and Tailwind CSS. The site features sections for Hero, About Us, Services, Why Arktik, Works/Portfolio, and Contact (WhatsApp handoff). Deployed on Vercel. This repo is automatically synced from v0.app.

## Project Structure
- `app/`: App Router entrypoints (`layout.tsx`, `page.tsx`) and `globals.css`.
- `components/`: Reusable UI split into `ui/`, `sections/`, and `cards/`.
- `lib/`: Small utilities.
- `public/`: Static assets (images, icons, fonts).
- `styles/`: Additional style resources.
- `.next/`, `out/`: Build artifacts.

## Quick Start
Prerequisites: Node 18+ and pnpm installed.

```bash
pnpm install
pnpm dev         # start dev server at http://localhost:3000
pnpm build       # production build
pnpm start       # run the production build
pnpm lint        # run ESLint via Next.js
pnpm preview     # serve static export in out/ (if present)
```

## Development Notes
- Framework: Next.js 15 (React 18, TypeScript).
- Styling: Tailwind CSS with custom config in `tailwind.config.ts`.
- Components: Use PascalCase for components/files (e.g., `FeatureCard.tsx`).
- Client vs server: Mark client components explicitly with `'use client'` when needed.
- Env vars: Store secrets in `.env.local`. Browser-exposed variables must be prefixed with `NEXT_PUBLIC_`.

## Deployment
- Vercel builds and deploys on changes pushed to this repository.
- This project is synced with v0.app; updates made via v0 may push to this repo automatically.

## Contributing
See `AGENTS.md` for contributor guidelines (project structure, scripts, style, commits, and PR expectations).

## Contact
- Email: `hello@arktik.id`
- WhatsApp: `+62 851-1769-7889` (the site’s contact form opens a prefilled WhatsApp message)
