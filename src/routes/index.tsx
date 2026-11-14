import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Sections";
import { Makers } from "@/components/site/More";
import { CtaBand, PartsSearch, ServicesTeaser, Stats, Testimonials, Timeline } from "@/components/site/Extras";
import { PageShell } from "@/components/site/PageShell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => seo(
    "ActivMarine | Marine Engineering, Supply & Solutions — Shanghai",
    "Former seafarers and marine surveyors delivering ship spares, technical services, China sourcing, docking supervision and marine surveys from Shanghai.",
  ),
  component: Index,
});

function Index() {
  return (
    <PageShell waitForVideo>
      {(open) => (
        <>
          <Hero onQuote={open} />
          <Marquee />
          <Stats />
          <ServicesTeaser />
          <Timeline />
          <Makers />
          <Testimonials />
          <PartsSearch />
          <CtaBand onQuote={open} />
        </>
      )}
    </PageShell>
  );
}
