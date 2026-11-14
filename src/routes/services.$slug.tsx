import { Button } from "@/components/ui/button";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Check, Printer } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { CtaBand, PageHero } from "@/components/site/Extras";
import { CONTACT, FAQ, SERVICES, STEPS } from "@/components/site/content";
import { SERVICE_IMAGES, RELATED_SERVICE_IMAGES } from "@/components/site/imagery";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const s = SERVICES.find((x) => x.slug === params.slug);
    if (!s) throw notFound();
    return s;
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.title} | ActivMarine China` : "Service not found | ActivMarine";
    const d = loaderData?.text ?? "This service page does not exist.";
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, ...(loaderData ? [] : [{ name: "robots", content: "noindex" }])] };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-40 text-center">
      <h1 className="text-6xl uppercase">Service not found</h1>
      <Link to="/services" className="mt-8 inline-block text-primary">Back to services</Link>
    </div>
  ),
  component: ServicePage,
});

const faq = (question: string) => FAQ.find((item) => item.q === question)?.a;

// Which standing answers from the FAQ belong on each service sheet, so the sheet never states
// anything the FAQ does not.
const SHEET_TERMS: Record<string, { label: string; question: string }[]> = {
  "ship-spares": [
    { label: "Parts supplied", question: "Do you supply genuine maker parts?" },
    { label: "Customs & delivery", question: "How are customs and delivery handled?" },
    { label: "Warranty", question: "Is there a warranty?" },
  ],
  "technical-services": [{ label: "Warranty", question: "Is there a warranty?" }],
  "china-sourcing": [
    { label: "Customs & delivery", question: "How are customs and delivery handled?" },
    { label: "Warranty", question: "Is there a warranty?" },
  ],
  logistics: [{ label: "Customs & delivery", question: "How are customs and delivery handled?" }],
};

const COMMON_TERMS = [
  { label: "Response time", question: "How fast can you respond?" },
  { label: "Ports covered", question: "Which ports do you cover?" },
  { label: "Payment", question: "What payment terms do you offer?" },
];

const sheetLabel = "text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground";
const sheetRow = "grid gap-3 border-b border-border py-5 md:grid-cols-[13rem_1fr] md:gap-8 print:grid-cols-[11rem_1fr] print:gap-6 print:py-3";

function ServicePage() {
  const s = Route.useLoaderData();
  const others = SERVICES.filter((x) => x.slug !== s.slug);
  const terms = [...(SHEET_TERMS[s.slug] ?? []), ...COMMON_TERMS].flatMap((term) => {
    const answer = faq(term.question);
    // FAQ answers reply to a question; on the sheet they stand alone, so a leading "Yes." is dropped.
    return answer ? [{ label: term.label, answer: answer.replace(/^Yes\.\s*/, "") }] : [];
  });
  return (
    <PageShell>
      {(open) => (
        <>
          <PageHero eyebrow={`${s.n} · ${s.tag}`} title={s.title} accent="" text={s.text} image={SERVICE_IMAGES[s.slug]?.src} compact />
          <section className="mx-auto grid max-w-7xl gap-10 px-6 py-16 lg:grid-cols-[1fr_20rem] print:block print:py-0">
            <div>
              <p className="eyebrow">Service sheet</p>
              <dl className="mt-6 border-t border-border">
                <div className={sheetRow}>
                  <dt className={sheetLabel}>Scope</dt>
                  <dd><ul className="grid gap-2 sm:grid-cols-2 print:grid-cols-2">{s.points.map((p) => <li key={p} className="flex items-start gap-3"><Check className="mt-1 h-4 w-4 shrink-0 text-mustard" />{p}</li>)}</ul></dd>
                </div>
                <div className={sheetRow}>
                  <dt className={sheetLabel}>What to send us</dt>
                  <dd><ul className="grid list-disc gap-2 pl-5 marker:text-muted-foreground">{s.need.map((n) => <li key={n}>{n}</li>)}</ul></dd>
                </div>
                <div className={sheetRow}>
                  <dt className={sheetLabel}>How it works</dt>
                  <dd><ol className="grid gap-3">{STEPS.map((step) => <li key={step.n} className="grid grid-cols-[2rem_1fr]"><span className="font-display text-lg leading-tight text-mustard">{step.n}</span><span><span className="font-semibold">{step.title}.</span> <span className="text-muted-foreground">{step.text}</span></span></li>)}</ol></dd>
                </div>
                {terms.map((term) => (
                  <div key={term.label} className={sheetRow}>
                    <dt className={sheetLabel}>{term.label}</dt>
                    <dd>{term.answer}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 hidden text-sm print:block">{CONTACT.company} · {CONTACT.email}</p>
            </div>
            <aside className="glass self-start border border-border p-8 lg:sticky lg:top-28 print:hidden">
              <p className="eyebrow">{s.ask}?</p>
              <p className="mt-5 text-muted-foreground">Send what you have, even if it is incomplete. The enquiry form opens with this service already selected.</p>
              <Button asChild className="mt-7 h-auto w-full rounded-none py-4 text-xs font-bold uppercase tracking-[0.2em] hover:shadow-glow">
                <Link to="/enquiry" search={{ part: "", type: s.enquiry }}>Send enquiry <ArrowUpRight className="h-4 w-4" /></Link>
              </Button>
              <Button type="button" variant="outline" onClick={() => window.print()} className="mt-3 h-auto w-full rounded-none py-4 text-xs font-bold uppercase tracking-[0.2em]">
                <Printer className="h-4 w-4" /> Print or save as PDF
              </Button>
              <a href={`mailto:${CONTACT.email}`} className="mt-5 block text-sm text-primary underline underline-offset-4">{CONTACT.email}</a>
            </aside>
          </section>
          <section className="mx-auto max-w-7xl px-6 py-16 print:hidden">
            <p className="eyebrow">Other services</p>
            <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
              {others.map((o) => (
                <Link key={o.slug} to="/services/$slug" params={{ slug: o.slug }} className="group bg-background p-6 hover:bg-card">
                  <img src={RELATED_SERVICE_IMAGES[s.slug]?.[o.slug]?.src} alt={RELATED_SERVICE_IMAGES[s.slug]?.[o.slug]?.alt} loading="lazy" width={1536} height={1024} className="mb-4 h-20 w-full border border-border object-cover" />
                  <span className="font-display text-lg text-muted-foreground group-hover:text-mustard">{o.n}</span>
                  <span className="mt-2 block font-display text-2xl uppercase leading-none">{o.title}</span>
                </Link>
              ))}
            </div>
            <Link to="/services" className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> All services</Link>
          </section>
          <CtaBand onQuote={open} />
        </>
      )}
    </PageShell>
  );
}
