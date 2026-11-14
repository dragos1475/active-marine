// Wind forecast at the ports, from MET Norway's Locationforecast (free, CC BY 4.0).
// This file is pure: unit conversions and reading the forecast. The request itself is in
// port-wind.functions.ts, which runs on the server only.

/** One step of the outlook: the wind at the start of that hour. */
export type WindPoint = { time: string; speedKn: number; directionDeg: number; compass: string; beaufort: number };

export const OUTLOOK_HOURS = 48;
export const OUTLOOK_STEP_HOURS = 3;

export type PortWind = {
  name: string;
  speedKn: number;
  /** Not shown on the site: the service has no gust forecast for the China coast, only for Nordic waters. */
  gustKn: number | null;
  /** Direction the wind blows FROM, in degrees. */
  directionDeg: number;
  compass: string;
  beaufort: number;
  /** Start of the forecast hour, ISO 8601. */
  validAt: string;
  /** Every third hour for the next two days, starting with the current hour. */
  outlook: WindPoint[];
};

export type PortWindReport = { ports: PortWind[] };

const KNOTS_PER_MS = 1.943844;
export const toKnots = (metresPerSecond: number) => Math.round(metresPerSecond * KNOTS_PER_MS);

const COMPASS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
export const compassPoint = (degrees: number) => COMPASS[Math.round((((degrees % 360) + 360) % 360) / 22.5) % 16] ?? "N";

// Upper limit of each Beaufort force in knots, forces 0 to 11; anything above is force 12.
const BEAUFORT_UPPER_KN = [0, 3, 6, 10, 16, 21, 27, 33, 40, 47, 55, 63];
export function beaufort(knots: number): number {
  const force = BEAUFORT_UPPER_KN.findIndex((upper) => knots <= upper);
  return force === -1 ? 12 : force;
}

type Details = { wind_speed?: unknown; wind_from_direction?: unknown; wind_speed_of_gust?: unknown };
type Entry = { time?: unknown; data?: { instant?: { details?: Details } } };

const isNumber = (value: unknown): value is number => typeof value === "number" && Number.isFinite(value);

function pointOf(entry: Entry): WindPoint | null {
  const details = entry.data?.instant?.details;
  if (typeof entry.time !== "string" || !details) return null;
  const { wind_speed: speed, wind_from_direction: direction } = details;
  if (!isNumber(speed) || !isNumber(direction)) return null;
  const speedKn = toKnots(speed);
  return { time: entry.time, speedKn, directionDeg: Math.round(direction), compass: compassPoint(direction), beaufort: beaufort(speedKn) };
}

/** Reads the forecast hour that covers `now`, and the outlook after it, out of a Locationforecast response; null if it is unusable. */
export function readWind(name: string, forecast: unknown, now: Date): PortWind | null {
  const series = (forecast as { properties?: { timeseries?: unknown } } | null)?.properties?.timeseries;
  if (!Array.isArray(series)) return null;
  const entries = series as Entry[];
  // Entries are hourly and in order; take the last one that has already started.
  const started = entries.filter((entry) => typeof entry.time === "string" && Date.parse(entry.time) <= now.getTime());
  const entry = started.at(-1) ?? entries[0];
  const current = entry ? pointOf(entry) : null;
  if (!entry || !current) return null;
  const gust = entry.data?.instant?.details?.wind_speed_of_gust;
  const start = Date.parse(current.time);
  const hour = 60 * 60 * 1000;
  const outlook = entries.flatMap((candidate) => {
    const point = pointOf(candidate);
    if (!point) return [];
    const hoursAhead = (Date.parse(point.time) - start) / hour;
    const wanted = hoursAhead >= 0 && hoursAhead <= OUTLOOK_HOURS && hoursAhead % OUTLOOK_STEP_HOURS === 0;
    return wanted ? [point] : [];
  });
  return {
    name,
    speedKn: current.speedKn,
    gustKn: isNumber(gust) ? toKnots(gust) : null,
    directionDeg: current.directionDeg,
    compass: current.compass,
    beaufort: current.beaufort,
    validAt: current.time,
    outlook,
  };
}

/** The strongest wind in an outlook, or null when there is none. */
export function strongest(outlook: WindPoint[]): WindPoint | null {
  return outlook.reduce<WindPoint | null>((max, point) => (!max || point.speedKn > max.speedKn ? point : max), null);
}

/** How long a response may be reused: until the service's Expires time, within sensible bounds. */
export function cacheUntil(expiresHeader: string | null, now: number): number {
  const minimum = now + 10 * 60 * 1000;
  const maximum = now + 2 * 60 * 60 * 1000;
  const expires = expiresHeader ? Date.parse(expiresHeader) : Number.NaN;
  if (Number.isNaN(expires)) return now + 30 * 60 * 1000;
  return Math.min(Math.max(expires, minimum), maximum);
}
