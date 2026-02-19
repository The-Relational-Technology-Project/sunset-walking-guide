export type TimeLayer = 'past' | 'present' | 'future';

export interface Place {
  id: string;
  name: string;
  lat: number;
  lng: number;
  timeLayers: TimeLayer[];
  description: string;
  thumbnail: string;
  address?: string;
  photoCredit?: string;
  audio?: {
    url: string;
    duration: string;
    label: string;
  };
  links?: {
    label: string;
    url: string;
  }[];
}

// Default center: 48th & Irving
export const DEFAULT_CENTER = {
  lat: 37.7637,
  lng: -122.5087,
};

// Radius in km for "in range" check
export const FIELD_GUIDE_RADIUS_KM = 4;
