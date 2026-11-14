import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/site/Sections";
import { PageHero, ShanghaiClock } from "@/components/site/Extras";
import { PageShell } from "@/components/site/PageShell";
import { seo } from "@/lib/seo";
import deck from "@/assets/marine-port-logistics.jpg";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact ActivMarine | China enquiries", "Email, call or message ActivMarine in China for spares, repairs, sourcing, docking or surveys."),
  component: () => (
    <PageShell>
      {(open) => (
        <>
          <PageHero eyebrow="Contact" title="Talk to" accent="our team." image={deck} />
          <div className="mx-auto max-w-7xl px-6"><div className="inline-block"><ShanghaiClock /></div></div>
          <Contact onQuote={open} />
        </>
      )}
    </PageShell>
  ),
});
