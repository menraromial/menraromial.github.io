# Brand sources

Vector sources of the site's graphic assets. This folder is not published by the site build.

- `logo.svg` : monogram (chevron + leaf), 96x96
- `logo-mr.svg` : monogram variant with "MR" initials, 200x96
- `favicon.svg` : favicon source, 32x32 (also served directly at /img/favicon.svg)
- `og-banner.svg` : Open Graph banner source, 1200x627

Colors used (Tomato preset): background `#fff7f1`, foreground `#45372B`, accent `#ff6347`.
If the site palette changes, update these values in the SVGs, then regenerate the PNGs in `web/static/`:

```bash
# with rsvg-convert (librsvg2-bin)
rsvg-convert -w 512 -h 512 brand/logo.svg > web/static/favicon.png
rsvg-convert -w 512 -h 512 brand/logo.svg > web/static/apple-touch-icon.png
rsvg-convert -w 32 -h 32 brand/favicon.svg > web/static/favicon-32.png
rsvg-convert -w 16 -h 16 brand/favicon.svg > web/static/favicon-16.png
rsvg-convert -w 1200 -h 627 brand/og-banner.svg > web/static/og-image.png
cp brand/favicon.svg web/static/img/favicon.svg
```

For `web/static/favicon.ico`, combine the 16 and 32 px PNGs (e.g. `convert web/static/favicon-16.png web/static/favicon-32.png web/static/favicon.ico` with ImageMagick).
