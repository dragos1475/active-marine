// Pure helpers behind the enquiry (RFQ) form: line items, pasting from a spreadsheet,
// IMO number check and the email text. Kept free of React so they can be unit tested.

export const ITEM_COLUMNS = [
  { key: "maker", label: "Maker", placeholder: "e.g. MAN B&W" },
  { key: "model", label: "Model / type", placeholder: "e.g. 6S50MC-C" },
  { key: "serial", label: "Serial no.", placeholder: "If known" },
  { key: "partNo", label: "Part no.", placeholder: "e.g. 90510-0123" },
  { key: "description", label: "Description", placeholder: "e.g. Fuel pump plunger and barrel" },
  { key: "qty", label: "Qty", placeholder: "1" },
] as const;

export type ItemKey = (typeof ITEM_COLUMNS)[number]["key"];
export type EnquiryItem = Record<ItemKey, string>;

export const MAX_ITEMS = 100;

export const emptyItem = (): EnquiryItem => ({ maker: "", model: "", serial: "", partNo: "", description: "", qty: "" });

export const hasContent = (item: EnquiryItem) => ITEM_COLUMNS.some((column) => item[column.key].trim() !== "");

/** Splits clipboard text copied from a spreadsheet into rows and cells; null when it is a single plain value. */
export function parsePastedCells(text: string): string[][] | null {
  const rows = text
    .replace(/\r\n?/g, "\n")
    .replace(/\n+$/, "")
    .split("\n")
    .map((row) => row.split("\t").map((cell) => cell.trim()));
  if (rows.length === 1 && (rows[0]?.length ?? 0) <= 1) return null;
  return rows;
}

/** Writes pasted cells into the item table starting at the given row and column, adding rows as needed. */
export function applyPaste(items: EnquiryItem[], rowIndex: number, colIndex: number, cells: string[][]): EnquiryItem[] {
  const next = items.map((item) => ({ ...item }));
  cells.forEach((cellRow, r) => {
    const target = rowIndex + r;
    if (target >= MAX_ITEMS) return;
    while (next.length <= target) next.push(emptyItem());
    const row = next[target];
    if (!row) return;
    cellRow.forEach((value, c) => {
      const column = ITEM_COLUMNS[colIndex + c];
      if (column) row[column.key] = value;
    });
  });
  return next;
}

/** IMO ship numbers are 7 digits; the last is a check digit over the first six. */
export function isValidImo(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 7) return false;
  const sum = [...digits.slice(0, 6)].reduce((total, digit, index) => total + Number(digit) * (7 - index), 0);
  return sum % 10 === Number(digits[6]);
}

const REFERENCE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

/** A short reference the client and the office can both quote, e.g. AM-261114-7K2Q. */
export function makeReference(now: Date = new Date(), random: () => number = Math.random): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const date = `${pad(now.getFullYear() % 100)}${pad(now.getMonth() + 1)}${pad(now.getDate())}`;
  const suffix = Array.from({ length: 4 }, () => REFERENCE_ALPHABET[Math.floor(random() * REFERENCE_ALPHABET.length)] ?? "A").join("");
  return `AM-${date}-${suffix}`;
}

export type EnquiryInput = {
  reference: string;
  urgent: boolean;
  type: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  vessel: string;
  imo: string;
  port: string;
  eta: string;
  requiredBy: string;
  /** The vessel's local agent at the port, as free text. */
  agent: string;
  details: string;
  items: EnquiryItem[];
  files: string[];
};

const line = (label: string, value: string) => (value.trim() ? `${label}: ${value.trim()}` : null);
const block = (title: string, lines: (string | null)[]) => {
  const kept = lines.filter((entry): entry is string => entry !== null);
  return kept.length ? `${title}\n${kept.join("\n")}` : null;
};

/** One numbered text line per filled item, naming only the columns that have a value. */
export function itemLines(items: EnquiryItem[]): string[] {
  return items.filter(hasContent).map((item, index) => {
    const parts = ITEM_COLUMNS.map((column) => line(column.label, item[column.key])).filter(Boolean);
    return `${index + 1}. ${parts.join(" | ")}`;
  });
}

/** Builds the email subject and body for an enquiry, leaving out anything the client left empty. */
export function buildEnquiry(input: EnquiryInput): { subject: string; body: string } {
  const imo = input.imo.replace(/\D/g, "");
  const vessel = input.vessel.trim();
  const port = input.port.trim();
  const subject = [
    `${input.urgent ? "URGENT " : ""}Enquiry ${input.reference}`,
    vessel ? `${vessel}${imo ? ` (IMO ${imo})` : ""}` : null,
    port || null,
  ]
    .filter(Boolean)
    .join(" — ");

  const items = itemLines(input.items);

  const body = [
    [
      "ACTIV MARINE LIMITED — ENQUIRY",
      `Reference: ${input.reference}`,
      input.urgent ? "*** URGENT — vessel waiting or at risk of delay ***" : null,
      line("Type", input.type),
    ]
      .filter(Boolean)
      .join("\n"),
    block("CONTACT", [line("Name", input.name), line("Company", input.company), line("Email", input.email), line("Phone", input.phone)]),
    block("VESSEL & DELIVERY", [
      line("Vessel", vessel),
      line("IMO", imo),
      line("Port", port),
      line("ETA", input.eta),
      line("Required by", input.requiredBy),
      line("Local agent", input.agent),
    ]),
    items.length ? `ITEMS\n${items.join("\n")}` : null,
    input.details.trim() ? `REQUIREMENTS\n${input.details.trim()}` : null,
    input.files.length ? `DRAWINGS & PHOTOS (attached separately)\n${input.files.join("\n")}` : null,
  ]
    .filter(Boolean)
    .join("\n\n");

  return { subject, body };
}

// Long bodies are cut off by some email apps when passed in a mailto link, so past this size
// the link carries a short note and the full text travels through the clipboard instead.
const MAILTO_BODY_LIMIT = 1600;

export const fitsInMailto = (body: string) => encodeURIComponent(body).length <= MAILTO_BODY_LIMIT;

export function mailtoHref(email: string, enquiry: { subject: string; body: string }, reference: string): string {
  const body = fitsInMailto(enquiry.body) ? enquiry.body : `(Paste the copied enquiry text here.)\n\nReference: ${reference}`;
  return `mailto:${email}?subject=${encodeURIComponent(enquiry.subject)}&body=${encodeURIComponent(body)}`;
}

// ——— Draft kept in the visitor's browser, so a dropped connection does not lose the enquiry ———

export const FIELD_KEYS = ["vessel", "imo", "port", "type", "eta", "requiredBy", "agent", "details", "name", "company", "email", "phone"] as const;
export type FieldKey = (typeof FIELD_KEYS)[number];
export type EnquiryFields = Record<FieldKey, string> & { urgent: boolean };
export type EnquiryDraft = { fields: EnquiryFields; items: EnquiryItem[] };

/** Details that stay the same from one enquiry to the next. */
export const PROFILE_KEYS = ["vessel", "imo", "name", "company", "email", "phone"] as const satisfies readonly FieldKey[];

export const DRAFT_STORAGE_KEY = "am-enquiry-draft";

export const emptyFields = (): EnquiryFields => ({ vessel: "", imo: "", port: "", type: "", eta: "", requiredBy: "", agent: "", details: "", name: "", company: "", email: "", phone: "", urgent: false });

const asText = (value: unknown) => (typeof value === "string" ? value : "");

/** Reads a stored draft, ignoring anything that is not the expected shape. */
export function parseDraft(raw: string | null): EnquiryDraft | null {
  if (!raw) return null;
  try {
    const data: unknown = JSON.parse(raw);
    if (typeof data !== "object" || data === null) return null;
    const { fields, items } = data as { fields?: Record<string, unknown>; items?: unknown };
    if (typeof fields !== "object" || fields === null) return null;
    const cleanFields = emptyFields();
    for (const key of FIELD_KEYS) cleanFields[key] = asText(fields[key]);
    cleanFields.urgent = fields["urgent"] === true;
    const cleanItems = (Array.isArray(items) ? items : [])
      .slice(0, MAX_ITEMS)
      .map((entry: unknown) => {
        const source = typeof entry === "object" && entry !== null ? (entry as Record<string, unknown>) : {};
        const item = emptyItem();
        for (const column of ITEM_COLUMNS) item[column.key] = asText(source[column.key]);
        return item;
      });
    return { fields: cleanFields, items: cleanItems.length ? cleanItems : [emptyItem()] };
  } catch {
    return null;
  }
}

/**
 * Carries the local agent's details from the homepage box into the form's draft. They can name a
 * person, so they travel through browser storage and never appear in the page address.
 */
export function stashAgent(agent: string, storage: Pick<Storage, "getItem" | "setItem">): void {
  if (!agent.trim()) return;
  const draft = parseDraft(storage.getItem(DRAFT_STORAGE_KEY)) ?? { fields: emptyFields(), items: [emptyItem()] };
  storage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ ...draft, fields: { ...draft.fields, agent: agent.trim() } }));
}

/** Starts the next enquiry: keeps who is asking and for which vessel, clears what was asked. */
export function nextEnquiry(fields: EnquiryFields): EnquiryDraft {
  const fresh = emptyFields();
  for (const key of PROFILE_KEYS) fresh[key] = fields[key];
  return { fields: fresh, items: [emptyItem()] };
}

// ——— What happens after the email is sent ———

const HOUR_MS = 60 * 60 * 1000;

/** Latest times for the two commitments in the FAQ, counted from when the enquiry email is sent. */
export function responseTimes(sentAt: Date): { acknowledgeBy: Date; indicationBy: Date } {
  return { acknowledgeBy: new Date(sentAt.getTime() + 2 * HOUR_MS), indicationBy: new Date(sentAt.getTime() + 48 * HOUR_MS) };
}

/** e.g. "Sat 14:35" in the visitor's own time zone, or in the given one. */
export function formatWhen(date: Date, timeZone?: string): string {
  return new Intl.DateTimeFormat("en-GB", { weekday: "short", hour: "2-digit", minute: "2-digit", ...(timeZone ? { timeZone } : {}) }).format(date);
}

// ——— Live preview: what is still missing, and dates that look wrong ———

/** Details the office usually has to ask for next. None of them stops the enquiry from being sent. */
export function enquiryGaps(fields: EnquiryFields, items: EnquiryItem[]): string[] {
  const gaps: string[] = [];
  if (!items.some(hasContent) && !fields.details.trim()) gaps.push("No items or description yet");
  if (!fields.port.trim()) gaps.push("No port or yard");
  if (!fields.eta) gaps.push("No vessel ETA");
  if (!fields.requiredBy) gaps.push("No required-by date");
  if (!fields.imo.trim()) gaps.push("No IMO number");
  return gaps;
}

/** Dates already behind us are almost always a slip of the date picker. `today` is YYYY-MM-DD. */
export function dateWarnings(fields: Pick<EnquiryFields, "eta" | "requiredBy">, today: string): string[] {
  const warnings: string[] = [];
  if (fields.eta && fields.eta < today) warnings.push("The vessel ETA is in the past.");
  if (fields.requiredBy && fields.requiredBy < today) warnings.push("The required-by date is in the past.");
  return warnings;
}

/** Local calendar date as YYYY-MM-DD, the format date inputs use. */
export function localDate(now: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

// ——— Sending through Netlify Forms ———
// Only the Netlify build turns this on (VITE_ENQUIRY_DELIVERY in netlify.toml). Everywhere else the
// form keeps preparing an email, because no other host has a form service behind it.

export type Delivery = "email" | "netlify";
export const ENQUIRY_DELIVERY: Delivery = import.meta.env["VITE_ENQUIRY_DELIVERY"] === "netlify-forms" ? "netlify" : "email";

export const ENQUIRY_FORM_NAME = "enquiry";
/** Static page that declares the form to Netlify, which reads plain HTML at deploy time. Submissions are posted to it. */
export const ENQUIRY_FORM_PATH = "/__forms.html";
/** Every field sent, as declared in public/__forms.html. A test keeps the two in step. */
export const ENQUIRY_FORM_FIELDS = ["subject", "reference", "urgent", "type", "vessel", "imo", "port", "eta", "requiredBy", "agent", "items", "details", "name", "company", "email", "phone", "message"] as const;

/** The enquiry as form fields: each detail on its own for the dashboard, plus the full text in `message`. */
export function netlifyFormBody(input: EnquiryInput, botField = ""): URLSearchParams {
  const enquiry = buildEnquiry(input);
  const values: Record<(typeof ENQUIRY_FORM_FIELDS)[number], string> = {
    subject: enquiry.subject,
    reference: input.reference,
    urgent: input.urgent ? "yes" : "no",
    type: input.type,
    vessel: input.vessel.trim(),
    imo: input.imo.replace(/\D/g, ""),
    port: input.port.trim(),
    eta: input.eta,
    requiredBy: input.requiredBy,
    agent: input.agent.trim(),
    items: itemLines(input.items).join("\n"),
    details: input.details.trim(),
    name: input.name.trim(),
    company: input.company.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    message: enquiry.body,
  };
  const body = new URLSearchParams({ "form-name": ENQUIRY_FORM_NAME, "bot-field": botField });
  for (const field of ENQUIRY_FORM_FIELDS) body.set(field, values[field]);
  return body;
}

/** Present in public/__forms.html only. Seeing it in a reply means the page was served back, not a submission accepted. */
export const ENQUIRY_FORM_MARKER = "form-declaration";

/**
 * Posts the enquiry to Netlify Forms. True only when the service accepted it; never throws.
 * A host without the form service (a dev server, a deploy where form detection is off) can answer
 * the same POST with 200 and the declaration page itself. That is not a delivery, so it counts as failure.
 */
export async function sendEnquiry(body: URLSearchParams, send: typeof fetch = fetch): Promise<boolean> {
  try {
    const response = await send(ENQUIRY_FORM_PATH, { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: body.toString() });
    if (!response.ok) return false;
    return !(await response.text()).includes(ENQUIRY_FORM_MARKER);
  } catch {
    return false;
  }
}
