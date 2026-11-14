import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { Marquee } from "@/components/site/Sections";
import { Makers } from "@/components/site/More";
import { CtaBand, PartsSearch, ServicesTeaser } from "@/components/site/Extras";
import { PageShell } from "@/components/site/PageShell";
import { Intro } from "@/components/site/Cinematic";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => seo(
    "ActivMarine | Marine Engineering, Supply & Solutions — China",
    "Former seafarers and marine surveyors delivering ship spares, technical services, China sourcing, docking supervision and marine surveys across China.",
  ),
  component: Index,
});

function Index() {
  return (
    <PageShell>
      {(open) => (
        <>
          <Intro />
          <Hero onQuote={open} />
          <Marquee />
          <ServicesTeaser />
          <Makers />
          <PartsSearch />
          <CtaBand onQuote={open} />
        </>
      )}
    </PageShell>
  );
}
