# Rooted — frontend

Single-page application for the Rooted retail discovery demo.

## Commands

```bash
npm install
npm run dev          # recommended: local-disk copy + Vite (see scripts/dev-local-disk.mjs)
npm run dev:vite     # vite only, from this folder
npm run build
npm run lint
npm run preview
```

## Project structure (high level)

```
src/
  App.jsx, main.jsx, App.css, index.css, i18n.js, data.js, utils.js
  components/     Layout, ProductCard, ExpandableSearchField, TastesLikeHomeStamp, RootedLogo
  context/        ReviewsContext, SearchTopPickContext
  pages/          LandingPage, SearchPage, ProductPage
  assets/         e.g. top-pick-badge.png
scripts/
  dev-local-disk.mjs
```

## Developing from a cloud-synced folder

If `npm run dev:vite` fails with file read timeouts, keep using **`npm run dev`**, which syncs `src`, `public`, and config into a temp directory before starting Vite. Edit files in the repo; the script watches and copies changes (see comments in `dev-local-disk.mjs`).

## Environment hints

- `ROOTED_ALLOW_CLOUD_VITE=1` — used with `dev:vite` when explicitly running on a slow/cloud path.
- `ROOTED_VITE_DIR` — override the temp copy destination for `npm run dev`.

See the repository **[README.md](../README.md)** for product behaviour and routes.
