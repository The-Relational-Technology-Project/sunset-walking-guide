

## Add new places, update drawings, and credit the artist

### 1. Copy uploaded drawings to the project

Save all 7 uploaded images to `public/thumbnails/`:
- `black-bird-drawing.png` (Black Bird)
- `hook-fish-drawing.png` (Hook Fish)
- `sealevel-drawing.png` (Sealevel)
- `ocean-beach-drawing.png` (Ocean Beach)
- `devils-teeth.png` (Devil's Teeth)
- `palm-city.png` (Palm City)
- `sweet-passion.png` (Sweet Passion Bakery)

### 2. Update existing place thumbnails in the database

For **Black Bird**, **Hook Fish**, and **Sealevel**, update the `thumbnail` column to point to the new drawing and set `photo_credit` to `Local Artist, Steph Chen`.

| Place | New thumbnail | photo_credit |
|-------|--------------|--------------|
| black-bird | /thumbnails/black-bird-drawing.png | Local Artist, Steph Chen |
| hook-fish | /thumbnails/hook-fish-drawing.png | Local Artist, Steph Chen |
| sealevel-space | /thumbnails/sealevel-drawing.png | Local Artist, Steph Chen |

### 3. Handle Ocean Beach (secondary drawing)

Ocean Beach currently has a historical photo (`ocean-beach-rescue.jpg`, credited to outsidelands.org). The request is to add the new drawing **under** the existing photo, not replace it.

To support this, add a `drawing` field to the data model:
- **Database migration**: Add nullable columns `drawing text` and `drawing_credit text` to the `places` table.
- **Place type**: Add `drawing?: string` and `drawingCredit?: string` to the `Place` interface.
- **usePlaces hook**: Map `drawing` and `drawing_credit` from the DB row.
- **PlaceDetail component**: When `place.drawing` exists, render a second image below the main hero photo with its own credit line and lightbox support.
- **PlacePanel card**: Continue showing only the primary `thumbnail`.

Then set Ocean Beach's `drawing` to `/thumbnails/ocean-beach-drawing.png` and `drawing_credit` to `Local Artist, Steph Chen`.

### 4. Add 3 new places to the database

Insert new rows into the `places` table:

| id | name | address | lat | lng | time_layers | thumbnail | photo_credit | sort_order |
|----|------|---------|-----|-----|-------------|-----------|--------------|------------|
| devils-teeth | Devil's Teeth Baking Company | 3876 Noriega St | 37.7536 | -122.5058 | {present} | /thumbnails/devils-teeth.png | Local Artist, Steph Chen | 30 |
| palm-city | Palm City Wines | 4055 Irving St | 37.7620 | -122.5028 | {present} | /thumbnails/palm-city.png | Local Artist, Steph Chen | 31 |
| sweet-passion | Sweet Passion Bakery | 3020 Taraval St | 37.7438 | -122.4936 | {present} | /thumbnails/sweet-passion.png | Local Artist, Steph Chen | 32 |

Each will have a short description highlighting what makes the spot notable.

### 5. Artist credit link on PlaceDetail

When `photo_credit` (or `drawing_credit`) equals "Local Artist, Steph Chen", render the credit as a clickable link to `https://kismet-microcosm.myshopify.com/` (opening in a new tab). This way viewers can find more of Steph's art. The link styling will match the existing understated credit text (small, italic) with a subtle underline on hover.

---

### Technical details

**Database migration (schema change):**
- `ALTER TABLE places ADD COLUMN drawing text;`
- `ALTER TABLE places ADD COLUMN drawing_credit text;`

**Database data updates (via insert tool):**
- 3 `UPDATE` statements for existing places (Black Bird, Hook Fish, Sealevel thumbnails + credits)
- 1 `UPDATE` for Ocean Beach (drawing + drawing_credit)
- 3 `INSERT` statements for new places

**Files modified:**
- `src/data/places.ts` -- add `drawing?` and `drawingCredit?` to `Place` interface
- `src/hooks/usePlaces.ts` -- map `drawing` and `drawing_credit`
- `src/components/PlaceDetail.tsx` -- render secondary drawing image; make Steph Chen credits link to Kismet Microcosm

**Files created:**
- 7 image files in `public/thumbnails/`

**No new dependencies required.**
