// ask: how a client would phrase the need; enquiry: the matching entry in ENQUIRY_TYPES;
// need: what the client should send so the first reply can be a useful one.
type Svc = { n: string; slug: string; tag: string; title: string; text: string; points: string[]; ask: string; enquiry: string; need: string[] };
// Confirmed by the company on 2026-11-25. No WhatsApp number was supplied, so none is shown.
export const CONTACT = {
  email: "enquiry@activ-marine.com",
  phone: "+86 166 2120 4292",
  wechat: "ActivMarine",
  company: "Activ Marine Limited",
  address: ["2nd Floor, No. 25-1 Hongcao Road", "Xuhui District, Shanghai", "PR China"],
};

/** The phone number as a tel: link target. */
export const CONTACT_TEL = `tel:${CONTACT.phone.replace(/[^+\d]/g, "")}`;

// The header carries the five destinations a client needs; FAQ and Insights are reached from the footer.
export const HEADER_NAV = [
  { to: "/services", label: "Services" },
  { to: "/network", label: "Network" },
  { to: "/cases", label: "Projects" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export const NAV = [
  ...HEADER_NAV,
  { to: "/insights", label: "Insights" },
  { to: "/faq", label: "FAQ" },
] as const;

export const SERVICES: readonly [Svc, Svc, Svc, Svc, Svc, Svc] = [
  { n: "01", slug: "ship-spares", tag: "Supply", title: "Ship Spares & Equipment", text: "Machinery parts, deck equipment, consumables and technical supplies for day-to-day operations.", points: ["Engine, pump and compressor spares", "Deck and mooring equipment", "Consumables and safety items", "Genuine, OEM and quality alternatives"], ask: "I need a part or equipment", enquiry: "Ship spares & equipment", need: ["Maker, model and serial number of the equipment", "Part numbers, or a marked-up drawing or manual page", "Quantities, delivery port and vessel ETA", "Photos of the nameplate or the old part, if available"] },
  { n: "02", slug: "technical-services", tag: "Service", title: "Technical Services", text: "Engineering support, troubleshooting and repairs for propulsion engines, generators, cranes, engine and deck machinery, piping and steel work. Electrical and electronic repairs, including control systems, automation and fault diagnosis.", points: ["Main and auxiliary engine overhauls", "Crane and deck machinery repairs", "Piping and steel work", "Electrical, automation and PLC fault diagnosis"], ask: "Something has broken down", enquiry: "Technical services", need: ["Equipment maker and model", "Fault description, alarms and what has already been tried", "Photos, logs or drawings", "Port, ETA and the time available alongside or at anchorage"] },
  { n: "03", slug: "china-sourcing", tag: "Sourcing", title: "China Sourcing & Procurement", text: "Direct contact with manufacturers in China, connecting your technical requirements with suitable products, competitive quotations and coordinated delivery.", points: ["Direct access to Chinese manufacturers", "Technical matching to drawings and maker references", "Competitive, transparent quotations", "Pre-shipment inspection"], ask: "I want to buy direct from Chinese makers", enquiry: "China sourcing", need: ["Technical specification, drawings or maker references", "Quantities and target delivery date", "Any class, certificate or material requirements", "Destination: vessel, port or warehouse"] },
  { n: "04", slug: "logistics", tag: "Delivery", title: "Logistics & Coordination", text: "Shipment planning and communication to bring marine requirements closer to the vessel.", points: ["Consolidation in Shanghai", "Customs clearance coordination", "Launch and truck delivery to vessel", "Live status updates to superintendents"], ask: "I need it delivered to the vessel", enquiry: "Logistics & coordination", need: ["What is being shipped: weights, dimensions and origin", "Vessel name, port and ETA", "Contact details of the local agent", "Customs status, for example ship's spares in transit"] },
  { n: "05", slug: "docking-supervision", tag: "Docking", title: "Docking Agency & Supervision", text: "Shipyard coordination, docking agency support and on-site repair supervision, keeping scope, quality, progress and costs in focus throughout the docking.", points: ["Yard selection and specification review", "Docking agency on site", "Daily progress and cost reports", "Quality checks and sign-off"], ask: "The vessel is going into dock", enquiry: "Docking agency & supervision", need: ["Repair specification or work list", "Vessel particulars and class status", "Planned docking window and any preferred yards", "Budget and reporting expectations"] },
  { n: "06", slug: "marine-surveys", tag: "Inspection", title: "Marine Surveys & Inspections", text: "Vessel condition surveys, pre-purchase inspections and repair assessments, with clear findings to support maintenance, purchasing and operational decisions.", points: ["Condition and pre-purchase surveys", "Damage and repair assessments", "On/off-hire surveys", "Clear photo-documented reports"], ask: "I need a survey or inspection", enquiry: "Marine surveys & inspections", need: ["Type of survey and its purpose", "Vessel particulars and current location", "Preferred dates and access arrangements", "Reports, certificates or records already available"] },
];

// Shown on the ship spares page. General guidance, in line with the FAQ ("always stating clearly
// which one you are getting") and the sourcing article — wording to be confirmed by the company.
export const SPARE_TYPES = [
  {
    name: "Genuine",
    what: "Supplied through the equipment maker's own channel, under the maker's part number.",
    chosenFor: "Critical components, and equipment under maker warranty or close class attention.",
    askFor: "The maker's own packing and documentation.",
  },
  {
    name: "OEM",
    what: "Made by the manufacturer that produces the part for the maker, sold outside the maker's channel.",
    chosenFor: "The same specification where the maker's branding is not required.",
    askFor: "The manufacturer's identification and material certificates.",
  },
  {
    name: "Quality alternative",
    what: "An independent equivalent made to the same dimensions and specification.",
    chosenFor: "Consumables and non-critical items, where a reliable equivalent can save cost.",
    askFor: "Drawings, photos or a sample for matching, and an inspection before shipment.",
  },
] as const;

export const STEPS = [
  { n: "01", title: "Understand the requirement", text: "Equipment details, technical specifications, drawings, maker references and delivery needs." },
  { n: "02", title: "Identify the right solution", text: "Review suitable options and coordinate sourcing, availability and service requirements." },
  { n: "03", title: "Coordinate the next move", text: "Keep the process clear from quotation and ordering to logistics or technical attendance." },
];

export const ENQUIRY_TYPES = [
  "Ship spares & equipment", "Technical services", "Electrical & electronic repairs", "China sourcing",
  "Logistics & coordination", "Docking agency & supervision", "Marine surveys & inspections",
];

// Homepage hero facts. Each one restates a commitment already made in FAQ below — keep them in step.
export const HERO_FACTS = [
  { value: "2 h", label: "Enquiries acknowledged" },
  { value: "48 h", label: "Target for availability & pricing" },
  { value: "All ports", label: "China, including Hong Kong" },
] as const;

export const TAGS = ["Merchant Shipping", "Ship Management", "Marine Engineering", "Technical Procurement", "Spare Parts"];


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

// Ports positioned in % on the stylised map (x, y). lat/lon are approximate port approaches, used
// only to ask for the wind forecast there (4 decimals at most: the weather service rejects more).
export const PORTS = [
  { name: "Dalian", x: 73, y: 19, lat: 38.92, lon: 121.65 },
  { name: "Tianjin", x: 61, y: 26, lat: 38.98, lon: 117.78 },
  { name: "Qingdao", x: 68, y: 38, lat: 36.05, lon: 120.32 },
  { name: "Shanghai", x: 74, y: 52, hq: true, lat: 31.35, lon: 121.65 },
  { name: "Ningbo", x: 75, y: 57, lat: 29.93, lon: 121.85 },
  { name: "Zhoushan", x: 79, y: 55, lat: 30.0, lon: 122.1 },
  { name: "Xiamen", x: 68, y: 75, lat: 24.45, lon: 118.07 },
  { name: "Guangzhou", x: 56, y: 84, lat: 22.75, lon: 113.6 },
  { name: "Shenzhen", x: 59, y: 87, lat: 22.57, lon: 114.27 },
  { name: "Hong Kong", x: 61, y: 91, lat: 22.3, lon: 114.17 },
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

export const STATS = [
  { value: 18, suffix: "+", label: "Years at sea & ashore" },
  { value: 240, suffix: "+", label: "Vessels supported" },
  { value: 12, suffix: "", label: "Chinese ports covered" },
  { value: 2, suffix: "h", label: "Typical first response" },
];

export const TIMELINE = [
  { t: "00:00", title: "Urgent call received", text: "Chief Engineer reports a failed fuel pump on a bulk carrier due at Ningbo." },
  { t: "00:45", title: "Requirement confirmed", text: "Maker reference, drawings and photos reviewed with the superintendent." },
  { t: "03:00", title: "Part located", text: "Matching unit sourced directly from a manufacturer near Shanghai." },
  { t: "20:00", title: "Inspected & cleared", text: "Pre-shipment check, paperwork and customs coordinated." },
  { t: "36:00", title: "Delivered on board", text: "Launch delivery at anchorage; engineer attends fitting and testing." },
];

export const TESTIMONIALS = [
  { quote: "They understood the problem before we finished explaining it. Parts were alongside the next morning.", name: "Technical Superintendent", org: "European bulk operator" },
  { quote: "Independent, honest docking supervision. The final invoice matched the plan.", name: "Fleet Manager", org: "Ship management company, Cyprus" },
  { quote: "Finally a Shanghai partner who speaks engineer and speaks Chinese.", name: "Chief Engineer", org: "Tanker fleet, Greece" },
];

export const FAQ = [
  { q: "Which ports do you cover?", a: "All Chinese ports including Hong Kong" },
  { q: "Do you supply genuine maker parts?", a: "Yes. We supply genuine, OEM and quality alternatives, always stating clearly which one you are getting." },
  { q: "How fast can you respond?", a: "We acknowledge all enquiries within 2 hours, while trying our best to have you an indication on availability and pricing within 48 hours." },
  { q: "How are customs and delivery handled?", a: "We coordinate customs clearance, ship's spares in transit and final delivery to the vessel with the local agent." },
  { q: "What payment terms do you offer?", a: "Bank transfer in USD, EUR or CNY. Credit terms are available for established clients." },
  { q: "Is there a warranty?", a: "Parts carry the manufacturer's warranty; our repair work is covered by our own workmanship guarantee." },
];
