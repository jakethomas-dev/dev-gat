## Dev Gateway — Dashboard Skeleton

This repo is a minimal, fast-loading dashboard built on Next.js App Router and Tailwind v4. It includes a collapsible sidebar, route-driven page title, and simple cards to get started quickly.

## Quick start

1) Install and run the dev server

```powershell
npm install
npm run dev
```

2) Visit http://localhost:3000

## Project layout

- `app/layout.tsx` — Root layout. Renders the global Providers, persistent Sidebar, a layout-level PageTitle, and the main content area.
- `app/components/Container.tsx` — Two-column shell that places the Sidebar next to the page content.
- `app/components/Sidebar.tsx` — Collapsible navigation with smooth transitions and active/hover states.
- `app/components/PageTitle.tsx` — Derives the title from the URL (e.g., `/applications` → "Applications").
- `app/components/Providers.tsx` — Wraps the app and syncs the "section" with the current pathname pre-paint.
- `app/components/SectionProvider.tsx` — Lightweight context for the current section (no localStorage; route is the source of truth).
- `app/applications/page.tsx`, `app/settings/page.tsx` — Example pages using the shared shell.

## Sidebar behavior

- Collapse/expand: Controlled via a button pinned to the sidebar's right border. State is saved to `localStorage` so your preference survives navigation and reloads.
- Layout: The sidebar is mounted in the root layout and doesn’t remount between routes (no flicker).
- Hover/active: Menu items fade between states; the selected route gets a subtle background (`bg-black/5`, deepens on hover).
- Compact mode: Icons center; labels animate width/opacity out. In expanded mode, icons align left and labels appear with spacing.

## Title behavior

- The title is rendered in the layout, above page content. It derives from the current URL segment using `usePathname()` for an instant, flicker-free update.

## Styling

- TailwindCSS v4 is used with a plain white/black look (borders, icons, shadow when expanded). Adjust classes inline in the components.

## Add a new section

1) Create a route under `app/<section>/page.tsx`.
2) Add a menu entry in `Sidebar.tsx` with `{ icon, label, key }` and set `href` to `/<key>` (use `"dashboard"` for Home → `/`).
3) The title will pick it up automatically from the URL.

## Common tweaks

- Shadow strength: Change `shadow-2xl`/`shadow-none` on the sidebar.
- Transition speed: Tune `duration-200`/`duration-300` classes.
- Icon size: Adjust `w-4 h-4` and the collapsed `scale-125`.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm start` — run production server

