# ROAMLY

An original premium travel discovery demo built with React, Vite, TypeScript, Tailwind CSS, React Router, and lucide-react. An ivory and forest-green visual system, editorial typography, and locally served travel photography give every route a considered composition.

## Run

```sh
npm install
npm run dev
```

Open the URL Vite prints (normally http://localhost:5173).

```sh
npm run build
npm run preview
npm test
```

## Routes

- `/`: cinematic discovery page, destination suggestions, dates and guest search, trending rail, trip styles, featured stays, Lisbon weekend story, and newsletter.
- `/stays`: destination/name/neighborhood search, nightly budget, stay type, rating and amenity filters, sorting, responsive filter drawer, and an illustrated area view.
- `/stays/:id`: photo mosaic and gallery, host details, amenities, two room options, reviews, neighborhood notes, policies, date/guest controls, itemized booking total, and confirmation dialog.
- `/experiences`: curated activity filters and search, sorting, favorites, and an activity reservation dialog.
- `/saved`: persistent stays and experiences with collection tabs and useful empty states.

Favorites and light/dark theme are stored in localStorage. Dates and guests carry through search into stay details. Native dialogs provide keyboard focus containment and Escape dismissal. Reduced-motion preferences are respected. Local SVG fallbacks preserve image layouts if an asset is unavailable.

## Demo boundaries

All stays, hosts, reviews, prices, availability, service fees, and policies are fictional mock data in `src/data.ts`. Reservations and newsletter signup update local UI only. No payment, real booking, email delivery, map service, account, backend, secrets, or database is connected. The area view is a decorative illustration, not geographic data.

## Verification

`npm test` builds the app and runs 20 production-bundle DOM checks covering route rendering, suggestions, search, sorting, filters and empty states, favorites, theme persistence, trip handoff, room totals, stay confirmation, gallery navigation, experience booking, and unknown routes. DOM tests do not replace visual browser QA.

## Structure

`src/components.tsx` holds reusable UI; `src/pages/` holds route compositions; `src/state.tsx` handles persistent demo state; `src/styles.css` contains Tailwind integration, design tokens, components and breakpoints. Photography and fonts are served from `public/`.

## Asset credits

Photography is from Unsplash. Source photo IDs and URLs are recorded in `scripts/fetch-assets.mjs`; `image-check.json` records successful downloads. Fonts: DM Sans and Cormorant Garamond, obtained from Google Fonts, under the SIL Open Font License. Download scripts are optional maintenance utilities and are not used at runtime.

## Visual QA limitation

The development server and production build were verified, and the automated DOM checks pass. No connected browser was available in the implementation environment, so screenshot-based responsive review could not be completed.
