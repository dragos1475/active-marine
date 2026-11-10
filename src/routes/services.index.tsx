import { createFileRoute } from "@tanstack/react-router";
import { Services } from "@/components/site/Sections";
import { CtaBand, PartsSearch, Timeline } from "@/components/site/Extras";
import { PageShell } from "@/components/site/PageShell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/services/")({
  head: () => seo("Services | ActivMarine — Spares, repairs, sourcing, docking, surveys", "Ship spares, technical and electrical repairs, China sourcing, logistics, docking supervision and marine surveys from Shanghai."),
  component: () => (
    <PageShell>
      {(open) => (
        <div className="pt-20">
          <Services />
          <PartsSearch />
          <Timeline />
          <CtaBand onQuote={open} />
        </div>
      )}
    </PageShell>
  ),
});
