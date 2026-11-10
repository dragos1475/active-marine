import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/site/Sections";
import { PageHero, PartsSearch, ShanghaiClock } from "@/components/site/Extras";
import { PageShell } from "@/components/site/PageShell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact ActivMarine | Shanghai, 24/7", "Email, call or message ActivMarine in Shanghai for spares, repairs, sourcing, docking or surveys."),
  component: () => (
    <PageShell>
      {(open) => (
        <>
          <PageHero eyebrow="Contact" title="Talk to" accent="Shanghai." />
          <div className="mx-auto max-w-7xl px-6"><div className="inline-block"><ShanghaiClock /></div></div>
          <Contact onQuote={open} />
          <PartsSearch />
        </>
      )}
    </PageShell>
  ),
});
