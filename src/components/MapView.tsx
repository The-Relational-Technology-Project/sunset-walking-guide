import { useEffect, useRef, useState } from 'react';
import { Place } from '@/data/places';

interface MapViewProps {
  places: Place[];
  userLat: number;
  userLng: number;
  onOpenDetail: (place: Place) => void;
}

const PIN_COLORS: Record<string, string> = {
  past: '#a07860',
  present: '#3d3830',
  future: '#7a8fa6',
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

export function MapView({ places, userLat, userLng, onOpenDetail }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  // Load Leaflet CSS + JS dynamically
  useEffect(() => {
    // Already fully loaded
    if ((window as any).L) {
      setLeafletLoaded(true);
      return;
    }

    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const existingScript = document.getElementById('leaflet-js');
    if (existingScript) {
      existingScript.addEventListener('load', () => setLeafletLoaded(true));
      return;
    }

    const script = document.createElement('script');
    script.id = 'leaflet-js';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => setLeafletLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Initialize map once Leaflet is loaded
  useEffect(() => {
    if (!leafletLoaded || !mapRef.current || mapInstanceRef.current) return;

    const L = (window as any).L;
    if (!L) return;

    // Compute bounds
    const allLats = [...places.map((p) => p.lat), userLat];
    const allLngs = [...places.map((p) => p.lng), userLng];
    const minLat = Math.min(...allLats);
    const maxLat = Math.max(...allLats);
    const minLng = Math.min(...allLngs);
    const maxLng = Math.max(...allLngs);

    const map = L.map(mapRef.current, {
      zoomControl: true,
      attributionControl: true,
    });

    // Fit bounds with padding
    map.fitBounds(
      [[minLat - 0.002, minLng - 0.003], [maxLat + 0.002, maxLng + 0.003]],
    );

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    // User location marker
    const userIcon = L.divIcon({
      className: '',
      html: `<div style="width:20px;height:20px;position:relative;">
        <div style="position:absolute;inset:0;border-radius:50%;background:hsl(18 35% 62%);opacity:0.15;"></div>
        <div style="position:absolute;top:5px;left:5px;width:10px;height:10px;border-radius:50%;background:hsl(18 35% 62%);opacity:0.9;"></div>
      </div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });
    L.marker([userLat, userLng], { icon: userIcon, interactive: false }).addTo(map);

    // Place markers
    places.forEach((place) => {
      const color = getPinColor(place);
      const style = getPinStyle(place);

      let svgCircle: string;
      if (style === 'solid') {
        svgCircle = `<circle cx="7" cy="7" r="6" fill="${color}" opacity="0.85"/>`;
      } else if (style === 'outline') {
        svgCircle = `<circle cx="7" cy="7" r="5.5" fill="none" stroke="${color}" stroke-width="1.5" opacity="0.75"/>`;
      } else {
        svgCircle = `<circle cx="7" cy="7" r="5.5" fill="none" stroke="${color}" stroke-width="1.5" stroke-dasharray="3 2" opacity="0.7"/>`;
      }

      const icon = L.divIcon({
        className: '',
        html: `<svg width="14" height="14" viewBox="0 0 14 14">${svgCircle}</svg>`,
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      });

      const marker = L.marker([place.lat, place.lng], { icon }).addTo(map);
      marker.on('click', () => onOpenDetail(place));
    });

    // Apply grayscale to tiles for aesthetic consistency
    const tilePane = mapRef.current.querySelector('.leaflet-tile-pane') as HTMLElement;
    if (tilePane) {
      tilePane.style.filter = 'grayscale(1) opacity(0.9)';
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [leafletLoaded, places, userLat, userLng, onOpenDetail]);

  return (
    <div className="px-3 py-3 pb-8 flex-1 flex flex-col">
      <div className="rounded-sm overflow-hidden border border-border flex-1 min-h-[350px] relative z-0">
        <div ref={mapRef} className="w-full h-full absolute inset-0" />
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
