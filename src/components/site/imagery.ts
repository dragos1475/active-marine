import machinery from "@/assets/marine-engine-machinery.jpg";
import spares from "@/assets/marine-precision-spares.jpg";
import drydock from "@/assets/marine-drydock-daylight.jpg";
import logistics from "@/assets/marine-port-logistics.jpg";

export const MARITIME_IMAGES = { machinery, spares, drydock, logistics };
export const SERVICE_IMAGES: Record<string, { src: string; alt: string }> = {
  "ship-spares": { src: spares, alt: "Illustrative marine piston, cylinder liner and fuel injector" },
  "technical-services": { src: machinery, alt: "Illustrative ship diesel engine and pipework" },
  "china-sourcing": { src: spares, alt: "Illustrative precision marine components ready for sourcing" },
  logistics: { src: logistics, alt: "Illustrative container vessel alongside a port terminal" },
  "docking-supervision": { src: drydock, alt: "Illustrative vessel hull, propeller and rudder in dry dock" },
  "marine-surveys": { src: drydock, alt: "Illustrative exposed vessel hull for inspection" },
};