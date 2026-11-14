import { createFileRoute } from "@tanstack/react-router";
import { About, Approach } from "@/components/site/Sections";
import { Makers } from "@/components/site/More";
import { CtaBand } from "@/components/site/Extras";
import { PageShell } from "@/components/site/PageShell";
import { seo } from "@/lib/seo";
import { MaritimeImage } from "@/components/site/MaritimeImage";
import { PAGE_IMAGES } from "@/components/site/imagery";
const deck = PAGE_IMAGES.about;

export const Route = createFileRoute("/about")({
  head: () => seo("About ActivMarine | Former seafarers in China", "Who we are: former mariners, engineers and surveyors supporting ship owners and managers across China."),
  component: () => (
    <PageShell>
      {(open) => (
        <div className="pt-20">
          <About />
          <MaritimeImage src={deck} alt="Illustrative vessel hull, propeller and rudder in a daylight dry dock" />
          <Approach />
          <Makers />
          <CtaBand onQuote={open} />
        </div>
      )}
    </PageShell>
  ),
});
