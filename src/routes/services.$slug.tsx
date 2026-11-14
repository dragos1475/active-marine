import { Button } from "@/components/ui/button";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { CtaBand, PageHero } from "@/components/site/Extras";
import { SERVICES } from "@/components/site/content";
import { SERVICE_IMAGES, RELATED_SERVICE_IMAGES } from "@/components/site/imagery";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const s = SERVICES.find((x) => x.slug === params.slug);
    if (!s) throw notFound();
    return s;
  },
  head: ({ loaderData }) => {
    const t = loaderData ? `${loaderData.title} | ActivMarine China` : "Service not found | ActivMarine";
    const d = loaderData?.text ?? "This service page does not exist.";
    return { meta: [{ title: t }, { name: "description", content: d }, { property: "og:title", content: t }, { property: "og:description", content: d }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, ...(loaderData ? [] : [{ name: "robots", content: "noindex" }])] };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 py-40 text-center">
      <h1 className="text-6xl uppercase">Service not found</h1>
      <Link to="/services" className="mt-8 inline-block text-primary">Back to services</Link>
    </div>
  ),
  component: ServicePage,
});

function ServicePage() {
  const s = Route.useLoaderData();
  const others = SERVICES.filter((x) => x.slug !== s.slug);
  return (
    <PageShell>
      {(open) => (
        <>
          <PageHero eyebrow={`${s.n} · ${s.tag}`} title={s.title} accent="" text={s.text} image={SERVICE_IMAGES[s.slug]?.src} />
          <section className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2">
            <Reveal>
              <p className="eyebrow">What's included</p>
              <ul className="mt-8 space-y-5">
                {s.points.map((p) => (
                  <li key={p} className="flex items-start gap-4 border-b border-border pb-5 text-lg"><Check className="mt-1 h-5 w-5 shrink-0 text-mustard" />{p}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.15} className="glass border border-border p-10">
              <p className="eyebrow">How it works</p>
              <p className="mt-6 text-muted-foreground">Send us the maker, model, drawings or a short description. We confirm the technical requirement, propose options with clear pricing and coordinate everything up to the vessel.</p>
              <Button onClick={open} className="h-auto rounded-none mt-8 inline-flex items-center gap-3 bg-primary px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground hover:shadow-glow">Request a quote <ArrowUpRight className="h-4 w-4" /></Button>
            </Reveal>
          </section>
          <section className="mx-auto max-w-7xl px-6 py-16">
            <p className="eyebrow">Other services</p>
            <div className="mt-8 grid gap-px border border-border bg-border sm:grid-cols-2 lg:grid-cols-5">
              {others.map((o) => (
                <Link key={o.slug} to="/services/$slug" params={{ slug: o.slug }} className="group bg-background p-6 hover:bg-card">
                  <img src={RELATED_SERVICE_IMAGES[s.slug]?.[o.slug]?.src} alt={RELATED_SERVICE_IMAGES[s.slug]?.[o.slug]?.alt} loading="lazy" width={1536} height={1024} className="mb-4 h-20 w-full border border-border object-cover" />
                  <span className="font-display text-lg text-muted-foreground group-hover:text-mustard">{o.n}</span>
                  <span className="mt-2 block font-display text-2xl uppercase leading-none">{o.title}</span>
                </Link>
              ))}
            </div>
            <Link to="/services" className="mt-8 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" /> All services</Link>
          </section>
          <CtaBand onQuote={open} />
        </>
      )}
    </PageShell>
  );
}
