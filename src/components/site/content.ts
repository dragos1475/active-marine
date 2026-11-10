type Svc = { n: string; tag: string; title: string; text: string };
export const CONTACT = {
  email: "office@activ-marine.com",
  // Placeholder details from the handover — replace when the owner supplies verified ones.
  phone: "+86 21 0000 0000",
  wechat: "ActivMarine_Demo",
  whatsapp: "+86 000 0000 0000",
  company: "Activ Marine (Shanghai) Co., Ltd.",
  address: ["Suite 608, Marine Business Centre", "88 Harbour Avenue, Pudong New Area", "Shanghai 200120, China"],
  placeholder: true,
};

export const NAV = [
  { href: "/#about", label: "About" },
  { href: "/#solutions", label: "Solutions" },
  { href: "/#approach", label: "Approach" },
  { href: "/#team", label: "Team" },
  { href: "/#network", label: "Network" },
  { href: "/#contact", label: "Contact" },
];

export const SERVICES: readonly [Svc, Svc, Svc, Svc, Svc, Svc] = [
  { n: "01", tag: "Supply", title: "Ship Spares & Equipment", text: "Machinery parts, deck equipment, consumables and technical supplies for day-to-day operations." },
  { n: "02", tag: "Service", title: "Technical Services", text: "Engineering support, troubleshooting and repairs for propulsion engines, generators, cranes, engine and deck machinery, piping and steel work. Electrical and electronic repairs, including control systems, automation and fault diagnosis." },
  { n: "03", tag: "Sourcing", title: "China Sourcing & Procurement", text: "Direct contact with manufacturers in China, connecting your technical requirements with suitable products, competitive quotations and coordinated delivery." },
  { n: "04", tag: "Delivery", title: "Logistics & Coordination", text: "Shipment planning and communication to bring marine requirements closer to the vessel." },
  { n: "05", tag: "Docking", title: "Docking Agency & Supervision", text: "Shipyard coordination, docking agency support and on-site repair supervision, keeping scope, quality, progress and costs in focus throughout the docking." },
  { n: "06", tag: "Inspection", title: "Marine Surveys & Inspections", text: "Vessel condition surveys, pre-purchase inspections and repair assessments, with clear findings to support maintenance, purchasing and operational decisions." },
];

export const STEPS = [
  { n: "01", title: "Understand the requirement", text: "Equipment details, technical specifications, drawings, maker references and delivery needs." },
  { n: "02", title: "Identify the right solution", text: "Review suitable options and coordinate sourcing, availability and service requirements." },
  { n: "03", title: "Coordinate the next move", text: "Keep the process clear from quotation and ordering to logistics or technical attendance." },
];

export const ENQUIRY_TYPES = [
  "Ship spares & equipment", "Technical services", "Electrical & electronic repairs", "China sourcing",
  "Logistics & coordination", "Docking agency & supervision", "Marine surveys & inspections",
];

export const TAGS = ["Merchant Shipping", "Ship Management", "Marine Engineering", "Technical Procurement", "Spare Parts"];

export const NAV_PAGES = [{ to: "/insights", label: "Insights" }] as const;

// ——— Illustrative mockup content (replace with approved real data) ———
export const TEAM = [
  { name: "Capt. Andrei Popescu", role: "Managing Director", bio: "Former Master Mariner, 18 years at sea on bulk carriers and tankers.", initials: "AP" },
  { name: "Li Wei", role: "Head of Sourcing", bio: "Ten years in marine procurement across Shanghai, Ningbo and Zhoushan.", initials: "LW" },
  { name: "Mihai Ionescu", role: "Chief Engineer & Surveyor", bio: "Former Chief Engineer, IIMS-accredited marine surveyor.", initials: "MI" },
  { name: "Zhang Min", role: "Docking & Logistics", bio: "Coordinates shipyard attendance, customs and delivery to vessel.", initials: "ZM" },
];

export const CASES = [
  { tag: "Spare parts", port: "Ningbo", title: "Main engine parts delivered in 48 hours", problem: "A bulk carrier needed cylinder-head components before departure.", action: "Sourced directly from the manufacturer, arranged inspection and launch delivery.", result: "Vessel sailed on schedule." },
  { tag: "Electrical repair", port: "Shanghai", title: "Crane control system restored", problem: "Recurring faults on a deck crane PLC during cargo operations.", action: "Fault diagnosis on board, replacement module and recommissioning.", result: "Cargo operations resumed the same day." },
  { tag: "Docking", port: "Zhoushan", title: "Dry-dock supervised to budget", problem: "Owner needed independent supervision of a 21-day docking.", action: "Daily progress reports, quality checks and cost control on site.", result: "Completed on time with no cost overrun." },
];

export const MAKERS = ["MAN Energy Solutions", "Wärtsilä", "Yanmar", "Daihatsu", "ABB", "Alfa Laval", "Hyundai HiMSEN", "Schneider Electric"];
export const CERTS = ["ISO 9001 (planned)", "IMPA member (planned)", "IIMS surveyor"];

// Ports positioned in % on the stylised map (x, y).
export const PORTS = [
  { name: "Dalian", x: 71, y: 22 },
  { name: "Tianjin", x: 62, y: 27 },
  { name: "Qingdao", x: 68, y: 36 },
  { name: "Shanghai", x: 76, y: 52, hq: true },
  { name: "Ningbo", x: 77, y: 58 },
  { name: "Zhoushan", x: 81, y: 56 },
  { name: "Xiamen", x: 70, y: 75 },
  { name: "Guangzhou", x: 58, y: 84 },
  { name: "Shenzhen", x: 61, y: 87 },
];

export const CLIENTS = [
  { name: "Aegean Bulk", port: "Qingdao", vessel: "Bulk carrier" },
  { name: "Nordic Tankers", port: "Ningbo", vessel: "Product tanker" },
  { name: "Danube Shipping", port: "Shanghai", vessel: "General cargo" },
  { name: "Pacific Reefers", port: "Xiamen", vessel: "Reefer" },
  { name: "Baltic Ship Mgmt", port: "Dalian", vessel: "Container" },
  { name: "Levant Marine", port: "Guangzhou", vessel: "Multipurpose" },
];

export const ARTICLES = [
  { slug: "preparing-dry-docking-in-china", title: "Preparing a dry-docking in China", date: "2026-10-14", read: "6 min",
    excerpt: "What owners and superintendents should settle before the vessel arrives at the yard.",
    body: ["Successful dockings are won before the vessel arrives. Agree the repair specification with the yard early and in writing, with clear item numbering that both sides use in every report.", "Plan owner's supply: long-lead spares, paints and class items should be confirmed and delivered to the yard before the dock date, not during it.", "Appoint on-site supervision with authority to approve or reject work daily. Daily progress and cost reports keep the scope from drifting.", "Finally, align class and flag surveys with the yard schedule so the vessel is not waiting on paperwork at the end."] },
  { slug: "sourcing-genuine-spares", title: "Genuine, OEM-equivalent or copy? Sourcing spares wisely", date: "2026-09-02", read: "5 min",
    excerpt: "How to balance price, lead time and risk when ordering engine spares from Chinese makers.",
    body: ["China manufactures a large share of the world's marine spares, from licensed OEM production to independent equivalents.", "Always start with the maker, model, serial and part number. Drawings and photos of the old part dramatically reduce errors.", "For critical components, ask for material certificates and an inspection before shipment. For consumables, a reliable equivalent may save cost without added risk.", "A local partner that speaks directly with the factory shortens the loop between question and answer."] },
  { slug: "what-a-pre-purchase-survey-covers", title: "What a pre-purchase survey really covers", date: "2026-07-21", read: "4 min",
    excerpt: "The checks that protect a buyer — and the limits of what a survey can tell you.",
    body: ["A pre-purchase inspection gives a buyer an independent view of the vessel's condition and maintenance standard.", "Typical scope covers hull and deck, machinery spaces, cargo gear, safety equipment, certificates and records.", "It is a visual, non-destructive inspection: it highlights risk areas and recommends further tests, rather than guaranteeing hidden condition.", "Clear findings with photos help the buyer negotiate and plan the first docking after delivery."] },
];
