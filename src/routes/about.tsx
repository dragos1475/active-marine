import { createFileRoute } from "@tanstack/react-router";
import { About, Approach } from "@/components/site/Sections";
import { Makers } from "@/components/site/More";
import { CtaBand } from "@/components/site/Extras";
import { PageShell } from "@/components/site/PageShell";
import { seo } from "@/lib/seo";
import { MaritimeImage } from "@/components/site/MaritimeImage";
import deck from "@/assets/marine-deck-details.jpg";

export const Route = createFileRoute("/about")({
  head: () => seo("About ActivMarine | Former seafarers in China", "Who we are: former mariners, engineers and surveyors supporting ship owners and managers across China."),
  component: () => (
    <PageShell>
      {(open) => (
        <div className="pt-20">
          <About />
          <MaritimeImage src={deck} alt="Illustrative daylight ship deck with turquoise mooring rope, brass bollard and burgundy fitting" />
          <Approach />
          <Makers />
          <CtaBand onQuote={open} />
        </div>
      )}
    </PageShell>
  ),
});
