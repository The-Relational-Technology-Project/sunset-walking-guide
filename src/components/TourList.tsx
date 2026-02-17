import { Place } from '@/data/places';

export type TourType = 'past' | 'present' | 'future' | 'very-local';

export interface Tour {
  id: TourType;
  name: string;
  description: string;
  walkingTime: string;
}

export const TOURS: Tour[] = [
  {
    id: 'past',
    name: 'Past',
    description: 'Historical sites, old photo locations, and neighborhood memory.',
    walkingTime: 'About 45 min',
  },
  {
    id: 'present',
    name: 'Present',
    description: 'Open businesses, active community groups, and current gathering spaces.',
    walkingTime: 'About 40 min',
  },
  {
    id: 'future',
    name: 'Future',
    description: 'Community dreams, planned projects, and neighbor aspirations.',
    walkingTime: 'About 15 min',
  },
  {
    id: 'very-local',
    name: 'Very local',
    description: 'The five or six nearest places. A short walk for a quiet afternoon.',
    walkingTime: 'About 20 min',
  },
];

interface TourListProps {
  allPlaces: Place[];
  userLat: number;
  userLng: number;
  onSelectTour: (tour: Tour, places: Place[]) => void;
}

export function TourList({ allPlaces, userLat, userLng, onSelectTour }: TourListProps) {
  const handleSelect = (tour: Tour) => {
    let filtered: Place[];

    if (tour.id === 'very-local') {
      // Sort by distance, take closest 6
      const withDist = allPlaces.map((p) => {
        const R = 6371;
        const dLat = ((p.lat - userLat) * Math.PI) / 180;
        const dLng = ((p.lng - userLng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((userLat * Math.PI) / 180) *
            Math.cos((p.lat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        return { place: p, dist: R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) };
      });
      filtered = withDist
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 6)
        .map((d) => d.place);
    } else {
      filtered = allPlaces.filter((p) => p.timeLayers.includes(tour.id as any));
    }

    onSelectTour(tour, filtered);
  };

  return (
    <div className="px-6 pt-2 pb-6">
      <div className="space-y-0">
        {TOURS.map((tour, i) => (
          <button
            key={tour.id}
            onClick={() => handleSelect(tour)}
            className={`w-full text-left py-5 flex flex-col gap-1 transition-colors hover:bg-muted/50 -mx-1 px-1 rounded-sm
              ${i < TOURS.length - 1 ? 'border-b border-border' : ''}`}
          >
            <div className="flex items-baseline justify-between gap-2">
              <span className="serif text-base font-medium text-foreground">{tour.name}</span>
              <span className="text-xs text-muted-foreground flex-shrink-0">{tour.walkingTime}</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{tour.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
