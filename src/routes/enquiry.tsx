import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { CONTACT } from "@/components/site/content";
import { seo } from "@/lib/seo";
import deck from "@/assets/marine-deck-details.jpg";

export const Route = createFileRoute("/enquiry")({
  validateSearch: (search: Record<string, unknown>) => ({ part: typeof search['part'] === 'string' ? search['part'] : '' }),
  head: () => seo("Send an Enquiry | Activ Marine Limited", "Request marine spares, technical services, sourcing, docking or surveys across China from Activ Marine Limited."),
  component: Enquiry,
});

function Enquiry() {
  const { part } = Route.useSearch();
  return <PageShell>{() => <section className="mx-auto max-w-3xl px-6 pb-24 pt-36">
    <p className="eyebrow">Activ Marine Limited · China</p>
    <h1 className="mt-6 text-5xl uppercase sm:text-7xl">Send an Enquiry</h1>
    <img src={deck} alt="Illustrative ship deck with marine mooring equipment in daylight" loading="lazy" width={1536} height={1024} className="mt-8 h-32 w-full border-y border-border object-cover sm:h-40" />
    <p className="mt-6 leading-relaxed text-muted-foreground">We acknowledge all enquiries within 2 hours, while trying our best to have you an indication on availability and pricing within 48 hours.</p>
    <p className="mt-4 text-sm text-muted-foreground">This form prepares your enquiry for email. Nothing is sent automatically; copy the completed text and email it to <a className="text-primary underline" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>, with any drawings attached separately.</p>
    <EnquiryForm part={part} />
  </section>}</PageShell>;
}