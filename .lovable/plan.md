
## Three additions to the Outer Sunset Field Guide

### 1. Addresses on place cards

**What changes:** A new `address` column is added to the database, and address text appears on the place card, the detail sheet, and the all-stops list.

- **Database:** Add a nullable `address` text column to the `places` table, then populate it for all 30 places with real or approximate addresses. Approximate ones use the format "Near 48th Ave & Irving St" rather than a precise street number.
- **Place type:** Add `address?: string` to the `Place` interface in `src/data/places.ts` and map it in the `usePlaces` hook.
- **PlacePanel card:** Show the address in small muted text below the place name (above the walking line).
- **PlaceDetail sheet:** Show the address below the name, near the walking distance line.
- **AllStops list:** Show the address as a second line under the place name.

### 2. "You're here" proximity highlight

**What changes:** When you're within roughly 0.1 miles (~0.16 km) of a place, the card gets a subtle visual treatment.

- **PlacePanel:** When `dist < 0.16` km, the card border shifts to a warm accent color and a small "You're here" label appears (styled like a quiet field-guide annotation -- small serif italic text). The card background gets a very faint warm tint.
- **AllStops list:** Rows within range get a small "You're here" badge next to the walking distance.
- **PlaceDetail:** The walking-distance line is replaced with "You're here" when within range.
- No new state or hooks needed -- it's a simple distance check that's already computed.

### 3. Tour request form on the About page

**What changes:** A "Request a tour" section is added at the bottom of the About page with a simple form that saves submissions to a new database table.

- **Database:** Create a `tour_requests` table with columns: `id` (uuid, primary key), `name` (text), `email` (text), `message` (text), `created_at` (timestamptz). RLS policy allows public inserts only (no select/update/delete for anon users) so submissions are write-only from the frontend.
- **About component:** Add a new bordered section at the bottom titled "Request a neighborhood tour." Three fields: Name, Email, Message (textarea with placeholder: "Group size, preferred dates, what you're curious about..."). A submit button styled in field-guide language (serif, understated). On success, the form is replaced with a brief thank-you message.
- **Validation:** Client-side validation via simple required checks and email format. Message capped at 1000 characters.

---

### Technical details

**Files created:**
- None (all changes fit into existing files)

**Files modified:**
- `src/data/places.ts` -- add `address` to the `Place` interface
- `src/hooks/usePlaces.ts` -- map `address` from DB row
- `src/components/PlacePanel.tsx` -- show address; add "You're here" highlight
- `src/components/PlaceDetail.tsx` -- show address; "You're here" label
- `src/components/AllStops.tsx` -- show address; "You're here" badge
- `src/components/About.tsx` -- add tour request form section

**Database migrations (2):**
1. `ALTER TABLE places ADD COLUMN address text;` followed by `UPDATE` statements for all 30 places.
2. `CREATE TABLE tour_requests (...)` with an insert-only RLS policy.

**No new dependencies needed** -- the form uses basic React state, and the Supabase client is already available.
