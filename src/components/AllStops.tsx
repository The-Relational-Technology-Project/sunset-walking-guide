import { Place } from '@/data/places';
import { TimeIndicator } from './TimeIndicator';
import { formatWalkingLine, distanceKm } from '@/utils/geo';

interface AllStopsProps {
  places: Place[];
  userLat: number;
  userLng: number;
  onOpenDetail: (place: Place) => void;
}

export function AllStops({ places, userLat, userLng, onOpenDetail }: AllStopsProps) {
  const sorted = [...places].sort(
    (a, b) =>
      distanceKm(userLat, userLng, a.lat, a.lng) -
      distanceKm(userLat, userLng, b.lat, b.lng)
  );

  return (
    <div className="px-5 py-2 pb-8">
      <div className="space-y-0">
        {sorted.map((place, i) => {
          const dist = distanceKm(userLat, userLng, place.lat, place.lng);
          const walkLine = formatWalkingLine(dist);
          const isHere = dist < 0.16;

          return (
            <button
              key={place.id}
              onClick={() => onOpenDetail(place)}
              className={`w-full text-left py-4 flex items-center gap-3 hover:bg-muted/40 transition-colors -mx-1 px-1 rounded-sm
                ${isHere ? 'bg-[hsl(var(--accent))]/5' : ''}
                ${i < sorted.length - 1 ? 'border-b border-border' : ''}`}
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-10 h-10 rounded-sm overflow-hidden bg-muted">
                <img
                  src={place.thumbnail}
                  alt={place.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="serif text-sm font-medium text-foreground leading-snug truncate">
                  {place.name}
                </p>
                {place.address && (
                  <p className="text-[11px] text-muted-foreground/60 truncate">{place.address}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  {isHere ? <span className="serif italic text-accent-foreground/70">You're here</span> : walkLine}
                </p>
              </div>

              {/* Time indicator */}
              <TimeIndicator layers={place.timeLayers} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
