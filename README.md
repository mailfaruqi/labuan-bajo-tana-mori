# When Growth Meets Inequality

Interactive web GIS documentary of a qualitative field survey on infrastructure justice along the
Labuan Bajo to Tana Mori road, West Manggarai, Flores.

See [docs/04-project-onepager.md](docs/04-project-onepager.md) for a summary of the work.

## Run it

```bash
npm install
cp .env.example .env      # then paste your Mapbox token
npm run dev               # http://localhost:5178
```

```bash
npm run build             # static site into dist/
npm run preview           # serve the built site
```

Works with bun as well: `bun install`, `bun run dev`.

## The token

`VITE_MAPBOX_TOKEN` in `.env`, which is git ignored.

Be clear about what this does and does not do. Vite inlines `VITE_*` variables into the client
bundle at build time, so the token **is** visible in the shipped JavaScript. That is normal for a
Mapbox `pk.*` publishable token, which is designed to be public. Keeping it in `.env` means it is
not committed to git and can be rotated without touching code. The real protection is a **URL
restriction on the token** in the Mapbox dashboard. Set that before publishing.

## Layout

```
index.html                 story page
about.html                 project, method, credits
src/
  main.js                  map, beats, panels, interactions
  style.css                story page styles
  about.css                about page styles
public/                    served as is at the site root
  data/                    geojson used at runtime
    road_bajo_golomori.geojson    surveyed centreline, 24.75 km, 1008 vertices
    sea_route_molo.geojson        pre road sea route and its jetties
    kampung_markers.geojson       village markers, generalised
  photos/                  imagery and placeholders
    pjn/                   raw images extracted from the agency briefing
data/                      provenance, not served
private/                   sensitive, git ignored, never published
docs/                      narrative architecture, beat script, one pager
```

## Data notes

`public/data` holds only what the site fetches at runtime. `data/` keeps provenance files that are
no longer used, including the original polyline export and the superseded OpenStreetMap
derivation. `private/` holds house precise interview coordinates and raw interview text and must
not be published.

Photographs supplied by the implementing agency are credited to it in the interface. See
`public/photos/README.md` before adding any new image.
