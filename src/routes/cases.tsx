import { createFileRoute } from "@tanstack/react-router";
import { Cases } from "@/components/site/More";
import { CtaBand, PageHero, Testimonials } from "@/components/site/Extras";
import { PageShell } from "@/components/site/PageShell";
import { seo } from "@/lib/seo";
import shipyard from "@/assets/shipyard-night.jpg";

export const Route = createFileRoute("/cases")({
  head: () => seo("Projects & case studies | ActivMarine", "How ActivMarine solved urgent spare parts, electrical repair and dry-docking challenges in Chinese ports."),
  component: () => (
    <PageShell>
      {(open) => (
        <>
          <PageHero eyebrow="Projects" title="Problems solved," accent="vessels sailing." image={shipyard} />
          <Cases />
          <Testimonials />
          <CtaBand onQuote={open} />
        </>
      )}
    </PageShell>
  ),
});
