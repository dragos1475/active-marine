import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import v1 from "@/assets/hero_ship_cinematic.mp4.asset.json";
import v2 from "@/assets/ship_golden_hour_aerial.mp4.asset.json";
import v3 from "@/assets/shanghai_port_aerial.mp4.asset.json";
import v4 from "@/assets/engine_room_cinematic.mp4.asset.json";
import poster from "@/assets/hero.png.asset.json";

const words = ["Marine", "Expertise"];
const CLIPS = [
  { src: v1.url, label: "At sea" },
  { src: v2.url, label: "Golden hour" },
  { src: v3.url, label: "Shanghai port" },
  { src: v4.url, label: "Engine room" },
];
const HOLD_MS = 5000; // time each clip stays on screen
const FADE_MS = 2500; // slow crossfade between clips

export function Hero({ onQuote }: { onQuote: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const [active, setActive] = useState(0);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % CLIPS.length), HOLD_MS);
    return () => clearInterval(t);
  }, []);
  // Restart the incoming clip while it is still invisible, so its full 8 s fits the on-screen
  // window (fade-in + hold + fade-out = 7.5 s) and its own loop point is never seen.
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    const v = vids.current[active];
    if (v) v.currentTime = 0;
  }, [active]);
  const firstRun = useRef(true);
  const prev = (active - 1 + CLIPS.length) % CLIPS.length;
  // All clips keep playing in the background so a crossfade never reveals a frozen or seeking frame.
  useEffect(() => {
    vids.current.forEach((v) => v && void v.play().catch(() => {}));
  }, []);

  return (
    <section ref={ref} id="top" className="grain relative h-[100svh] min-h-[680px] overflow-hidden bg-abyss">
      <motion.div style={{ scale }} className="absolute inset-0 isolate">
        <motion.div initial={{ opacity: 0, scale: 1.15 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0 isolate">
          {CLIPS.map((c, i) => (
            <video
              key={c.src}
              ref={(el) => { vids.current[i] = el; }}
              src={c.src}
              poster={i === 0 ? poster.url : undefined}
              autoPlay muted loop playsInline
              preload="auto"
              style={{
                transitionProperty: "opacity, transform",
                transitionTimingFunction: "cubic-bezier(0.45, 0, 0.55, 1), linear",
                transitionDuration: i === active ? `${FADE_MS}ms, ${HOLD_MS + FADE_MS}ms` : i === prev ? `${FADE_MS}ms, ${HOLD_MS + FADE_MS}ms` : "0ms, 0ms",
              }}
              className={`absolute inset-0 h-full w-full object-cover ${i === active ? "scale-110 opacity-100" : i === prev ? "scale-110 opacity-0" : "scale-100 opacity-0"}`}
            />
          ))}
        </motion.div>
      </motion.div>
      <div className="absolute inset-0 z-[1] bg-side" />
      <div className="absolute inset-0 z-[1] bg-veil" />

      <motion.div style={{ y, opacity: fade }} className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-6 pb-32 pt-28">
        <motion.p initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8, duration: 1 }} className="eyebrow mb-6 flex items-center gap-4">
          <span className="h-px w-12 bg-primary" /> Shanghai · Engineering · Supply · Solutions
        </motion.p>
        <h1 className="text-[clamp(4rem,min(13vw,17svh),12rem)] uppercase">
          {words.map((w, i) => (
            <span key={w} className="block overflow-hidden">
              <motion.span className="block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 0.9 + i * 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
                {w}
              </motion.span>
            </span>
          ))}
          <span className="block overflow-hidden">
            <motion.span className="text-burgundy-bright block" initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ delay: 1.2, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
              in Action.
            </motion.span>
          </span>
        </h1>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 1 }} className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <p className="max-w-md text-lg font-light leading-relaxed text-muted-foreground">
            Led by former seafarers and marine surveyors. Practical engineering, dependable marine supply and responsive technical solutions for vessels and operators.
          </p>
          <div className="flex flex-wrap gap-3">
            <a href="/#solutions" className="group inline-flex items-center gap-3 bg-primary px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:shadow-glow">
              Explore Solutions <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </a>
            <button onClick={onQuote} className="glass inline-flex items-center gap-3 border border-input px-7 py-4 text-xs font-bold uppercase tracking-[0.2em] transition-colors hover:border-primary hover:text-primary">
              Request a Quote
            </button>
          </div>
        </motion.div>
      </motion.div>

      <div className="absolute bottom-10 right-6 z-10 hidden gap-4 md:flex">
        {CLIPS.map((c, i) => (
          <button key={c.label} onClick={() => setActive(i)} aria-label={`Show ${c.label}`} className="group w-24 text-left">
            <span className="block h-px w-full overflow-hidden bg-input">
              <span
                className={`block h-full bg-primary ${i === active ? "w-full transition-[width] ease-linear" : "w-0"}`}
                style={i === active ? { transitionDuration: `${HOLD_MS}ms` } : undefined}
              />
            </span>
            <span className={`mt-2 block text-[0.6rem] uppercase tracking-[0.25em] ${i === active ? "text-foreground" : "text-muted-foreground"}`}>{c.label}</span>
          </button>
        ))}
      </div>

      <motion.a href="/#about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
        Scroll
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <ArrowDown className="h-4 w-4 text-primary" />
        </motion.span>
      </motion.a>
    </section>
  );
}
