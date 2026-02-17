
## Outer Sunset Field Guide

A calm, mobile-first neighborhood walking companion centered on 48th Avenue & Irving Street in San Francisco's Outer Sunset.

---

### Design system & visual language

- **Palette:** Off-white background, dark charcoal text, muted warm gray accents. No bright colors. A single restrained accent — a faded terra cotta or slate blue — used sparingly.
- **Typography:** Serif for place names, clean sans-serif for body and UI. Generous line-height, ample white space.
- **Illustrations:** Small square thumbnails per place in a loose pen-and-ink + watercolor style (as in the reference images), generated as placeholder art. Desaturated, sketch-like, no people.
- **Motion:** All transitions slow and weighted — page turns, not flicks.

---

### Welcome screen (first visit only)

- localStorage flag detects first visit
- Quiet overlay: app name, two-sentence explanation, single "Start exploring" button
- Requests geolocation; defaults to 48th & Irving if denied

---

### Home — Explore mode

- **Header:** "Outer Sunset Field Guide" in large type; environmental context line below (e.g. "Foggy Tuesday evening · 6:14 pm")
- **Mode toggle:** `Explore · Tour` as plain text — Explore active, Tour dimmed
- **Place panel:** One place at a time, full width. Contains:
  - Small square sketch thumbnail (upper left)
  - Place name in medium-weight type
  - Walking line: "Walk → 3 min · 0.2 mi"
  - Three-circle time indicator (● ○ ○ / ○ ● ○ / ○ ○ ● and combinations)
- **Swipe navigation:** Left = next place, right = previous. Weighted, page-turn feel using touch events
- **Below panel:** Pagination dots · "Swipe to see the next place" hint (first visit) · "Up next: [name] · 0.4 mi" in small type
- **Sort order:** By distance from user's current location, updated periodically

---

### Tour mode

- Tapping "Tour" opens a simple list screen: four tour options as plain rows
  - **Past** — historical sites and neighborhood memory
  - **Present** — open businesses and active community spaces
  - **Future** — community dreams and planned projects
  - **Very Local** — the 5–6 nearest places, ~20 min walk
- Each row: tour name, one-line description, approximate walking time
- Selecting a tour returns to the same swipe interface with a small "Tour: Past" label and a "Back to explore" text link

---

### Place detail view

- Slides up calmly from the place panel
- Slightly larger thumbnail at top with generous margin
- Place name (large) · time indicator · walking line
- 2–4 sentence description in warm, neighbor-voice prose
- **Listen section** (if audio exists): simple play button + duration
- **Links section** (if links exist): 1–2 plain text outbound links
- Small map with single pin for this place
- "Get directions →" link (opens Apple/Google Maps)

---

### Bottom navigation (3 items)

- **Map** — all places as pins; sepia = past, solid = present, outlined/dotted = future; tap pin → detail view
- **All stops** — compact list: thumbnail · name · distance · time indicator
- **About** — brief explanation of the project, community credits, terms footer

---

### Seed data (10 places)

Real Outer Sunset locations with coordinates, mixed time layers:

| Place | Layer |
|---|---|
| Playland at the Beach site (48th & Balboa) | Past |
| Great Highway seawall history | Past |
| L-Taraval streetcar history | Past |
| 1900s sand dune development | Past |
| Black Bird Bookstore & Café (4541 Irving) | Present |
| Andytown Coffee (Irving location) | Present |
| Outerlands restaurant | Present |
| Sunset Branch Library | Present |
| Ocean Beach | Present + Past |
| Community gathering space dream (Irving & 47th) | Future |

Each entry includes: name, lat/lng, time layers, short description, placeholder illustration, and select entries have placeholder audio + links.

---

### Edge states

- Out of range: "You've wandered beyond the field guide's range. Head toward the ocean and we'll find you something."
- Location denied: center on 48th & Irving, small note to enable location
- No audio / no links: section simply doesn't appear

---

### Technical approach

- Mobile-first, 375–430px primary target
- Hardcoded JSON data (no backend needed for this build)
- Browser Geolocation API for distance, updated on a timer
- Touch/swipe gesture support via react-swipeable
- All UI copy: sentence case, warm, no exclamation points (except "Start exploring")
