import { createFileRoute } from "@tanstack/react-router";
import { China } from "@/components/site/Sections";
import { PortsMap } from "@/components/site/More";
import { CtaBand, PageHero, ShanghaiClock } from "@/components/site/Extras";
import { PageShell } from "@/components/site/PageShell";
import { seo } from "@/lib/seo";
import hero from "@/assets/hero.png.asset.json";

export const Route = createFileRoute("/network")({
  head: () => seo("China ports network | ActivMarine", "Shanghai-based support across Ningbo-Zhoushan, Qingdao, Tianjin, Dalian, Xiamen, Guangzhou and more Chinese ports."),
  component: () => (
    <PageShell>
      {(open) => (
        <>
          <PageHero eyebrow="Network" title="Every major port" accent="on the China coast." image={hero.url} />
          <div className="mx-auto max-w-7xl px-6"><div className="inline-block"><ShanghaiClock /></div></div>
          <PortsMap />
          <China />
          <CtaBand onQuote={open} />
        </>
      )}
    </PageShell>
  ),
});
