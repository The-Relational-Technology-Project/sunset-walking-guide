
## Replace "Up Next" hint with Back / Next navigation buttons

### What's changing

Only `src/components/PlacePanel.tsx` needs to be touched.

### Specific changes

1. **Remove** the "Up next: …" line and the `nextPlace` variable that feeds it.
2. **Remove** the `isFirstVisit` swipe-hint line (the prop itself can stay in the interface for backward compatibility — it just won't render anything).
3. **Add** a `Back` / `Next` button row below the pagination dots, using field-guide visual language:
   - Styled as small, understated text-buttons with left/right arrow glyphs (← →) — in the spirit of a printed field guide's navigation rather than digital icon buttons.
   - `Back` is hidden (not just disabled) when on the first card, and `Next` is hidden when on the last, keeping the layout clean rather than showing grayed-out controls.
   - Swipe still works as a secondary gesture — the `useSwipeable` handlers and animation logic remain untouched.
   - The buttons reuse the existing `goNext` / `goPrev` functions, so animation behavior is identical.

### Visual style for the buttons

```
          ← Back            Next →
```

- Font: serif (Lora), small, letter-spaced — matching the field-guide aesthetic already used for place names and the about page.
- Color: `text-foreground/50` at rest, `text-foreground/80` on hover — quiet but clearly tappable.
- No border, no background — pure text affordance, like a printed page's "turn to page →" cue.
- Tap target padded to at least 44px tall for comfortable mobile use.

### Technical details

- The `nextPlace` variable and its JSX block are removed.
- `isFirstVisit` prop interface is kept (no breaking change to the parent) but its conditional render block is removed.
- No new dependencies or state needed.
