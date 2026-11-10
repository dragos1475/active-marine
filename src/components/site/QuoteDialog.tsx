import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { X, ArrowUpRight } from "lucide-react";
import { CONTACT, ENQUIRY_TYPES } from "./content";

const field = "w-full border border-input bg-muted px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";
const label = "flex flex-col gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground";

export function QuoteDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [files, setFiles] = useState<string[]>([]);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    closeRef.current?.focus();
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; document.removeEventListener("keydown", onKey); };
  }, [open, onClose]);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const msg = `ACTIVMARINE — REQUEST FOR QUOTATION\n\nName: ${v["name"]}\nCompany: ${v["company"]}\nVessel: ${v["vessel"]}\nEmail: ${v["email"]}\nPhone: ${v["phone"]}\nType: ${v["type"]}\n\nRequirements:\n${v["details"]}\n\nDrawings (attach separately):\n${files.join("\n") || "None selected"}`;
    try {
      await navigator.clipboard.writeText(msg);
      setResult({ ok: true, text: `Enquiry text copied. Paste it into an email to ${CONTACT.email} and attach any selected drawings separately.` });
    } catch {
      setResult({ ok: false, text: msg });
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-abyss/85 p-4 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && onClose()}
          role="dialog" aria-modal="true" aria-labelledby="rfq-title"
        >
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.96 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto border border-border bg-popover p-8 shadow-deep md:p-10"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="eyebrow">Enquiry</p>
                <h2 id="rfq-title" className="mt-2 text-5xl uppercase">Request a Quote</h2>
              </div>
              <button ref={closeRef} onClick={onClose} aria-label="Close dialog" className="p-2 hover:text-primary"><X /></button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">This form prepares an enquiry you can copy and email to us; it does not send anything yet.</p>
            <form onSubmit={submit} className="mt-8 grid gap-5 md:grid-cols-2">
              <label className={label}>Name<input name="name" required placeholder="Your name" className={field} /></label>
              <label className={label}>Company<input name="company" required autoComplete="organization" placeholder="Company name" className={field} /></label>
              <label className={`${label} md:col-span-2`}>Vessel<input name="vessel" required placeholder="Vessel name" className={field} /></label>
              <label className={label}>Contact email<input name="email" type="email" required placeholder="name@company.com" className={field} /></label>
              <label className={label}>Phone number<input name="phone" type="tel" required autoComplete="tel" placeholder="Include country code" className={field} /></label>
              <label className={`${label} md:col-span-2`}>Enquiry type
                <select name="type" className={field}>{ENQUIRY_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
              </label>
              <label className={`${label} md:col-span-2`}>Requirements<textarea name="details" required rows={4} placeholder="Part number, model, description, quantities, destination..." className={field} /></label>
              <label className={`${label} md:col-span-2`}>Drawing(s)
                <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.tif,.tiff,.dwg,.dxf" onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))} className={field} />
                <span className="normal-case tracking-normal">PDF, images, DWG or DXF. Files stay on your device — attach them when you email the enquiry.</span>
              </label>
              {files.length > 0 && <ul className="list-disc pl-5 text-sm text-muted-foreground md:col-span-2">{files.map((f) => <li key={f}>{f}</li>)}</ul>}
              <button type="submit" className="group inline-flex items-center justify-center gap-3 bg-primary py-5 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:shadow-glow md:col-span-2">
                Copy Enquiry Text <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </button>
              {result && (
                <div className="border-l-2 border-primary bg-muted p-4 text-sm md:col-span-2" aria-live="polite">
                  {result.ok ? result.text : (<>Select and copy this enquiry text:<textarea readOnly value={result.text} rows={6} className={`${field} mt-2`} /></>)}
                </div>
              )}
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
