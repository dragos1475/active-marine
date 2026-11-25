import supply0 from "@/assets/placements/supply-00.jpg";
import engineering0 from "@/assets/placements/engineering-00.jpg";
import supply1 from "@/assets/placements/supply-01.jpg";
import port0 from "@/assets/placements/port-00.jpg";
import port1 from "@/assets/placements/port-01.jpg";
import inspection0 from "@/assets/placements/inspection-00.jpg";
import supply2 from "@/assets/placements/supply-02.jpg";
import engineering1 from "@/assets/placements/engineering-01.jpg";
import supply3 from "@/assets/placements/supply-03.jpg";
import port2 from "@/assets/placements/port-02.jpg";
import port3 from "@/assets/placements/port-03.jpg";
import inspection1 from "@/assets/placements/inspection-01.jpg";
import engineering2 from "@/assets/placements/engineering-02.jpg";
import supply4 from "@/assets/placements/supply-04.jpg";
import port4 from "@/assets/placements/port-04.jpg";
import port5 from "@/assets/placements/port-05.jpg";
import inspection2 from "@/assets/placements/inspection-02.jpg";
import supply5 from "@/assets/placements/supply-05.jpg";
import supply6 from "@/assets/placements/supply-06.jpg";
import port6 from "@/assets/placements/port-06.jpg";
import port7 from "@/assets/placements/port-07.jpg";
import inspection3 from "@/assets/placements/inspection-03.jpg";
import supply7 from "@/assets/placements/supply-07.jpg";
import engineering3 from "@/assets/placements/engineering-03.jpg";
import port8 from "@/assets/placements/port-08.jpg";
import port9 from "@/assets/placements/port-09.jpg";
import inspection4 from "@/assets/placements/inspection-04.jpg";
import supply8 from "@/assets/placements/supply-08.jpg";
import engineering4 from "@/assets/placements/engineering-04.jpg";
import supply9 from "@/assets/placements/supply-09.jpg";
import port10 from "@/assets/placements/port-10.jpg";
import inspection5 from "@/assets/placements/inspection-05.jpg";
import supply10 from "@/assets/placements/supply-10.jpg";
import engineering5 from "@/assets/placements/engineering-05.jpg";
import supply11 from "@/assets/placements/supply-11.jpg";
import port11 from "@/assets/placements/port-11.jpg";
import inspection6 from "@/assets/placements/inspection-06.jpg";
import supply12 from "@/assets/placements/supply-12.jpg";
import engineering6 from "@/assets/placements/engineering-06.jpg";
import supply13 from "@/assets/placements/supply-13.jpg";
import port12 from "@/assets/placements/port-12.jpg";
import port13 from "@/assets/placements/port-13.jpg";
import engineering7 from "@/assets/placements/engineering-07.jpg";
import supply14 from "@/assets/placements/supply-14.jpg";
import inspection7 from "@/assets/placements/inspection-07.jpg";
import inspection8 from "@/assets/placements/inspection-08.jpg";
import inspection9 from "@/assets/placements/inspection-09.jpg";
import port14 from "@/assets/placements/port-14.jpg";
import engineering8 from "@/assets/placements/engineering-08.jpg";
import engineering9 from "@/assets/placements/engineering-09.jpg";
import engineering10 from "@/assets/placements/engineering-10.jpg";
import inspection10 from "@/assets/placements/inspection-10.jpg";
import inspection11 from "@/assets/placements/inspection-11.jpg";
import supply15 from "@/assets/placements/supply-15.jpg";
import inspection12 from "@/assets/placements/inspection-12.jpg";
import inspection13 from "@/assets/placements/inspection-13.jpg";
import about from "@/assets/about-vessel-transit.jpg";
import projects from "@/assets/projects-shipyard-panorama.jpg";
import faq from "@/assets/faq-harbor-channel.jpg";
import contact from "@/assets/contact-port-arrival.jpg";
import network from "@/assets/china-port-daylight.jpg";
import sourcing from "@/assets/marine-spares-electronics.png.asset.json";
import machinery from "@/assets/marine-engine-machinery.jpg";
import spares from "@/assets/marine-precision-spares.jpg";
import drydock from "@/assets/marine-drydock-daylight.jpg";
import logistics from "@/assets/marine-port-logistics.jpg";
import survey from "@/assets/marine-survey-instruments.jpg";

export const MARITIME_IMAGES = { machinery, spares, drydock, logistics, survey };
export const SERVICE_IMAGES: Record<string, { src: string; alt: string }> = {
  "ship-spares": { src: spares, alt: "Illustrative marine piston, cylinder liner and fuel injector" },
  "technical-services": { src: machinery, alt: "Illustrative ship diesel engine and pipework" },
  "china-sourcing": { src: sourcing.url, alt: "Illustrative precision marine components ready for sourcing" },
  logistics: { src: logistics, alt: "Illustrative container vessel alongside a port terminal" },
  "docking-supervision": { src: drydock, alt: "Illustrative vessel hull, propeller and rudder in dry dock" },
  "marine-surveys": { src: survey, alt: "Illustrative thickness gauge and measuring instruments on a vessel deck" },
};
export type MaritimePhoto = { src: string; alt: string };
export const HOME_SERVICE_IMAGES: Record<string, MaritimePhoto> = {
  "ship-spares": { src: supply0, alt: "Illustrative maritime supply equipment and operations" },
  "technical-services": { src: engineering0, alt: "Illustrative maritime engineering equipment and operations" },
  "china-sourcing": { src: supply1, alt: "Illustrative maritime supply equipment and operations" },
  "logistics": { src: port0, alt: "Illustrative maritime port equipment and operations" },
  "docking-supervision": { src: port1, alt: "Illustrative maritime port equipment and operations" },
  "marine-surveys": { src: inspection0, alt: "Illustrative maritime inspection equipment and operations" }
};
export const LIST_SERVICE_IMAGES: Record<string, MaritimePhoto> = {
  "ship-spares": { src: supply2, alt: "Illustrative maritime supply equipment and operations" },
  "technical-services": { src: engineering1, alt: "Illustrative maritime engineering equipment and operations" },
  "china-sourcing": { src: supply3, alt: "Illustrative maritime supply equipment and operations" },
  "logistics": { src: port2, alt: "Illustrative maritime port equipment and operations" },
  "docking-supervision": { src: port3, alt: "Illustrative maritime port equipment and operations" },
  "marine-surveys": { src: inspection1, alt: "Illustrative maritime inspection equipment and operations" }
};
export const RELATED_SERVICE_IMAGES: Record<string, Record<string, MaritimePhoto>> = {
  "ship-spares": {
    "technical-services": { src: engineering2, alt: "Illustrative maritime engineering equipment and operations" },
    "china-sourcing": { src: supply4, alt: "Illustrative maritime supply equipment and operations" },
    "logistics": { src: port4, alt: "Illustrative maritime port equipment and operations" },
    "docking-supervision": { src: port5, alt: "Illustrative maritime port equipment and operations" },
    "marine-surveys": { src: inspection2, alt: "Illustrative maritime inspection equipment and operations" }
  },
  "technical-services": {
    "ship-spares": { src: supply5, alt: "Illustrative maritime supply equipment and operations" },
    "china-sourcing": { src: supply6, alt: "Illustrative maritime supply equipment and operations" },
    "logistics": { src: port6, alt: "Illustrative maritime port equipment and operations" },
    "docking-supervision": { src: port7, alt: "Illustrative maritime port equipment and operations" },
    "marine-surveys": { src: inspection3, alt: "Illustrative maritime inspection equipment and operations" }
  },
  "china-sourcing": {
    "ship-spares": { src: supply7, alt: "Illustrative maritime supply equipment and operations" },
    "technical-services": { src: engineering3, alt: "Illustrative maritime engineering equipment and operations" },
    "logistics": { src: port8, alt: "Illustrative maritime port equipment and operations" },
    "docking-supervision": { src: port9, alt: "Illustrative maritime port equipment and operations" },
    "marine-surveys": { src: inspection4, alt: "Illustrative maritime inspection equipment and operations" }
  },
  "logistics": {
    "ship-spares": { src: supply8, alt: "Illustrative maritime supply equipment and operations" },
    "technical-services": { src: engineering4, alt: "Illustrative maritime engineering equipment and operations" },
    "china-sourcing": { src: supply9, alt: "Illustrative maritime supply equipment and operations" },
    "docking-supervision": { src: port10, alt: "Illustrative maritime port equipment and operations" },
    "marine-surveys": { src: inspection5, alt: "Illustrative maritime inspection equipment and operations" }
  },
  "docking-supervision": {
    "ship-spares": { src: supply10, alt: "Illustrative maritime supply equipment and operations" },
    "technical-services": { src: engineering5, alt: "Illustrative maritime engineering equipment and operations" },
    "china-sourcing": { src: supply11, alt: "Illustrative maritime supply equipment and operations" },
    "logistics": { src: port11, alt: "Illustrative maritime port equipment and operations" },
    "marine-surveys": { src: inspection6, alt: "Illustrative maritime inspection equipment and operations" }
  },
  "marine-surveys": {
    "ship-spares": { src: supply12, alt: "Illustrative maritime supply equipment and operations" },
    "technical-services": { src: engineering6, alt: "Illustrative maritime engineering equipment and operations" },
    "china-sourcing": { src: supply13, alt: "Illustrative maritime supply equipment and operations" },
    "logistics": { src: port12, alt: "Illustrative maritime port equipment and operations" },
    "docking-supervision": { src: port13, alt: "Illustrative maritime port equipment and operations" }
  }
};
export const PLACEMENT_IMAGES = {
  "home-parts": { src: engineering7, alt: "Illustrative maritime engineering equipment and operations" },
  "services-parts": { src: engineering8, alt: "Illustrative maritime engineering equipment and operations" },
  "approach-0": { src: inspection7, alt: "Illustrative maritime inspection equipment and operations" },
  "approach-1": { src: inspection8, alt: "Illustrative maritime inspection equipment and operations" },
  "approach-2": { src: inspection9, alt: "Illustrative maritime inspection equipment and operations" },
  "network-background": { src: port14, alt: "Illustrative maritime port equipment and operations" },
  // Spare parts on purpose: the company asked for parts here, not plant pipework.
  "network-parts": { src: supply14, alt: "Illustrative marine filter elements ready for supply" },
  "case-0": { src: engineering9, alt: "Illustrative maritime engineering equipment and operations" },
  "case-1": { src: engineering10, alt: "Illustrative maritime engineering equipment and operations" },
  "case-2": { src: inspection10, alt: "Illustrative maritime inspection equipment and operations" },
  "insights-main": { src: inspection11, alt: "Illustrative maritime inspection equipment and operations" },
  "insights-0": { src: supply15, alt: "Illustrative maritime supply equipment and operations" },
  "insights-1": { src: inspection12, alt: "Illustrative maritime inspection equipment and operations" },
  "enquiry": { src: inspection13, alt: "Illustrative maritime inspection equipment and operations" }
};
export const PAGE_IMAGES = { about, projects, faq, contact, network };
