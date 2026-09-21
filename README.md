# menraromial.com

Personal academic website of Menra Romial (published as Romial Menra), PhD candidate at IMT Atlantique, Inria and LS2N, working on energy-aware cloud computing.

Built with [Docusaurus](https://docusaurus.io/).

## Layout

- `web/`: the Docusaurus site
  - `src/data/site.ts`: publications, news, talks, teaching, projects (single source of truth)
  - `src/pages/`: home and inner pages
  - `blog/`: blog posts (Markdown, Mermaid supported)
  - `static/`: PDFs, images, favicons, `CNAME`, `robots.txt`
- `brand/`: SVG sources of the logo, favicon and Open Graph banner
- `cv/`: LaTeX source of the CV

## Local development

```bash
cd web
npm install
npm start          # dev server with live reload
npm run build      # production build in web/build
```

## Deployment

Pushes to `main` trigger `.github/workflows/deploy.yml`, which builds `web/` and publishes `web/build` to the `gh-pages` branch, served by GitHub Pages at https://menraromial.com.
