import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT, ENQUIRY_TYPES } from "./content";

const field = "w-full border border-input bg-muted px-4 py-3 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary";
const label = "flex flex-col gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground";

export function EnquiryForm({ part = "" }: { part?: string }) {
  const [files, setFiles] = useState<string[]>([]);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget).entries());
    const text = `ACTIV MARINE LIMITED — ENQUIRY\n\nName: ${values['name']}\nCompany: ${values['company']}\nVessel: ${values['vessel']}\nEmail: ${values['email']}\nPhone: ${values['phone']}\nType: ${values['type']}\n\nRequirements:\n${values['details']}\n\nDrawings (attach separately):\n${files.join('\n') || 'None selected'}`;
    try {
      await navigator.clipboard.writeText(text);
      setResult({ ok: true, text: `Enquiry text copied. Paste it into an email to ${CONTACT.email} and attach any selected drawings separately.` });
    } catch {
      setResult({ ok: false, text });
    }
  }
  return (
            <form onSubmit={submit} className="mt-8 grid gap-5 md:grid-cols-2">
              <label className={label}>Name<input name="name" required placeholder="Your name" className={field} /></label>
              <label className={label}>Company<input name="company" required autoComplete="organization" placeholder="Company name" className={field} /></label>
              <label className={`${label} md:col-span-2`}>Vessel<input name="vessel" required placeholder="Vessel name" className={field} /></label>
              <label className={label}>Contact email<input name="email" type="email" required placeholder="name@company.com" className={field} /></label>
              <label className={label}>Phone number<input name="phone" type="tel" required autoComplete="tel" placeholder="Include country code" className={field} /></label>
              <label className={`${label} md:col-span-2`}>Enquiry type
                <select name="type" className={field}>{ENQUIRY_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
              </label>
              <label className={`${label} md:col-span-2`}>Requirements<textarea name="details" defaultValue={part ? `Part number / maker: ${part}` : ""} required rows={6} placeholder="Part number, model, description, quantities, destination..." className={field} /></label>
              <label className={`${label} md:col-span-2`}>Drawing(s)
                <input type="file" multiple accept=".pdf,.png,.jpg,.jpeg,.webp,.tif,.tiff,.dwg,.dxf" onChange={(e) => setFiles(Array.from(e.target.files ?? []).map((f) => f.name))} className={field} />
                <span className="normal-case tracking-normal">PDF, images, DWG or DXF. Files stay on your device — attach them when you email the enquiry.</span>
              </label>
              {files.length > 0 && <ul className="list-disc pl-5 text-sm text-muted-foreground md:col-span-2">{files.map((f) => <li key={f}>{f}</li>)}</ul>}
              <Button type="submit" className="h-auto rounded-none group inline-flex items-center justify-center gap-3 bg-primary py-5 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:shadow-glow md:col-span-2">
                Copy Enquiry Text <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
              </Button>
              {result && (
                <div className="border-l-2 border-primary bg-muted p-4 text-sm md:col-span-2" aria-live="polite">
                  {result.ok ? result.text : (<>Select and copy this enquiry text:<textarea readOnly value={result.text} rows={6} className={`${field} mt-2`} /></>)}
                </div>
              )}
            </form>
  );
}
