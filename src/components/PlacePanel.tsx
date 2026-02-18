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
  const nextPlace = places[currentIndex + 1];
  if (!place) return null;

  const dist = distanceKm(userLat, userLng, place.lat, place.lng);
  const walkingLine = formatWalkingLine(dist);
  const isPast = place.timeLayers.includes('past');

  const slideClass =
    animDir === 'left'
      ? '-translate-x-2 opacity-0'
      : animDir === 'right'
      ? 'translate-x-2 opacity-0'
      : 'translate-x-0 opacity-100';

  return (
    <div className="h-full flex flex-col items-center justify-center px-5 gap-4">
      {/* Main panel */}
      <div
        {...handlers}
        onClick={() => onOpenDetail(place)}
        className={`
          w-full bg-[hsl(var(--panel-bg))] border border-[hsl(var(--panel-border))]
          rounded-sm cursor-pointer select-none overflow-hidden
          transition-all duration-[350ms] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]
          ${slideClass}
          active:opacity-80
        `}
      >
        {isPast ? (
          /* Past / historical: tall image on top, text below */
          <>
            <div className="w-full h-56 bg-muted relative">
              <img
                src={place.thumbnail}
                alt={place.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              {/* Zoom hint */}
              <div className="absolute bottom-2 right-2 bg-background/70 backdrop-blur-sm rounded-sm px-1.5 py-0.5 text-[10px] text-foreground/60 tracking-wide">
                tap to expand
              </div>
            </div>
            <div className="p-4 space-y-2">
              <h2 className="serif text-xl font-medium leading-snug text-foreground">
                {place.name}
              </h2>
              <div className="flex items-center gap-3">
                <TimeIndicator layers={place.timeLayers} />
                <p className="text-xs text-muted-foreground tracking-wide">{walkingLine}</p>
              </div>
            </div>
          </>
        ) : (
          /* Present / future: original side-by-side layout */
          <div className="flex gap-5 p-5">
            <div className="flex-shrink-0 w-28 h-28 rounded-sm overflow-hidden bg-muted flex items-center justify-center">
              <img
                src={place.thumbnail}
                alt={place.name}
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            </div>
            <div className="flex-1 min-w-0 space-y-2.5 py-1">
              <h2 className="serif text-xl font-medium leading-snug text-foreground">
                {place.name}
              </h2>
              <p className="text-xs text-muted-foreground tracking-wide">{walkingLine}</p>
              <TimeIndicator layers={place.timeLayers} />
            </div>
          </div>
        )}
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

      {/* Hint + up next */}
      <div className="text-center space-y-1">
        {isFirstVisit && (
          <p className="text-xs text-muted-foreground/60 tracking-wide">
            Swipe to see the next place
          </p>
        )}
        {nextPlace && (
          <p className="text-xs text-muted-foreground/50">
            Up next: {nextPlace.name}
          </p>
        )}
      </div>
    </div>
  );
}
