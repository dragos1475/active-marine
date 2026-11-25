import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { ENQUIRY_DELIVERY } from "@/lib/enquiry";
import { CONTACT } from "@/components/site/content";
import { seo } from "@/lib/seo";
import { PLACEMENT_IMAGES } from "@/components/site/imagery";

// part: free text from the quick parts search; type, port and eta: chosen on the homepage.
type EnquirySearch = { part: string; type?: string; port?: string; eta?: string };

export const Route = createFileRoute("/enquiry")({
  validateSearch: (search: Record<string, unknown>): EnquirySearch => {
    const text = (key: string) => { const value = search[key]; return typeof value === "string" && value ? value : undefined; };
    const result: EnquirySearch = { part: text("part") ?? "" };
    const [type, port, eta] = [text("type"), text("port"), text("eta")];
    if (type) result.type = type;
    if (port) result.port = port;
    if (eta) result.eta = eta;
    return result;
  },
  head: () => seo("Send an Enquiry | Activ Marine Limited", "Request marine spares, technical services, sourcing, docking or surveys across China from Activ Marine Limited."),
  component: Enquiry,
});

function Enquiry() {
  const { part, type = "", port = "", eta = "" } = Route.useSearch();
  return <PageShell>{() => <section className="mx-auto max-w-7xl px-6 pb-20 pt-28">
    <div className="flex items-end justify-between gap-8">
      <div className="max-w-3xl">
        <p className="eyebrow">Activ Marine Limited · China</p>
        <h1 className="mt-4 text-4xl uppercase sm:text-5xl">Send an Enquiry</h1>
        <p className="mt-4 leading-relaxed text-muted-foreground">We acknowledge all enquiries within 2 hours, while trying our best to have you an indication on availability and pricing within 48 hours.</p>
        {ENQUIRY_DELIVERY === "netlify" ? (
          <p className="mt-2 text-sm text-muted-foreground">Press Send enquiry and it goes straight to our office. Drawings and photos are not uploaded from this page: email them to <a className="text-primary underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>, quoting your reference.</p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">This form prepares your enquiry as an email to <a className="text-primary underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>. Nothing is sent automatically: open it in your email app or copy the text, attach any drawings, then send.</p>
        )}
      </div>
      <img src={PLACEMENT_IMAGES.enquiry.src} alt="Illustrative marine piston, cylinder liner and precision spare parts" loading="lazy" width={1536} height={1024} className="hidden h-28 w-44 shrink-0 border border-border object-cover lg:block" />
    </div>
    <EnquiryForm part={part} type={type} port={port} eta={eta} />
  </section>}</PageShell>;
}