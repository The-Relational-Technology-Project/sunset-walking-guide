
## Adding new historical places and photos

### What's being added

Six new historical places drawn from the uploaded photos and the metadata document. Each gets its own entry in `places.ts`, a photo copied to `public/thumbnails/`, and credit + links in the detail view.

One existing place (the N-Judah / Judah & 46th Ave) maps directly onto the existing `l-taraval` entry — that entry will receive the photo and updated coordinates. The sand dunes aerial maps onto the existing `sand-dunes` entry, which will receive the photo.

The podcast link for Ron Jones at 46th Ave & Judah will be added to the Judah & 46th entry.

---

### Photo-to-place mapping

| Uploaded photo | New or existing place | Location |
|---|---|---|
| `47th_and_Irving_St_Andrew_by_the_Sea_Church_1910.jpg` | New: Carville & St. Andrew by the Sea | 47th & Irving / La Playa (37.7638, -122.5090) |
| `Irving_and_46th_Ave_4510_Irving_Surf_Theatre_1970.jpg` | New: The Surf Theatre | 4510 Irving St (37.7638, -122.5038) |
| `Irving_and_46th_Ave_1917.jpg` | New: Irving Street, 1917 | Irving & 46th Ave (37.7638, -122.5038) |
| `48th_Ave_and_Lincoln_St_19805.jpg` | New: 48th & Lincoln, early settlement | 48th Ave & Lincoln (37.7712, -122.5094) |
| `Judah_St_and_46th_Ave_1948.jpg` | Update existing: L-Taraval / N-Judah | Judah & 46th Ave (37.7638, -122.5038) |
| `Judah_and_Great_Highway_1910.jpg` | New: Carville on the Great Highway | Judah & Great Highway (37.7638, -122.5109) |
| `Ocean_Beach_and_Lincoln_St_1910.jpg` | Update existing: Ocean Beach | Ocean Beach & Lincoln (37.7600, -122.5107) |
| `Ocean_Beach_and_Irving_St_1910.jpg` | Update existing: Sand Dunes aerial | Outer Sunset aerial view (37.7590, -122.4980) |

---

### New places to add to `places.ts`

**1. Carville & St. Andrew by the Sea** (`carville`)
- Location: 47th Ave & La Playa (37.7638, -122.5090)
- Time layer: `past`
- Description: In the 1890s, retired streetcar bodies were dragged out here and converted into homes — a whole neighborhood of repurposed transit cars lined the beach edge along La Playa. They called it Carville. The St. Andrew by the Sea Church stood nearby at 1338 47th Avenue, built in 1908. Most of the car-homes are long gone, but the idea of it — neighbors hauling transit cars to the sand and making a life — stays with you.
- Photo: `carville-st-andrew.jpg`
- Links: outsidelands.org Carville page, Great Highway Podcast Ep. 470

**2. The Surf Theatre** (`surf-theatre`)
- Location: 4510 Irving St (37.7638, -122.5038)
- Time layer: `past`
- Description: The Surf Theatre opened in 1926 as the Parkview, became the Sunset Theatre in 1937, and finally the Surf in 1957. It was a neighborhood cinema that showed foreign and art films — "a little beacon of culture out there in the Outer Sunset." Part of the Levin family's west-side theatre chain. It closed July 7, 1985. The building still stands.
- Photo: `surf-theatre.jpg`
- Links: Surf Theatre history page (outsidelands.org), WNP Podcast Ep. 8

**3. Irving Street under construction, 1917** (`irving-1917`)
- Location: Irving & 46th Ave (37.7638, -122.5038)
- Time layer: `past`
- Description: In 1917 this block of Irving was all dirt, pipe trenches, and possibility. The streetcar tracks were being laid, utilities were going in, and the neighborhood was deciding what it wanted to be. The houses on either side were already there, watching the work. This photo was taken looking east from the beach end of Irving.
- Photo: `irving-1917.jpg`

**4. 48th & Lincoln: early settlement** (`lincoln-early`)
- Location: 48th Ave & Lincoln (37.7712, -122.5090)
- Time layer: `past`
- Description: Around 1905, this corner of the far Outer Sunset was mostly dunes and a few scattered shacks. Early settlers built right at the edge of what the city called livable — some structures on stilts, some half-buried in sand. The windmill in the distance pumped water to Golden Gate Park. This was the frontier end of San Francisco.
- Photo: `lincoln-early.jpg`

**5. Carville on the Great Highway, 1910** (`carville-great-highway`)
- Location: Judah & Great Highway (37.7638, -122.5109)
- Time layer: `past`
- Description: This postcard from January 1910 shows Carville in its full strange glory — retired streetcar bodies lined up along the Great Highway, a windmill pumping water in the background, a horse-drawn carriage in the foreground. The handwritten inscription reads "Carville, Ocean Beach, San Francisco." It looks like the edge of the world because it was.
- Photo: `carville-great-highway.jpg`
- Links: Carville history (outsidelands.org), Great Highway Podcast Ep. 468

---

### Updates to existing places

**`l-taraval` → update to N-Judah at 46th Ave**
- New photo: `judah-46th-1948.jpg` (the color streetcar photo)
- Updated coordinates to Judah & 46th Ave: (37.7638, -122.5038)
- Add Ron Jones podcast link: `https://www.outsidelands.org/podcast/WNP175_Ron_Jones`
- Audio entry: label "Ron Jones: growing up on 46th Avenue", duration not specified (link only)

**`ocean-beach` → add the surf rescue boat photo**
- New photo: `ocean-beach-rescue.jpg`

**`sand-dunes` → add aerial photo**
- New photo: `sand-dunes-aerial.jpg`

---

### Credit line on all detail pages

The `Place` data model will gain an optional `photoCredit` field. The `PlaceDetail` component will render it beneath the thumbnail as a small caption: `Photo: outsidelands.org` — for all eight of the newly imported historical photos.

---

### Technical steps

**Files to copy (photos → `public/thumbnails/`)**
All 8 uploaded images copied to `public/thumbnails/` with clean short names.

**`src/data/places.ts`**
- Add `photoCredit?: string` to the `Place` interface
- Add 5 new place entries (Carville/St. Andrew, Surf Theatre, Irving 1917, Lincoln early, Carville Great Highway)
- Update `l-taraval`, `ocean-beach`, and `sand-dunes` entries with new thumbnails, coordinates, links, and audio

**`src/components/PlaceDetail.tsx`**
- Add a `photoCredit` caption line directly below the thumbnail image — small, muted, italicized. Rendered only when `place.photoCredit` exists.

No changes to navigation, state model, or any other component.
