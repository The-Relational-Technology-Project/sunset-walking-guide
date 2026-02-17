import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { getEnvironmentalContext, getContextRefreshMs } from '@/utils/context';

interface HeaderProps {
  onToggleMode: (mode: 'explore' | 'tour') => void;
  activeMode: 'explore' | 'tour';
  tourLabel?: string;
  onBackToExplore?: () => void;
}

export function Header({ onToggleMode, activeMode, tourLabel, onBackToExplore }: HeaderProps) {
  const [context, setContext] = useState(() => getEnvironmentalContext());

  useEffect(() => {
    const interval = setInterval(() => {
      setContext(getEnvironmentalContext());
    }, getContextRefreshMs());
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="px-6 pt-8 pb-4 space-y-1">
      <h1 className="serif text-2xl font-medium leading-tight text-foreground tracking-tight">
        Outer Sunset Field Guide
      </h1>
      <p className="text-xs text-muted-foreground tracking-wide">{context}</p>

      <div className="pt-3 flex items-center gap-1">
        <button
          onClick={() => onToggleMode('explore')}
          className={`text-sm transition-colors duration-200 ${
            activeMode === 'explore'
              ? 'text-foreground font-medium'
              : 'text-muted-foreground hover:text-foreground/70'
          }`}
        >
          Explore
        </button>
        <span className="text-muted-foreground/40 text-sm px-0.5">·</span>
        <button
          onClick={() => onToggleMode('tour')}
          className={`text-sm transition-colors duration-200 ${
            activeMode === 'tour'
              ? 'text-foreground font-medium'
              : 'text-muted-foreground hover:text-foreground/70'
          }`}
        >
          Tour
        </button>
      </div>

      {tourLabel && (
        <div className="flex items-center gap-3 pt-1">
          <span className="text-xs text-muted-foreground italic">Tour: {tourLabel}</span>
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
    </header>
  );
}
