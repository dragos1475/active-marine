import { createServerFn } from "@tanstack/react-start";
import { PORTS } from "@/components/site/content";
import { cacheUntil, readWind, type PortWind, type PortWindReport } from "./port-wind";

// MET Norway's terms ask every client to identify itself with an app or site name and a contact,
// and to reuse a response until its Expires time. Set the contact before going live.
const USER_AGENT = "port-wind-panel/1.0";
const ENDPOINT = "https://api.met.no/weatherapi/locationforecast/2.0/complete";

// Kept per server instance. Visitors never call the weather service themselves, so ten ports cost
// at most ten requests per cache period however many people open the page.
const cache = new Map<string, { until: number; wind: PortWind }>();

async function windAt(port: (typeof PORTS)[number], now: Date): Promise<PortWind | null> {
  const cached = cache.get(port.name);
  if (cached && cached.until > now.getTime()) return cached.wind;
  try {
    const response = await fetch(`${ENDPOINT}?lat=${port.lat.toFixed(4)}&lon=${port.lon.toFixed(4)}`, {
      headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`MET Norway answered ${response.status} for ${port.name}`);
    const wind = readWind(port.name, await response.json(), now);
    if (!wind) throw new Error(`MET Norway sent no usable wind for ${port.name}`);
    cache.set(port.name, { until: cacheUntil(response.headers.get("expires"), now.getTime()), wind });
    return wind;
  } catch (error) {
    console.error(error);
    // A slightly old forecast is better than none; with nothing cached the port is left out.
    return cached?.wind ?? null;
  }
}

export const getPortWind = createServerFn({ method: "GET" }).handler(async (): Promise<PortWindReport> => {
  const now = new Date();
  const results = await Promise.all(PORTS.map((port) => windAt(port, now)));
  return { ports: results.filter((wind): wind is PortWind => wind !== null) };
});
