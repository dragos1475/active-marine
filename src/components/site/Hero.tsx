import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import video from "@/assets/hero_ship_cinematic.mp4.asset.json";
import poster from "@/assets/hero.png.asset.json";

const words = ["Marine", "Expertise"];

export function Hero({ onQuote }: { onQuote: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section ref={ref} id="top" className="grain relative h-[100svh] min-h-[680px] overflow-hidden bg-abyss">
      <motion.div style={{ scale }} className="absolute inset-0">
        <motion.video
          initial={{ opacity: 0, scale: 1.15 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }}
          src={video.url}
          poster={poster.url}
          autoPlay muted loop playsInline
          className="h-full w-full object-cover"
        />
      </motion.div>
      <div className="absolute inset-0 bg-side" />
      <div className="absolute inset-0 bg-veil" />

      <motion.div style={{ y, opacity: fade }} className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-32">
        <motion.p initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 1 }} className="eyebrow mb-6 flex items-center gap-4">
          <span className="h-px w-12 bg-primary" /> Shanghai · Engineering · Supply · Solutions
        </motion.p>
        <h1 className="text-[clamp(4.5rem,13vw,12rem)] uppercase">
          {words.map((w, i) => (
            <span key={w} className="block overflow-hidden">
              <motion.span className="block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.9 + i * 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
                {w}
              </motion.span>
            </span>
          ))}
          <span className="block overflow-hidden">
            <motion.span className="text-tide block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 1.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
              in Action.
            </motion.span>
          </span>
        </h1>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 1 }} className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-lg font-light leading-relaxed text-muted-foreground">
            Led by former seafarers and marine surveyors. Practical engineering, dependable marine supply and responsive technical solutions for vessels and operators.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="#solutions" className="group inline-flex items-center gap-3 bg-primary px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:shadow-glow">
              Explore Solutions <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </a>
            <button onClick={onQuote} className="glass inline-flex items-center gap-3 border border-input px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary">
              Request a Quote
            </button>
          </div>
        </motion.div>
      </motion.div>

      <motion.a href="#about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
        Scroll
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ArrowDown className="h-4 w-4 text-primary" />
        </motion.span>
      </motion.a>
    </section>
  );
}
