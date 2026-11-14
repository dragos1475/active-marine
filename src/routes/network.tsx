import { createFileRoute } from "@tanstack/react-router";
import { China } from "@/components/site/Sections";
import { PortsMap } from "@/components/site/More";
import { CtaBand, PageHero, ShanghaiClock } from "@/components/site/Extras";
import { PageShell } from "@/components/site/PageShell";
import { seo } from "@/lib/seo";
import { PAGE_IMAGES } from "@/components/site/imagery";
const port = PAGE_IMAGES.network;

export const Route = createFileRoute("/network")({
  head: () => seo("China ports network | Activ Marine", "Support across all Chinese ports including Hong Kong."),
  component: () => (
    <PageShell>
      {(open) => (
        <>
          <PageHero eyebrow="Network" title="Every major port" accent="on the China coast." text="All Chinese ports including Hong Kong" image={port} />
          <div className="mx-auto max-w-7xl px-6"><div className="inline-block"><ShanghaiClock /></div></div>
          <PortsMap />
          <China />
          <CtaBand onQuote={open} />
        </>
      )}
    </PageShell>
  ),
});
