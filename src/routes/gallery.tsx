import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import { CtaBand, PageHero } from "@/components/site/Extras";
import { PageShell } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { seo } from "@/lib/seo";
import engine from "@/assets/engine-room.jpg";
import shipyard from "@/assets/shipyard-night.jpg";
import parts from "@/assets/marine-spares-electronics.png.asset.json";
import hero from "@/assets/hero.png.asset.json";
import office from "@/assets/office-team-final.png.asset.json";
import v2 from "@/assets/ship_golden_hour_aerial.mp4.asset.json";
import v3 from "@/assets/shanghai_port_aerial.mp4.asset.json";
import v4 from "@/assets/engine_room_cinematic.mp4.asset.json";

type Item = { src: string; label: string; video?: boolean; span: string };
const ITEMS: Item[] = [
  { src: v2.url, label: "Golden hour transit", video: true, span: "md:col-span-4 md:row-span-2" },
  { src: engine, label: "Engine room attendance", span: "md:col-span-2" },
  { src: parts.url, label: "Spares & electronics", span: "md:col-span-2" },
  { src: shipyard, label: "Night shift at the yard", span: "md:col-span-3" },
  { src: v3.url, label: "Shanghai port", video: true, span: "md:col-span-3" },
  { src: office.url, label: "Shanghai office", span: "md:col-span-2" },
  { src: hero.url, label: "Delivery at anchorage", span: "md:col-span-2" },
  { src: v4.url, label: "Machinery overhaul", video: true, span: "md:col-span-2" },
];

export const Route = createFileRoute("/gallery")({
  head: () => seo("Gallery | ActivMarine in the field", "Photos and film from engine rooms, shipyards and ports where ActivMarine supports vessels."),
  component: Gallery,
});

function Gallery() {
  const [sel, setSel] = useState<Item | null>(null);
  return (
    <PageShell>
      {(open) => (
        <>
          <PageHero eyebrow="Gallery" title="In the field," accent="on the water." />
          <section className="mx-auto grid max-w-7xl auto-rows-[260px] gap-4 px-6 md:grid-cols-6">
            {ITEMS.map((it, i) => (
              <Reveal key={it.label} delay={(i % 3) * 0.08} className={it.span}>
                <button onClick={() => setSel(it)} className="group relative h-full w-full overflow-hidden" aria-label={`Open ${it.label}`}>
                  {it.video ? (
                    <video src={it.src} autoPlay muted loop playsInline className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                  ) : (
                    <img src={it.src} alt={it.label} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" />
                  )}
                  <span className="absolute inset-x-0 bottom-0 bg-veil p-5 text-left font-display text-2xl uppercase">{it.label}</span>
                </button>
              </Reveal>
            ))}
          </section>
          <CtaBand onQuote={open} />
          <AnimatePresence>
            {sel && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSel(null)} className="fixed inset-0 z-50 flex items-center justify-center bg-abyss/95 p-6">
                <button aria-label="Close" className="absolute right-6 top-6 p-2"><X className="h-7 w-7" /></button>
                <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} className="max-h-full max-w-6xl" onClick={(e) => e.stopPropagation()}>
                  {sel.video ? <video src={sel.src} autoPlay muted loop playsInline controls className="max-h-[85vh] w-full" /> : <img src={sel.src} alt={sel.label} className="max-h-[85vh] w-full object-contain" />}
                  <p className="mt-4 font-display text-3xl uppercase">{sel.label}</p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </PageShell>
  );
}
