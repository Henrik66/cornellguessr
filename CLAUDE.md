# CornellGuessr — Claude context

## Scoring
Score formula: `round(5000 * Math.exp(-distanceMeters / SCORE_DECAY_METERS))`
SCORE_DECAY_METERS = 420 (defined in lib/scoring.ts — do not hardcode elsewhere)

## Campus bounding box
SW: 42.430, -76.508
NE: 42.462, -76.462
Used to restrict the Leaflet mini-map. Never remove these bounds.

## Google Maps
- StreetViewPanorama must always have navigation disabled (linksControl, panControl, clickToGo all false)
- API key is in NEXT_PUBLIC_GOOGLE_MAPS_KEY — do not use a different env var name

## Supabase
- Tables: locations, games, profiles
- RLS is enabled — always test queries as both anon and authenticated roles
- Service role key (SUPABASE_SERVICE_ROLE_KEY) is server-only — never import in client components

## Leaflet
- Version: 1.9.x
- Import as: `import L from 'leaflet'`
- CSS must be imported in the component: `import 'leaflet/dist/leaflet.css'`
- Default marker icons break in Next.js — use L.divIcon for all markers

## Conventions
- All lat/lng stored as float8 in Postgres, passed as {lat, lng} objects in TypeScript
- Game state lives in a useReducer in game/page.tsx — do not lift to global state
- OG image route is app/api/og/route.tsx using @vercel/og ImageResponse
