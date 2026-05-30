# CornellGuessr

A GeoGuessr-style game set entirely on Cornell's campus. You're dropped into a random Google Street View location somewhere on Cornell's grounds and have to pin where you think you are on a map. The closer your guess, the higher your score — up to a perfect 5000. In my first day of launch, I made a challenge to see who could get a perfect total score of 25000 first. 

Built with Next.js, Supabase, and the Google Maps Street View API.

## The story

I launched this on a whim during final exam week and 3,000 people played it within the first 24 hours. By that evening, students from other schools were tagging me in LinkedIn posts who had already cloned the concept and spun up their own versions. It briefly became a minitrend of campus GeoGuessr clones, which was not something I planned for. It just goes to show that if something will be played or viewed, it will get made.

## Stack

- **Next.js 16** (App Router)
- **Supabase** — locations, game state, player profiles
- **Google Maps Street View API** — panoramas with navigation disabled so you can't just walk to a sign
- **Leaflet** — the in-game guess map, bounded to Cornell's campus

## Scoring

Scores decay exponentially with distance from the correct location:

```
score = round(5000 * exp(-distance / 420))
```

A perfect guess (sub-1m) gives 5000. Miss by ~420 meters and you're around 1839.

## Running locally

```bash
npm install
npm run dev
```

You'll need a `.env.local` with:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_GOOGLE_MAPS_KEY=
```
