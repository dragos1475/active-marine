import { describe, expect, it } from "vitest";
import config from "../../vercel.json";
import ship from "@/assets/hero_ship_cinematic.mp4.asset.json";
import sunset from "@/assets/ship_golden_hour_aerial.mp4.asset.json";
import port from "@/assets/shanghai_port_aerial.mp4.asset.json";
import engine from "@/assets/engine_room_cinematic.mp4.asset.json";

describe("Vercel cinematic media", () => {
  it.each([ship, sunset, port, engine])("forwards $original_filename to the public media service", (asset) => {
    const rule = config.rewrites.find((entry) => entry.source === "/__l5e/assets-v1/:path*");
    expect(rule).toBeDefined();
    expect(asset.url.startsWith("/__l5e/assets-v1/")).toBe(true);
    const destination = rule?.destination.replace(":path*", asset.url.slice("/__l5e/assets-v1/".length));
    expect(destination).toBe(`https://id-preview--d40c0bff-3ade-4f8c-8cd8-663335b2e9b1.lovable.app${asset.url}`);
  });
});