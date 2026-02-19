import { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Place } from '@/data/places';
import { TimeIndicator } from './TimeIndicator';
import { formatWalkingLine, distanceKm } from '@/utils/geo';

interface PlacePanelProps {
  places: Place[];
  currentIndex: number;
  userLat: number;
  userLng: number;
  onIndexChange: (index: number) => void;
  onOpenDetail: (place: Place) => void;
  isFirstVisit: boolean;
}

export function PlacePanel({
  places,
  currentIndex,
  userLat,
  userLng,
  onIndexChange,
  onOpenDetail,
  isFirstVisit,
}: PlacePanelProps) {
  const [animDir, setAnimDir] = useState<'left' | 'right' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const goNext = () => {
    if (isAnimating || currentIndex >= places.length - 1) return;
    setAnimDir('left');
    setIsAnimating(true);
    setTimeout(() => {
      onIndexChange(currentIndex + 1);
      setAnimDir(null);
      setIsAnimating(false);
    }, 350);
  };

  const goPrev = () => {
    if (isAnimating || currentIndex <= 0) return;
    setAnimDir('right');
    setIsAnimating(true);
    setTimeout(() => {
      onIndexChange(currentIndex - 1);
      setAnimDir(null);
      setIsAnimating(false);
    }, 350);
  };

  const handlers = useSwipeable({
    onSwipedLeft: goNext,
    onSwipedRight: goPrev,
    trackMouse: false,
    preventScrollOnSwipe: true,
    delta: 40,
  });

  const place = places[currentIndex];
  if (!place) return null;

  const dist = distanceKm(userLat, userLng, place.lat, place.lng);
  const walkingLine = formatWalkingLine(dist);
  const isHere = dist < 0.16;

  const slideClass =
    animDir === 'left'
      ? '-translate-x-2 opacity-0'
      : animDir === 'right'
      ? 'translate-x-2 opacity-0'
      : 'translate-x-0 opacity-100';

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-5 gap-4 py-4">
      {/* Main panel — uniform layout for all places */}
      <div
        {...handlers}
        onClick={() => onOpenDetail(place)}
        className={`
          w-full border rounded-sm p-5 cursor-pointer select-none
          transition-all duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
          ${isHere
            ? 'bg-[hsl(var(--accent))]/10 border-[hsl(var(--accent))]'
            : 'bg-[hsl(var(--panel-bg))] border-[hsl(var(--panel-border))]'}
          ${slideClass}
          active:opacity-80
        `}
      >
        {isHere && (
          <p className="serif text-xs italic text-accent-foreground/70 mb-3">You're here</p>
        )}
        <div className="flex gap-5">
          {/* Thumbnail */}
          <div className="flex-shrink-0 w-28 h-28 rounded-sm overflow-hidden bg-muted">
            <img
              src={place.thumbnail}
              alt={place.name}
              className="w-full h-full object-cover"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0 space-y-2.5 py-1">
            <h2 className="serif text-xl font-medium leading-snug text-foreground">
              {place.name}
            </h2>
            {place.address && (
              <p className="text-xs text-muted-foreground/70 truncate">{place.address}</p>
            )}
            <p className="text-sm text-muted-foreground tracking-wide">{walkingLine}</p>
            <TimeIndicator layers={place.timeLayers} />
          </div>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex items-center justify-center gap-1.5">
        {places.map((_, i) => (
          <button
            key={i}
            onClick={() => onIndexChange(i)}
            className={`rounded-full transition-all duration-300 ${
              i === currentIndex
                ? 'w-4 h-1.5 bg-foreground/60'
                : 'w-1.5 h-1.5 bg-foreground/20 hover:bg-foreground/35'
            }`}
            aria-label={`Go to place ${i + 1}`}
          />
        ))}
      </div>

      {/* Back / Next navigation */}
      <div className="flex justify-between items-center w-full max-w-[280px]">
        {currentIndex > 0 ? (
          <button
            onClick={goPrev}
            className="serif text-[11px] tracking-[0.15em] uppercase text-foreground/50 hover:text-foreground/80 transition-colors py-3 px-2 min-h-[44px] flex items-center"
          >
            ← Back
          </button>
        ) : (
          <div className="w-16" />
        )}
        {currentIndex < places.length - 1 ? (
          <button
            onClick={goNext}
            className="serif text-[11px] tracking-[0.15em] uppercase text-foreground/50 hover:text-foreground/80 transition-colors py-3 px-2 min-h-[44px] flex items-center"
          >
            Next →
          </button>
        ) : (
          <div className="w-16" />
        )}
      </div>
    </div>
  );
}
