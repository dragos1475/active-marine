import { describe, expect, it } from "vitest";
import { HOME_SERVICE_IMAGES, LIST_SERVICE_IMAGES, SERVICE_IMAGES, RELATED_SERVICE_IMAGES, PAGE_IMAGES, PLACEMENT_IMAGES } from "@/components/site/imagery";
import { SERVICES } from "@/components/site/content";
import home from "@/assets/china-daylight-vessel.jpg";
import approach from "@/assets/about-logistics-underway.jpg";
import galleryEngine from "@/assets/placements/engineering-15.jpg";
import galleryDock from "@/assets/placements/port-15.jpg";
import galleryParts from "@/assets/placements/inspection-15.jpg";
import galleryPort from "@/assets/placements/engineering-14.jpg";
import galleryDelivery from "@/assets/hero.png.asset.json";

describe("Distinct photographs throughout the site", () => {
  it("retains all 74 placements with no repeated photograph across pages", () => {
    const photos = [
      ...Object.values(HOME_SERVICE_IMAGES), ...Object.values(LIST_SERVICE_IMAGES),
      ...Object.values(SERVICE_IMAGES), ...Object.values(PLACEMENT_IMAGES),
      ...Object.values(RELATED_SERVICE_IMAGES).flatMap(Object.values),
    ].map((photo) => photo.src);
    photos.push(...Object.values(PAGE_IMAGES), home, approach, galleryEngine, galleryDock, galleryParts, galleryPort, galleryDelivery.url);
    expect(photos).toHaveLength(74);
    expect(new Set(photos).size).toBe(74);
  });

  it("assigns five distinct related-service images on each of the six service pages", () => {
    for (const service of SERVICES) {
      const others = SERVICES.filter((other) => other.slug !== service.slug);
      expect(Object.keys(RELATED_SERVICE_IMAGES[service.slug] ?? {})).toHaveLength(5);
      for (const other of others) {
        expect(RELATED_SERVICE_IMAGES[service.slug]?.[other.slug]?.src).toBeTruthy();
      }
    }
  });
});