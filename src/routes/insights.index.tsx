import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { ARTICLES } from "@/components/site/content";
import { PLACEMENT_IMAGES } from "@/components/site/imagery";
const shipyard = PLACEMENT_IMAGES["insights-main"].src;

export const Route = createFileRoute("/insights/")({
  head: () => ({
    meta: [
      { title: "Insights | Activ Marine — Practical notes from China" },
      { name: "description", content: "Practical guidance on dry-docking in China, sourcing marine spares and vessel surveys from former seafarers." },
      { property: "og:title", content: "Insights | Activ Marine" },
      { property: "og:description", content: "Practical guidance on dry-docking in China, sourcing marine spares and vessel surveys." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Insights,
});

function Insights() {
  const [first, ...rest] = ARTICLES;
  return (
    <PageShell>
      {() => (
        <div className="mx-auto max-w-7xl px-6 pb-32 pt-40">
          <Reveal>
            <p className="eyebrow">Insights</p>
            <h1 className="mt-6 text-[clamp(4rem,11vw,10rem)] uppercase">Notes from<br /><span className="text-tide">the waterfront.</span></h1>
          </Reveal>
          {first && (
            <Reveal className="mt-20">
              <Link to="/insights/$slug" params={{ slug: first.slug }} className="group relative block overflow-hidden border border-border">
                <img src={shipyard} alt="" className="h-[60vh] w-full object-cover opacity-60 transition-transform duration-[1.5s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-veil" />
                <div className="absolute bottom-0 p-10">
                  <p className="eyebrow">{first.date} · {first.read}</p>
                  <h2 className="mt-4 max-w-3xl text-[clamp(2.5rem,5vw,4.5rem)] uppercase">{first.title}</h2>
                  <p className="mt-3 max-w-xl text-muted-foreground">{first.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          )}
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {rest.map((a, i) => (
              <Reveal key={a.slug} delay={i * 0.1}>
                <Link to="/insights/$slug" params={{ slug: a.slug }} className="group flex h-full flex-col justify-between border border-border bg-card p-10 transition-colors hover:border-primary">
                  <img src={PLACEMENT_IMAGES[i === 0 ? "insights-0" : "insights-1"].src} alt={i === 0 ? "Illustrative precision marine spare parts" : "Illustrative vessel hull ready for survey"} loading="lazy" width={1536} height={1024} className="mb-6 h-24 w-36 border border-border object-cover" />
                  <div className="flex items-center justify-between"><p className="eyebrow">{a.date} · {a.read}</p><ArrowUpRight className="h-5 w-5 text-primary transition-transform group-hover:rotate-45" /></div>
                  <h2 className="mt-10 text-4xl uppercase">{a.title}</h2>
                  <p className="mt-3 text-muted-foreground">{a.excerpt}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </PageShell>
  );
}
