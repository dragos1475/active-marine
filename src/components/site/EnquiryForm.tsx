import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Check, CircleAlert, Copy, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT, ENQUIRY_TYPES, PORTS } from "./content";
import {
  DRAFT_STORAGE_KEY, ITEM_COLUMNS, MAX_ITEMS, applyPaste, buildEnquiry, dateWarnings, emptyFields, emptyItem, enquiryGaps, fitsInMailto, formatWhen, hasContent, isValidImo,
  localDate, mailtoHref, makeReference, nextEnquiry, parseDraft, parsePastedCells, responseTimes, type EnquiryFields, type EnquiryItem, type FieldKey, type ItemKey,
} from "@/lib/enquiry";

const field = "w-full border border-input bg-muted px-4 py-3 text-base font-normal tracking-normal text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";
const cell = "w-full border border-input bg-muted px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary";
const label = "flex flex-col gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground";
const legend = "mb-5 w-full border-t border-border pt-5 text-xs font-semibold uppercase tracking-[0.25em] text-primary";
const hint = "text-sm font-normal normal-case tracking-normal text-muted-foreground";
const itemGrid = "grid grid-cols-2 gap-2 md:grid-cols-[1fr_1fr_0.8fr_1fr_1.6fr_4.5rem_2.5rem]";
const textLink = "text-sm text-primary underline underline-offset-4 hover:text-foreground";

type Result = { reference: string; subject: string; text: string; copied: boolean; emailed: boolean; fits: boolean; preparedAt: Date };
type Start = { part?: string; type?: string; port?: string; eta?: string };

function resultMessage(result: Result): string {
  const attach = "attach any drawings, then send";
  if (result.emailed && result.fits) {
    return `Your email app should open with the enquiry addressed to ${CONTACT.email}: ${attach}. If it does not open, use the text below.`;
  }
  const source = result.copied ? "paste the copied text" : "your browser blocked copying, so select the text below and paste it";
  if (result.emailed) {
    return `Your email app should open addressed to ${CONTACT.email}. The enquiry is too long for the link: ${source} into the email, ${attach}.`;
  }
  return result.copied
    ? `Enquiry text copied. Paste it into an email to ${CONTACT.email}, ${attach}.`
    : `Your browser blocked copying. Select the text below, paste it into an email to ${CONTACT.email}, ${attach}.`;
}

const knownType = (type: string | undefined) => (type && ENQUIRY_TYPES.includes(type) ? type : "");

/** Applies what the visitor chose on the way here (situation, port, date, part) on top of the form. */
function withStart(fields: EnquiryFields, items: EnquiryItem[], start: Start): { fields: EnquiryFields; items: EnquiryItem[] } {
  const next = { ...fields, type: knownType(start.type) || knownType(fields.type) || (ENQUIRY_TYPES[0] ?? ""), port: start.port || fields.port, eta: start.eta || fields.eta };
  const part = start.part?.trim();
  if (!part || items.some((item) => item.description === part)) return { fields: next, items };
  const free = items.findIndex((item) => !hasContent(item));
  const withPart = free === -1 ? [...items, { ...emptyItem(), description: part }] : items.map((item, index) => (index === free ? { ...item, description: part } : item));
  return { fields: next, items: withPart };
}

function WhatHappensNext({ result }: { result: Result }) {
  const { acknowledgeBy, indicationBy } = responseTimes(result.preparedAt);
  const steps = [
    { when: "Now", text: `Send the email from your own email app. Quote reference ${result.reference} if you call or write again.` },
    { when: "Within 2 hours", text: `We acknowledge the enquiry. If you send it now, that is by ${formatWhen(acknowledgeBy)} your time (${formatWhen(acknowledgeBy, "Asia/Shanghai")} in China).` },
    { when: "Within 48 hours, as a target", text: `We aim to give you an indication on availability and pricing. If you send it now, that is by ${formatWhen(indicationBy)} your time.` },
  ];
  return (
    <div className="mt-5 border-t border-border pt-4">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-primary">What happens next</p>
      <ol className="mt-3 grid gap-3">
        {steps.map((step, index) => (
          <li key={step.when} className="grid grid-cols-[1.5rem_1fr] gap-x-3">
            <span className="font-display text-lg leading-none text-mustard">{index + 1}</span>
            <span><span className="block font-semibold text-foreground">{step.when}</span><span className="block text-muted-foreground">{step.text}</span></span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function EnquiryForm({ part = "", type = "", port = "", eta = "" }: Start) {
  const [state, setState] = useState(() => withStart(emptyFields(), [emptyItem()], { part, type, port, eta }));
  const [files, setFiles] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Result | null>(null);
  const [restored, setRestored] = useState(false);
  const [saved, setSaved] = useState(false);
  const action = useRef<"email" | "copy">("email");
  // Reference and today's date are only known in the browser, so they are set after hydration.
  const [reference, setReference] = useState("");
  const [today, setToday] = useState("");
  const { fields, items } = state;

  // The draft lives in this browser only: restore it once after hydration, then keep it up to date.
  useEffect(() => {
    let draft = null;
    try {
      draft = parseDraft(localStorage.getItem(DRAFT_STORAGE_KEY));
    } catch {
      // Storage can be unavailable (private mode); the form still works without a draft.
    }
    if (draft) setState(withStart(draft.fields, draft.items, { part, type, port, eta }));
    setReference(makeReference());
    setToday(localDate(new Date()));
    setRestored(true);
    // Start values are read once, when the page opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    if (!restored) return;
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(state));
      setSaved(true);
    } catch {
      setSaved(false);
    }
  }, [restored, state]);

  const setField = (key: FieldKey) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = event.target.value;
    setState((current) => ({ ...current, fields: { ...current.fields, [key]: value } }));
  };
  const setItems = (update: (current: EnquiryItem[]) => EnquiryItem[]) => setState((current) => ({ ...current, items: update(current.items) }));
  const setCell = (row: number, key: ItemKey, value: string) => setItems((current) => current.map((item, index) => (index === row ? { ...item, [key]: value } : item)));
  const paste = (row: number, col: number) => (event: React.ClipboardEvent<HTMLInputElement>) => {
    const cells = parsePastedCells(event.clipboardData.getData("text"));
    if (!cells) return;
    event.preventDefault();
    setItems((current) => applyPaste(current, row, col, cells));
  };
  const removeItem = (row: number) => setItems((current) => (current.length > 1 ? current.filter((_, index) => index !== row) : [emptyItem()]));

  const reset = (next: (current: EnquiryFields) => EnquiryFields) => {
    setState((current) => withStart(next(current.fields), [emptyItem()], {}));
    setFiles([]);
    setResult(null);
    setError("");
    setReference(makeReference());
  };
  const startNext = () => reset((current) => nextEnquiry(current).fields);
  const forget = () => reset(() => emptyFields());

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.some(hasContent) && !fields.details.trim()) {
      setError("Add at least one item or describe what the vessel needs.");
      setResult(null);
      return;
    }
    setError("");
    const enquiry = buildEnquiry({ ...fields, reference, items, files });
    let copied = true;
    try {
      await navigator.clipboard.writeText(enquiry.body);
    } catch {
      copied = false;
    }
    const emailed = action.current === "email";
    if (emailed) window.location.href = mailtoHref(CONTACT.email, enquiry, reference);
    setResult({ reference, subject: enquiry.subject, text: enquiry.body, copied, emailed, fits: fitsInMailto(enquiry.body), preparedAt: new Date() });
  }

  const filled = items.filter(hasContent).length;
  const imoWarning = fields.imo.trim() !== "" && !isValidImo(fields.imo);
  const preview = buildEnquiry({ ...fields, reference, items, files });
  const gaps = enquiryGaps(fields, items);
  const dateIssues = today ? dateWarnings(fields, today) : [];

  return (
    <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="flex min-w-0 flex-col gap-10">
      <fieldset className="grid gap-5 md:grid-cols-2">
        <legend className={legend}>01 · Vessel &amp; delivery</legend>
        <label className={label}>Vessel<input name="vessel" value={fields.vessel} onChange={setField("vessel")} required placeholder="Vessel name" className={field} /></label>
        <label className={label}>IMO number
          <input name="imo" value={fields.imo} onChange={setField("imo")} inputMode="numeric" placeholder="7 digits, optional" aria-describedby={imoWarning ? "imo-warning" : undefined} className={field} />
          {imoWarning && <span id="imo-warning" role="status" className="text-sm font-normal normal-case tracking-normal text-burgundy">This does not look like a valid IMO number. Please check it; you can still send the enquiry.</span>}
        </label>
        <label className={label}>Port or yard in China
          <input name="port" value={fields.port} onChange={setField("port")} list="enquiry-ports" placeholder="Where the vessel will be" className={field} />
          <datalist id="enquiry-ports">{PORTS.map((p) => <option key={p.name} value={p.name} />)}</datalist>
        </label>
        <label className={label}>Enquiry type
          <select name="type" value={fields.type} onChange={setField("type")} className={field}>{ENQUIRY_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
        </label>
        <label className={label}>Vessel ETA<input name="eta" type="date" value={fields.eta} onChange={setField("eta")} className={field} /></label>
        <label className={label}>Required by<input name="requiredBy" type="date" value={fields.requiredBy} onChange={setField("requiredBy")} className={field} /></label>
        {dateIssues.length > 0 && <p role="status" className="text-sm text-burgundy md:col-span-2">{dateIssues.join(" ")} Please check; you can still send the enquiry.</p>}
        <label className="flex cursor-pointer items-start gap-3 border border-input bg-muted px-4 py-3 md:col-span-2">
          <input name="urgent" type="checkbox" checked={fields.urgent} onChange={(e) => { const urgent = e.target.checked; setState((current) => ({ ...current, fields: { ...current.fields, urgent } })); }} className="mt-1 h-4 w-4 accent-[var(--burgundy)]" />
          <span><span className="block text-sm font-semibold text-foreground">Urgent</span><span className="block text-sm text-muted-foreground">The vessel is waiting or at risk of delay. The email subject is marked URGENT.</span></span>
        </label>
      </fieldset>

      <fieldset>
        <legend className={legend}>02 · Items</legend>
        <p className={hint}>One line per part or piece of equipment. Paste rows straight from Excel into any cell: columns fill from where you paste.</p>
        <div className={`${itemGrid} mt-5 hidden text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground md:grid`} aria-hidden="true">
          {ITEM_COLUMNS.map((column) => <span key={column.key}>{column.label}</span>)}
        </div>
        <div className="mt-2 flex flex-col gap-3 md:gap-2">
          {items.map((item, row) => (
            <div key={row} role="group" aria-label={`Item ${row + 1}`} className={`${itemGrid} border border-border p-3 md:border-0 md:p-0`}>
              {ITEM_COLUMNS.map((column, col) => (
                <label key={column.key} className={`flex flex-col gap-1 ${column.key === "description" ? "col-span-2 md:col-span-1" : ""}`}>
                  <span className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground md:sr-only">{column.label}</span>
                  <input value={item[column.key]} onChange={(e) => setCell(row, column.key, e.target.value)} onPaste={paste(row, col)} placeholder={row === 0 ? column.placeholder : undefined} inputMode={column.key === "qty" ? "numeric" : undefined} className={cell} />
                </label>
              ))}
              <button type="button" onClick={() => removeItem(row)} aria-label={`Remove item ${row + 1}`} className="flex h-[2.4rem] items-center justify-center self-end border border-input text-muted-foreground transition-colors hover:border-burgundy hover:text-burgundy">
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <Button type="button" variant="outline" disabled={items.length >= MAX_ITEMS} onClick={() => setItems((current) => [...current, emptyItem()])} className="h-auto rounded-none px-5 py-3 text-xs font-bold uppercase tracking-[0.2em]">
            <Plus className="h-4 w-4" /> Add item
          </Button>
          <span className="text-sm text-muted-foreground" aria-live="polite">{filled} {filled === 1 ? "item" : "items"} filled in</span>
        </div>
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className={legend}>03 · Details &amp; drawings</legend>
        <label className={label}>Requirements
          <textarea name="details" value={fields.details} onChange={setField("details")} rows={5} placeholder="Fault description, scope of work, delivery instructions, anything else we should know..." className={field} />
        </label>
        <label className={label}>Drawings &amp; photos
          <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.tif,.tiff,.dwg,.dxf,.xls,.xlsx" onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))} className={field} />
          <span className={hint}>Nameplate photos, drawings, PDF, DWG, DXF or Excel lists. Files stay on your device: attach them to the email yourself.</span>
        </label>
        {files.length > 0 && <ul className="list-disc pl-5 text-sm text-muted-foreground">{files.map((f) => <li key={f}>{f}</li>)}</ul>}
      </fieldset>

      <fieldset className="grid gap-5 md:grid-cols-2">
        <legend className={legend}>04 · Your contact</legend>
        <label className={label}>Name<input name="name" value={fields.name} onChange={setField("name")} required autoComplete="name" placeholder="Your name" className={field} /></label>
        <label className={label}>Company<input name="company" value={fields.company} onChange={setField("company")} required autoComplete="organization" placeholder="Company name" className={field} /></label>
        <label className={label}>Contact email<input name="email" type="email" value={fields.email} onChange={setField("email")} required autoComplete="email" placeholder="name@company.com" className={field} /></label>
        <label className={label}>Phone number<input name="phone" type="tel" value={fields.phone} onChange={setField("phone")} required autoComplete="tel" placeholder="Include country code" className={field} /></label>
      </fieldset>

      <div className="flex flex-col gap-3">
        {error && <p role="alert" className="border-l-2 border-burgundy bg-muted p-4 text-sm text-foreground">{error}</p>}
        <div className="grid gap-3 md:grid-cols-[2fr_1fr]">
          <Button type="submit" onClick={() => { action.current = "email"; }} className="group h-auto rounded-none py-5 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:shadow-glow">
            Open in Email <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
          </Button>
          <Button type="submit" variant="outline" onClick={() => { action.current = "copy"; }} className="h-auto rounded-none py-5 text-xs font-bold uppercase tracking-[0.2em]">
            Copy Text <Copy className="h-4 w-4" />
          </Button>
        </div>
        {saved && (
          <p className="text-sm text-muted-foreground">
            Draft saved in this browser only, so you can finish later or reuse your details next time.{" "}
            <button type="button" onClick={forget} className={textLink}>Clear the form and forget my details</button>
          </p>
        )}
        {result && (
          <div className="border-l-2 border-primary bg-muted p-4 text-sm" aria-live="polite">
            <p className="font-semibold text-foreground">Reference {result.reference}</p>
            <p className="mt-2 text-muted-foreground">{resultMessage(result)}</p>
            <WhatHappensNext result={result} />
            <label className={`${label} mt-5`}>Enquiry text
              <textarea readOnly value={`Subject: ${result.subject}\n\n${result.text}`} rows={8} className={`${field} font-mono text-xs normal-case tracking-normal`} />
            </label>
            <button type="button" onClick={startNext} className={`${textLink} mt-4`}>Start another enquiry for the same vessel</button>
          </div>
        )}
      </div>
      </div>

      {/* Desktop only: the email exactly as it will be prepared, updated while the visitor types. */}
      <aside aria-label="Enquiry preview" className="hidden lg:block">
        <div className="sticky top-36 border border-border bg-card p-6">
          <p className="eyebrow">Your enquiry so far</p>
          {gaps.length > 0 ? (
            <ul className="mt-5 grid gap-2 text-sm">
              {gaps.map((gap) => <li key={gap} className="flex items-start gap-2 text-muted-foreground"><CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-mustard" />{gap}</li>)}
            </ul>
          ) : (
            <p className="mt-5 flex items-start gap-2 text-sm text-foreground"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />Everything we usually ask for is here.</p>
          )}
          {gaps.length > 0 && <p className="mt-3 text-xs text-muted-foreground">None of these is required. Each one saves a round of questions.</p>}
          <p className="mt-6 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Subject</p>
          <p className="mt-2 break-words text-sm font-semibold text-foreground">{preview.subject}</p>
          <p className="mt-5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Email text</p>
          <pre className="mt-2 max-h-[22rem] overflow-auto whitespace-pre-wrap break-words border border-border bg-muted p-3 font-mono text-xs leading-relaxed text-foreground">{preview.body}</pre>
        </div>
      </aside>
    </form>
  );
}
