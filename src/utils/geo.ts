/**
 * Calculate distance between two lat/lng points using Haversine formula.
 * Returns distance in kilometers.
 */
export function distanceKm(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Convert kilometers to miles.
 */
export function kmToMiles(km: number): number {
  return km * 0.621371;
}

/**
 * Estimate walking time from distance in km.
 * Average walking speed ~4.8 km/h = 1 km per ~12.5 min.
 */
export function walkingMinutes(km: number): number {
  return Math.round(km * 12.5);
}

/**
 * Format a walking line string, e.g. "Walk → 3 min · 0.2 mi"
 */
export function formatWalkingLine(km: number): string {
  const miles = kmToMiles(km);
  const mins = walkingMinutes(km);
  const miStr = miles < 0.1 ? '< 0.1 mi' : `${miles.toFixed(1)} mi`;
  if (mins < 1) return `Walk → 1 min · ${miStr}`;
  return `Walk → ${mins} min · ${miStr}`;
}

/**
 * Check if a point is within a given radius (km) from a center.
 */
export function isWithinRadius(
  lat: number, lng: number,
  centerLat: number, centerLng: number,
  radiusKm: number
): boolean {
  return distanceKm(lat, lng, centerLat, centerLng) <= radiusKm;
}

/**
 * Opens directions in Apple/Google Maps based on platform.
 */
export function openDirections(lat: number, lng: number, name: string): void {
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
  if (isIOS) {
    window.open(`maps://maps.apple.com/?daddr=${lat},${lng}&dirflg=w`, '_blank');
  } else {
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=walking`,
      '_blank'
    );
  }
}
