/**
 * Generate the environmental context line shown in the header.
 * e.g. "Foggy Tuesday evening · 6:14 pm"
 */

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function getTimeOfDay(hour: number): string {
  if (hour < 5) return 'night';
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  if (hour < 20) return 'evening';
  return 'night';
}

/**
 * Outer Sunset is famously foggy. Generate a plausible weather hint.
 * We bias heavily toward fog, especially in the evening and morning.
 */
function getWeatherHint(hour: number, month: number): string {
  // SF fog season is roughly June–September ("June Gloom")
  const isFogSeason = month >= 5 && month <= 9; // 0-indexed: June=5, September=8... wait no
  // month from Date is 0-indexed: Jan=0, Jun=5, Sep=8
  const isFogSeasonActual = month >= 5 && month <= 8;
  const isEveningOrMorning = hour < 10 || hour >= 17;

  const fogProbability = isFogSeasonActual ? 0.75 : isEveningOrMorning ? 0.55 : 0.35;
  const r = Math.random();

  if (r < fogProbability) return 'Foggy';
  if (r < fogProbability + 0.2) return 'Overcast';
  if (r < fogProbability + 0.35) return 'Partly cloudy';
  return 'Clear';
}

export function getEnvironmentalContext(): string {
  const now = new Date();
  const hour = now.getHours();
  const month = now.getMonth();
  const day = DAYS[now.getDay()];
  const timeOfDay = getTimeOfDay(hour);

  // Format time: "6:14 pm"
  const h12 = hour % 12 || 12;
  const min = now.getMinutes().toString().padStart(2, '0');
  const ampm = hour < 12 ? 'am' : 'pm';
  const timeStr = `${h12}:${min} ${ampm}`;

  const weather = getWeatherHint(hour, month);

  return `${weather} ${day} ${timeOfDay} · ${timeStr}`;
}

export function getContextRefreshMs(): number {
  // Refresh the context line once per minute
  return 60_000;
}
