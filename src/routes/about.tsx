import { createFileRoute } from "@tanstack/react-router";
import { About, Approach } from "@/components/site/Sections";
import { Makers, Team } from "@/components/site/More";
import { CtaBand, Stats } from "@/components/site/Extras";
import { PageShell } from "@/components/site/PageShell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => seo("About ActivMarine | Former seafarers in Shanghai", "Who we are: former mariners, engineers and surveyors supporting ship owners and managers from Shanghai."),
  component: () => (
    <PageShell>
      {(open) => (
        <div className="pt-20">
          <About />
          <Stats />
          <Approach />
          <Team />
          <Makers />
          <CtaBand onQuote={open} />
        </div>
      )}
    </PageShell>
  ),
});
