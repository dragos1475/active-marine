import { createFileRoute } from "@tanstack/react-router";
import { Services } from "@/components/site/Sections";
import { CtaBand, PartsSearch } from "@/components/site/Extras";
import { PageShell } from "@/components/site/PageShell";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/services/")({
  head: () => seo("Services | Activ Marine — Spares, repairs, sourcing, docking, surveys", "Ship spares, technical and electrical repairs, China sourcing, logistics, docking supervision and marine surveys across China."),
  component: () => (
    <PageShell>
      {(open) => (
        <div className="pt-16">
          <Services />
          <PartsSearch placement="services-parts" />
          <CtaBand onQuote={open} />
        </div>
      )}
    </PageShell>
  ),
});
