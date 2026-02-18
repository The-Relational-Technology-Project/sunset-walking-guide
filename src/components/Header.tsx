export type ExploreView = 'cards' | 'map' | 'scan';

interface HeaderProps {
  mainTab: 'explore' | 'tour' | 'about';
  exploreView: ExploreView;
  onExploreViewChange: (view: ExploreView) => void;
  activeTourLabel?: string;
  onBackToExplore?: () => void;
}

const EXPLORE_VIEWS: { id: ExploreView; label: string }[] = [
  { id: 'cards', label: 'Nearby' },
  { id: 'map', label: 'Map' },
  { id: 'scan', label: 'All' },
];

export function Header({
  mainTab,
  exploreView,
  onExploreViewChange,
  activeTourLabel,
  onBackToExplore,
}: HeaderProps) {
  return (
    <header className="px-6 pt-10 pb-3 space-y-4">
      <h1 className="serif text-2xl font-medium leading-tight text-foreground tracking-tight">
        Outer Sunset Field Guide
      </h1>

      {mainTab === 'explore' && (
        <div className="space-y-2">
          <div className="flex items-center gap-1">
            {EXPLORE_VIEWS.map(({ id, label }, i) => (
              <span key={id} className="flex items-center gap-1">
                {i > 0 && (
                  <span className="text-muted-foreground/40 text-sm">·</span>
                )}
                <button
                  onClick={() => onExploreViewChange(id)}
                  className={`text-sm transition-colors duration-200 ${
                    exploreView === id
                      ? 'text-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground/70'
                  }`}
                >
                  {label}
                </button>
              </span>
            ))}
          </div>

          {activeTourLabel && (
            <div className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground italic">
                Tour: {activeTourLabel}
              </span>
              {onBackToExplore && (
                <button
                  onClick={onBackToExplore}
                  className="text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
                >
                  Back to explore
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
