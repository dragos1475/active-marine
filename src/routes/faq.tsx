import { createFileRoute } from "@tanstack/react-router";
import { CtaBand, FaqList, PageHero } from "@/components/site/Extras";
import { PageShell } from "@/components/site/PageShell";
import { seo } from "@/lib/seo";
import { PAGE_IMAGES } from "@/components/site/imagery";
const vessel = PAGE_IMAGES.faq;

export const Route = createFileRoute("/faq")({
  head: () => seo("FAQ | ActivMarine — Delivery, customs, payment, warranty", "Answers on ports covered, genuine parts, response times, customs, payment terms and warranty."),
  component: () => (
    <PageShell>
      {(open) => (
        <>
          <PageHero eyebrow="FAQ" title="Straight" accent="answers." image={vessel} />
          <section className="mx-auto max-w-4xl px-6 pb-16"><FaqList /></section>
          <CtaBand onQuote={open}>Still have a question?</CtaBand>
        </>
      )}
    </PageShell>
  ),
});
