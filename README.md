# Portfolio

Live site: https://austinmaina.vercel.app

This repository contains a personal portfolio site built with Next.js and TypeScript. It highlights professional work, technical skills, and ways to get in touch.

## Quick overview

- Framework: Next.js 14 + React
- Language: TypeScript
- Styling: Tailwind CSS
- Animations: Framer Motion
- Deployment: Vercel

## What you'll find here

- A responsive portfolio and projects showcase
- Contact form with server-side handling
- Structured data and SEO-friendly metadata
- Centralized configuration for personal info and links (`src/config/index.ts`)

## Run locally

Clone the repo and start the dev server (pnpm is recommended):

```powershell
git clone https://github.com/Austinkuria/portfolio.git
cd portfolio
pnpm install
pnpm dev
```

Open http://localhost:3000 to view the site.

If you prefer npm or yarn, those will work too, but this project uses pnpm in CI.

## Structure

- `src/app/` — Next.js app routes and pages
- `src/components/` — Reusable UI components
- `src/data/` — Project and content data
- `src/config/` — Site configuration (update this to customize content)
- `public/` — Static assets (images, preview pages)

## Customize

- Edit personal details and social links in `src/config/index.ts`.
- Add or update projects in `src/data/projects.ts`.
- Change design tokens in `tailwind.config.js` and `src/app/globals.css`.

## Testing email templates locally

Preview HTML files are available under `public/email-previews/` for quick visual checks. For full client testing, send test emails to real accounts (Gmail, Outlook, Apple Mail).

## Notes on compatibility

The email templates include table-based fallbacks for better compatibility with Outlook desktop and media-query helpers for clients that support responsive CSS.

## Contact

- Website: https://austinmaina.vercel.app
- GitHub: https://github.com/Austinkuria
- LinkedIn: https://www.linkedin.com/in/austin-maina/

## License

© 2025 Austin Maina — MIT License (see LICENSE.md)
