# Brand sources

Vector sources of the site's graphic assets. This folder is not published by Hugo.

- `logo.svg` : monogram (chevron + leaf), 96x96
- `logo-mr.svg` : monogram variant with "MR" initials, 200x96
- `favicon.svg` : favicon source, 32x32 (also served directly at /favicon.svg)
- `og-banner.svg` : Open Graph banner source, 1200x627

Colors used (Tomato preset): background `#fff7f1`, foreground `#45372B`, accent `#ff6347`.
If the site palette changes, update these values in the SVGs, then regenerate the PNGs in `static/`:

```bash
# with rsvg-convert (librsvg2-bin)
rsvg-convert -w 512 -h 512 brand/logo.svg > static/favicon.png
rsvg-convert -w 512 -h 512 brand/logo.svg > static/apple-touch-icon.png
rsvg-convert -w 32 -h 32 brand/favicon.svg > static/favicon-32.png
rsvg-convert -w 16 -h 16 brand/favicon.svg > static/favicon-16.png
rsvg-convert -w 1200 -h 627 brand/og-banner.svg > static/og-image.png
cp brand/favicon.svg static/favicon.svg
```

For `static/favicon.ico`, combine the 16 and 32 px PNGs (e.g. `convert static/favicon-16.png static/favicon-32.png static/favicon.ico` with ImageMagick).
