# menraromial.com

Personal website of Menra W. Romial — PhD student working on energy-aware cloud computing, Kubernetes, and sustainable distributed systems.

Built with [Hugo](https://gohugo.io/) and the [Terminal](https://github.com/panr/hugo-theme-terminal) theme.

## Local development

```bash
hugo server
```

Site is served at http://localhost:1313/.

## Deployment

Pushes to `main` trigger the GitHub Actions workflow (`.github/workflows/hugo.yml`), which builds the site and publishes `public/` to the `gh-pages` branch, served by GitHub Pages at https://menraromial.com.
