
## Navigation & layout redesign

### What's changing

**1. Remove the welcome overlay entirely**
The `WelcomeOverlay` component and its `localStorage` flag (`osfg_visited`) are removed. Users land directly in Explore mode, already sorted by their location.

**2. Simplify the header — title only, no context line**
The `Header` component loses the environmental context line (`getEnvironmentalContext`) and the weather/time display. The title "Outer Sunset Field Guide" gets more vertical breathing room. The Explore · Tour mode toggle moves out of the header and into the bottom nav (see below), so the header becomes a clean title bar only.

**3. New bottom navigation — three tabs: Explore, Tour, About**

The current `BottomNav` has Map, All stops, About. The new structure:

```
[ Explore ]  [ Tour ]  [ About ]
```

- **Explore** — the primary tab. Has its own internal sub-navigation (see below).
- **Tour** — replaces the header toggle; opens the TourList screen exactly as it does today.
- **About** — unchanged.

**4. Explore tab — internal view switcher: Cards / Map / Scan**

When the Explore tab is active, a small secondary row appears just below the header (or inline in the header area) offering three view modes:

```
Cards  ·  Map  ·  Scan
```

- **Cards** (default) — the current swipe-through PlacePanel experience, now with more vertical room since the context line and mode toggle are gone from the header.
- **Map** — the current MapView.
- **Scan** — a compact list (currently called "All stops") showing all places sorted by distance with thumbnail, name, walking distance, and time indicator. Renamed "Scan" to match the navigation language; the AllStops component is reused.

**5. More room for place cards in Cards mode**

With the context line gone and the mode toggle moved to the bottom nav, the PlacePanel gains significant vertical space. The card itself will grow — thumbnail bumps up from `w-16 h-16` to `w-20 h-20`, place name uses a slightly larger type size, and the card gets more internal padding. The pagination dots and "Up next" line remain below.

**6. Tour mode — label stays, back link stays**

When a tour is active, a small label ("Tour: Past · Back to explore") appears below the Explore sub-nav, exactly as it does now in the header. Back-to-explore returns to Explore > Cards.

**7. State model changes**

- Remove `showWelcome` / `isFirstVisit` state and the `FIRST_VISIT_KEY` constant.
- Replace `bottomTab: BottomTab` with `mainTab: 'explore' | 'tour' | 'about'`.
- Add `exploreView: 'cards' | 'map' | 'scan'` state for the explore sub-navigation.
- The Explore · Tour mode toggle in the header is removed (mode is now `mainTab`).
- Tour selection sets `mainTab = 'explore'` and `exploreView = 'cards'` as before.

### Files to change

| File | Change |
|---|---|
| `src/pages/Index.tsx` | Remove welcome state, update tab/mode state, update renderContent logic |
| `src/components/Header.tsx` | Remove context line, remove mode toggle; render title + explore sub-nav when on explore tab |
| `src/components/BottomNav.tsx` | New tabs: Explore, Tour, About; updated types |
| `src/components/PlacePanel.tsx` | Larger thumbnail, more padding, bigger place name |
| `src/components/WelcomeOverlay.tsx` | Deleted (or simply no longer rendered) |
| `src/utils/context.ts` | Can remain but no longer imported anywhere |

### Technical detail

The `Header` component will receive `mainTab` and `exploreView` as props, and render the sub-nav row (`Cards · Map · Scan`) only when `mainTab === 'explore'`. This keeps the header small and purposeful.

The `BottomTab` type becomes `'explore' | 'tour' | 'about'`.

No data changes, no new dependencies.
