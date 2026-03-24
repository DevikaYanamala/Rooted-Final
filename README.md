# Rooted

Community-driven product discovery demo for the UK: search by language or ingredient, see retailer listings, sort by authenticity (community average), distance, or price, and rate products. Built for the **Rooted** brand (warm palette, serif headings, mobile-first boxed layout).

## Repository layout

| Path | Purpose |
|------|---------|
| `frontend/` | React 19 + Vite SPA (all runnable code) |
| `Docs/` | Product requirements and documentation index |

## Quick start

```bash
cd frontend
npm install
npm run dev
```

Open the **Local** URL printed in the terminal (Vite may pick a port other than 5173 if it is busy).

### Scripts (`frontend/package.json`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Default dev server: copies the project to a **local temp folder** then runs Vite (avoids `ETIMEDOUT` on OneDrive / cloud-synced paths). |
| `npm run dev:vite` | Run Vite **directly** in `frontend/` (set `ROOTED_ALLOW_CLOUD_VITE=1` if your tooling requires it). |
| `npm run build` | Production build to `frontend/dist/` |
| `npm run lint` | ESLint |
| `npm run preview` | Preview the production build |

## App routes

- **`/`** — Landing: search, optional demo scenario shortcuts (Arabic thyme, Indian masala, Brazilian coffee).
- **`/search`** — Results: query and `culture` in the URL; sort pills; expandable search in the sticky header; product cards.
- **`/product/:id`** — Product detail: hero, metadata, retailer CTA, authenticity slider + optional review, community reviews; expandable search in the header.

## Behaviour notes

- **Interface language:** English only (`i18next` for copy consistency).
- **Culture filter:** Driven by **script detection** and keywords in the query (e.g. Arabic script, Hindi script, Portuguese diacritics, English thyme/za’atar terms). The selected culture restricts which mock product pool is searched and sets `?culture=` on the URL when appropriate.
- **Top pick:** Under **Most Authentic** sort, the first result uses the community-inclusive average for ordering; a **100% AUTHENTIC** badge appears on that card and on its product page when it is still the active top pick from the last search.
- **State:** `ReviewsContext` (submitted reviews) and `SearchTopPickContext` (top result id) — in-memory only for the demo.

## Documentation

- **[Docs/README.md](Docs/README.md)** — Documentation index  
- **[Docs/PRD.md](Docs/PRD.md)** — Product requirements (course context + implementation alignment)

## Tech stack

React 19, Vite 5, React Router 7, Framer Motion, Lucide icons, `react-i18next`, plain CSS (`App.css` / `index.css`).

## License / course

See `Docs/PRD.md` for academic / presentation context.
