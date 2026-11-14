import { describe, expect, it } from "vitest";
import { PORTS } from "@/components/site/content";
import { beaufort, cacheUntil, compassPoint, readWind, strongest, toKnots } from "@/lib/port-wind";

const forecast = {
  properties: {
    timeseries: [
      { time: "2026-11-14T21:00:00Z", data: { instant: { details: { wind_speed: 5, wind_from_direction: 10, wind_speed_of_gust: 8 } } } },
      { time: "2026-11-14T22:00:00Z", data: { instant: { details: { wind_speed: 8.4, wind_from_direction: 344.9, wind_speed_of_gust: 12.1 } } } },
      { time: "2026-11-14T23:00:00Z", data: { instant: { details: { wind_speed: 9, wind_from_direction: 350 } } } },
    ],
  },
};

describe("Port wind", () => {
  it("converts metres per second to whole knots", () => {
    expect(toKnots(8.4)).toBe(16);
    expect(toKnots(0)).toBe(0);
  });

  it("names the direction the wind comes from on a 16-point compass", () => {
    expect(compassPoint(0)).toBe("N");
    expect(compassPoint(344.9)).toBe("NNW");
    expect(compassPoint(359)).toBe("N");
    expect(compassPoint(180)).toBe("S");
    expect(compassPoint(-90)).toBe("W");
  });

  it("maps knots to the Beaufort force", () => {
    expect(beaufort(0)).toBe(0);
    expect(beaufort(3)).toBe(1);
    expect(beaufort(16)).toBe(4);
    expect(beaufort(17)).toBe(5);
    expect(beaufort(34)).toBe(8);
    expect(beaufort(70)).toBe(12);
  });

  it("reads the forecast hour that has already started", () => {
    const wind = readWind("Ningbo", forecast, new Date("2026-11-14T22:40:00Z"));
    expect(wind).toMatchObject({ name: "Ningbo", speedKn: 16, gustKn: 24, directionDeg: 345, compass: "NNW", beaufort: 4, validAt: "2026-11-14T22:00:00Z" });
  });

  it("builds a two-day outlook in three-hour steps from the current hour", () => {
    const start = Date.parse("2026-11-14T22:00:00Z");
    const hourly = { properties: { timeseries: Array.from({ length: 60 }, (_, h) => ({
      time: new Date(start + h * 3600000).toISOString().replace(".000Z", "Z"),
      data: { instant: { details: { wind_speed: h === 9 ? 15 : 5, wind_from_direction: 90 } } },
    })) } };
    const wind = readWind("Ningbo", hourly, new Date(start + 20 * 60000));
    expect(wind?.outlook).toHaveLength(17);
    expect(wind?.outlook[0]?.time).toBe("2026-11-14T22:00:00Z");
    expect(wind?.outlook[1]?.time).toBe("2026-11-15T01:00:00Z");
    expect(wind?.outlook.at(-1)?.time).toBe("2026-11-16T22:00:00Z");
    expect(strongest(wind?.outlook ?? [])).toMatchObject({ time: "2026-11-15T07:00:00Z", speedKn: 29, beaufort: 7 });
    expect(strongest([])).toBeNull();
  });

  it("copes with a missing gust and with a forecast that starts in the future", () => {
    expect(readWind("Ningbo", forecast, new Date("2026-11-14T23:10:00Z"))?.gustKn).toBeNull();
    expect(readWind("Ningbo", forecast, new Date("2026-11-14T20:00:00Z"))?.validAt).toBe("2026-11-14T21:00:00Z");
  });

  it("returns nothing for a response without usable wind", () => {
    expect(readWind("Ningbo", null, new Date())).toBeNull();
    expect(readWind("Ningbo", { properties: { timeseries: [] } }, new Date())).toBeNull();
    expect(readWind("Ningbo", { properties: { timeseries: [{ time: "2026-11-14T22:00:00Z", data: { instant: { details: { wind_speed: "strong" } } } }] } }, new Date("2026-11-14T22:10:00Z"))).toBeNull();
  });

  it("reuses a response until the service says it expires, within bounds", () => {
    const now = Date.parse("2026-11-14T22:00:00Z");
    expect(cacheUntil("Sat, 14 Nov 2026 22:31:00 GMT", now)).toBe(Date.parse("2026-11-14T22:31:00Z"));
    expect(cacheUntil("Sat, 14 Nov 2026 22:01:00 GMT", now)).toBe(now + 10 * 60 * 1000);
    expect(cacheUntil("Sun, 15 Nov 2026 22:00:00 GMT", now)).toBe(now + 2 * 60 * 60 * 1000);
    expect(cacheUntil(null, now)).toBe(now + 30 * 60 * 1000);
  });

  it("gives every port coordinates the weather service accepts", () => {
    for (const port of PORTS) {
      expect(port.lat).toBeGreaterThan(18);
      expect(port.lat).toBeLessThan(42);
      expect(port.lon).toBeGreaterThan(105);
      expect(port.lon).toBeLessThan(125);
      expect(String(port.lat).split(".")[1]?.length ?? 0).toBeLessThanOrEqual(4);
      expect(String(port.lon).split(".")[1]?.length ?? 0).toBeLessThanOrEqual(4);
    }
  });
});
