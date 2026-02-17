import { Place } from '@/data/places';

interface MapViewProps {
  places: Place[];
  userLat: number;
  userLng: number;
  onOpenDetail: (place: Place) => void;
}

// Time layer → pin color (using CSS variables is tricky in inline SVG, so using fixed values)
const PIN_COLORS: Record<string, string> = {
  past: '#a07860',    // sepia / terracotta
  present: '#3d3830', // dark charcoal
  future: '#7a8fa6',  // slate blue
  mixed: '#5a6670',
};

function getPinColor(place: Place): string {
  const layers = place.timeLayers;
  if (layers.length > 1) return PIN_COLORS.mixed;
  return PIN_COLORS[layers[0]] ?? PIN_COLORS.present;
}

function getPinStyle(place: Place): 'solid' | 'outline' | 'dashed' {
  if (place.timeLayers.includes('future') && place.timeLayers.length === 1) return 'dashed';
  if (place.timeLayers.includes('past') && place.timeLayers.length === 1) return 'outline';
  return 'solid';
}

// Simple Mercator projection helpers for a small bounding box
function latLngToXY(
  lat: number, lng: number,
  minLat: number, maxLat: number,
  minLng: number, maxLng: number,
  width: number, height: number
) {
  const x = ((lng - minLng) / (maxLng - minLng)) * width;
  const y = ((maxLat - lat) / (maxLat - minLat)) * height;
  return { x, y };
}

export function MapView({ places, userLat, userLng, onOpenDetail }: MapViewProps) {
  const W = 380;
  const H = 460;
  const PAD = 28;

  const allLats = [...places.map((p) => p.lat), userLat];
  const allLngs = [...places.map((p) => p.lng), userLng];
  const minLat = Math.min(...allLats) - 0.005;
  const maxLat = Math.max(...allLats) + 0.005;
  const minLng = Math.min(...allLngs) - 0.007;
  const maxLng = Math.max(...allLngs) + 0.007;

  const toXY = (lat: number, lng: number) =>
    latLngToXY(lat, lng, minLat, maxLat, minLng, maxLng, W - PAD * 2, H - PAD * 2);

  const userPos = toXY(userLat, userLng);

  return (
    <div className="px-3 py-3 pb-8">
      <div className="rounded-sm overflow-hidden border border-border bg-[hsl(var(--panel-bg))]">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          className="block"
          style={{ background: 'hsl(var(--panel-bg))' }}
        >
          {/* Grid / background texture */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(35 12% 86%)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#grid)" />

          {/* User location dot */}
          <circle
            cx={userPos.x + PAD}
            cy={userPos.y + PAD}
            r={5}
            fill="hsl(18 35% 62%)"
            opacity={0.85}
          />
          <circle
            cx={userPos.x + PAD}
            cy={userPos.y + PAD}
            r={10}
            fill="hsl(18 35% 62%)"
            opacity={0.15}
          />

          {/* Place pins */}
          {places.map((place) => {
            const pos = toXY(place.lat, place.lng);
            const color = getPinColor(place);
            const style = getPinStyle(place);
            const cx = pos.x + PAD;
            const cy = pos.y + PAD;

            return (
              <g
                key={place.id}
                onClick={() => onOpenDetail(place)}
                className="cursor-pointer"
                role="button"
                aria-label={place.name}
              >
                {style === 'solid' && (
                  <circle cx={cx} cy={cy} r={7} fill={color} opacity={0.85} />
                )}
                {style === 'outline' && (
                  <circle cx={cx} cy={cy} r={7} fill="none" stroke={color} strokeWidth={1.5} opacity={0.75} />
                )}
                {style === 'dashed' && (
                  <circle cx={cx} cy={cy} r={7} fill="none" stroke={color} strokeWidth={1.5} strokeDasharray="3 2" opacity={0.7} />
                )}
                {/* Hit target */}
                <circle cx={cx} cy={cy} r={14} fill="transparent" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-3 flex items-center gap-4 px-1">
        {[
          { label: 'Past', color: PIN_COLORS.past, style: 'outline' as const },
          { label: 'Present', color: PIN_COLORS.present, style: 'solid' as const },
          { label: 'Future', color: PIN_COLORS.future, style: 'dashed' as const },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-1.5">
            <svg width={12} height={12} viewBox="0 0 12 12">
              {item.style === 'solid' && <circle cx={6} cy={6} r={5} fill={item.color} />}
              {item.style === 'outline' && <circle cx={6} cy={6} r={4} fill="none" stroke={item.color} strokeWidth={1.5} />}
              {item.style === 'dashed' && <circle cx={6} cy={6} r={4} fill="none" stroke={item.color} strokeWidth={1.5} strokeDasharray="2 1.5" />}
            </svg>
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
