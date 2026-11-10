import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/site/Hero";
import { About, Approach, China, Contact, Marquee, Services } from "@/components/site/Sections";
import { Cases, Makers, PortsMap, Team } from "@/components/site/More";
import { PageShell } from "@/components/site/PageShell";

const TITLE = "ActivMarine | Marine Engineering, Supply & Solutions — Shanghai";
const DESC =
  "Former seafarers and marine surveyors delivering ship spares, technical services, China sourcing, docking supervision and marine surveys from Shanghai.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "theme-color", content: "#0c2340" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <PageShell>
      {(open) => (
        <>
          <Hero onQuote={open} />
          <Marquee />
          <About />
          <Services />
          <Makers />
          <Approach />
          <Cases />
          <Team />
          <China />
          <PortsMap />
          <Contact onQuote={open} />
        </>
      )}
    </PageShell>
  );
}
