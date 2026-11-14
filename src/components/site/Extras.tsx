import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView, AnimatePresence } from "motion/react";
import { ArrowUpRight, Plus, Search, Quote } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { Button } from "@/components/ui/button";
import { MockLabel } from "./More";
import { FAQ, PORTS, SERVICES, STATS, TESTIMONIALS, TIMELINE } from "./content";
import { HOME_SERVICE_IMAGES, PLACEMENT_IMAGES } from "./imagery";

/** compact: a smaller title and less height, for pages where the content below matters more than the heading. */
export function PageHero({ eyebrow, title, accent, text, image, compact = false }: { eyebrow: string; title: string; accent: string; text?: string | undefined; image?: string | undefined; compact?: boolean }) {
  return (
    <section className={`relative overflow-hidden print:pb-4 print:pt-0 ${compact ? "pb-12 pt-32" : "pb-20 pt-40"}`}>
      {image && (
        <>
          <motion.img src={image} alt="" initial={{ scale: 1.05 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0 h-full w-full object-cover object-right print:hidden" />
          <div className="page-image-wash absolute inset-0 print:hidden" />
        </>
      )}
      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className={`mt-6 uppercase print:text-5xl ${compact ? "text-[clamp(2.5rem,5vw,4.5rem)]" : "text-[clamp(3.5rem,10vw,9rem)]"}`}>{title}{accent && <><br /><span className="text-tide">{accent}</span></>}</h1>
          {text && <p className={`max-w-xl text-lg text-muted-foreground ${compact ? "mt-5" : "mt-8"}`}>{text}</p>}
        </Reveal>
      </div>
    </section>
  );
}

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref}>{v}{suffix}</span>;
}

export function Stats() {
  return (
    <section id="stats" className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.1} className="bg-background p-10">
            <div className="font-display text-[clamp(4rem,8vw,6.5rem)] leading-none text-tide"><Counter to={s.value} suffix={s.suffix} /></div>
            <p className="mt-4 text-xs uppercase tracking-[0.25em] text-muted-foreground">{s.label}</p>
          </Reveal>
        ))}
      </div>
      <div className="mt-4"><MockLabel>Illustrative figures</MockLabel></div>
    </section>
  );
}

/** Homepage entry by situation: the client picks the problem, or the port and date, not a department. */
export function Situations() {
  const navigate = useNavigate();
  const [port, setPort] = useState("");
  const [eta, setEta] = useState("");
  const control = "w-full border border-input bg-muted px-4 py-3 text-base text-foreground outline-none transition-colors focus:border-primary";
  const caption = "flex flex-col gap-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground";
  return (
    <section className="mx-auto max-w-7xl px-6 py-14 md:py-24">
      <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">Start from your situation</p>
          <h2 className="mt-6 text-[clamp(2.75rem,6vw,5rem)] uppercase">What does the vessel need?</h2>
        </div>
        <Link to="/services" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">All services <ArrowUpRight className="h-4 w-4" /></Link>
      </Reveal>
      <form
        onSubmit={(e) => { e.preventDefault(); void navigate({ to: "/enquiry", search: { part: "", ...(port ? { port } : {}), ...(eta ? { eta } : {}) } }); }}
        className="mb-4 grid gap-4 border border-border bg-card p-6 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-end"
      >
        <p className="font-display text-2xl uppercase leading-none md:pb-3">Vessel calling China?</p>
        <label className={caption}>Port
          <select value={port} onChange={(e) => setPort(e.target.value)} className={control}>
            <option value="">Any port or not sure yet</option>
            {PORTS.map((p) => <option key={p.name}>{p.name}</option>)}
          </select>
        </label>
        <label className={caption}>Vessel ETA<input type="date" value={eta} onChange={(e) => setEta(e.target.value)} className={control} /></label>
        <Button type="submit" className="h-auto rounded-none px-7 py-4 text-xs font-bold uppercase tracking-[0.2em]">Start enquiry <ArrowUpRight /></Button>
      </form>
      <div className="grid gap-px border border-border bg-border md:grid-cols-3">
        {SERVICES.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 3) * 0.08} className="bg-background">
            <div className="flex h-full flex-col p-5 md:p-8">
              {/* Phones get a compact list: the number sits in the heading and the photo is left out. */}
              <div className="hidden items-start justify-between gap-4 md:flex"><span className="font-display text-5xl text-muted-foreground">{s.n}</span><img src={HOME_SERVICE_IMAGES[s.slug]?.src} alt={HOME_SERVICE_IMAGES[s.slug]?.alt} width={1536} height={1024} loading="lazy" className="h-20 w-28 shrink-0 border border-border object-cover" /></div>
              <h3 className="font-display text-2xl uppercase md:mt-6 md:text-3xl"><span className="mr-3 text-muted-foreground md:hidden">{s.n}</span>{s.ask}</h3>
              <p className="mt-1 text-sm text-muted-foreground md:mt-3">{s.title}</p>
              <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-4 md:pt-8">
                <Link to="/enquiry" search={{ part: "", type: s.enquiry }} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary hover:text-foreground">Send enquiry <ArrowUpRight className="h-4 w-4" /></Link>
                <Link to="/services/$slug" params={{ slug: s.slug }} className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary">How it works</Link>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Timeline() {
  return (
    <section className="relative bg-abyss py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="eyebrow">Anatomy of an intervention</p>
          <h2 className="mt-6 text-[clamp(3rem,7vw,6rem)] uppercase">From call to <span className="text-burgundy-bright">on board</span><br />in 36 hours.</h2>
        </Reveal>
        <div className="relative mt-20">
          <motion.div initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true, margin: "-20%" }} transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }} className="absolute left-[4.5rem] top-0 h-full w-px origin-top bg-tide md:left-1/2" />
          {TIMELINE.map((s, i) => (
            <Reveal key={s.t} delay={0.1} className={`relative mb-14 grid grid-cols-[9rem_1fr] items-start gap-6 md:grid-cols-2 md:gap-16 ${i % 2 ? "md:[&>*:first-child]:order-2" : ""}`}>
              <div className={`font-display text-5xl text-mustard md:text-7xl ${i % 2 ? "md:text-left" : "md:text-right"}`}>{s.t}<span className="text-xl text-muted-foreground">h</span></div>
              <div className={`border-l border-border pl-6 md:border-l-0 md:pl-0 ${i % 2 ? "md:text-right" : ""}`}>
                <h3 className="font-display text-3xl uppercase">{s.title}</h3>
                <p className="mt-2 max-w-md text-muted-foreground md:inline-block">{s.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <MockLabel>Illustrative scenario</MockLabel>
      </div>
    </section>
  );
}

export function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % TESTIMONIALS.length), 6500);
    return () => clearInterval(t);
  }, []);
  const t = TESTIMONIALS[i];
  if (!t) return null;
  return (
    <section className="mx-auto max-w-5xl px-6 py-32 text-center">
      <Quote className="mx-auto h-10 w-10 text-burgundy-bright" />
      <div className="relative mt-10 min-h-[14rem]">
        <AnimatePresence mode="wait">
          <motion.figure key={i} initial={{ opacity: 0, y: 30, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -30, filter: "blur(8px)" }} transition={{ duration: 0.9 }}>
            <blockquote className="font-display text-[clamp(2rem,4.5vw,3.75rem)] uppercase leading-[0.95]">“{t.quote}”</blockquote>
            <figcaption className="mt-8 text-xs uppercase tracking-[0.25em] text-muted-foreground">{t.name} · <span className="text-mustard">{t.org}</span></figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>
      <div className="mt-8 flex justify-center gap-3">
        {TESTIMONIALS.map((_, k) => (
          <button key={k} aria-label={`Testimonial ${k + 1}`} onClick={() => setI(k)} className={`h-1 transition-all ${k === i ? "w-12 bg-primary" : "w-6 bg-border"}`} />
        ))}
      </div>
      <div className="mt-6"><MockLabel>Illustrative testimonials</MockLabel></div>
    </section>
  );
}

export function PartsSearch({ placement = "home-parts" }: { placement?: "home-parts" | "services-parts" }) {
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <Reveal className="glass relative overflow-hidden border border-border p-10 md:p-16">
        <img src={PLACEMENT_IMAGES[placement].src} alt={PLACEMENT_IMAGES[placement].alt} width={1536} height={1024} loading="lazy" className="mb-6 h-24 w-36 border border-border object-cover md:float-right md:mb-0 md:ml-8 md:h-32 md:w-48" />
        <p className="eyebrow">Quick parts enquiry</p>
        <h2 className="mt-6 text-[clamp(2.5rem,5vw,4.5rem)] uppercase">Know the part number?</h2>
        <p className="mt-4 max-w-lg text-muted-foreground">Type the part number, maker or model and send it straight to our sourcing desk.</p>
        <form onSubmit={(e) => { e.preventDefault(); void navigate({ to: "/enquiry", search: { part: q.trim() } }); }} className="relative mt-10 flex flex-col gap-3 sm:flex-row">
          <label className="flex flex-1 items-center gap-3 border border-input bg-muted px-5">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. MAN B&W 90510-0123, Yanmar 6EY18 fuel pump" aria-label="Part number or maker" className="w-full bg-transparent py-4 text-foreground outline-none placeholder:text-muted-foreground" />
          </label>
          <Button type="submit" className="h-auto rounded-none px-8 py-4 text-xs font-bold uppercase tracking-[0.2em]">Send enquiry <ArrowUpRight /></Button>
        </form>
      </Reveal>
    </section>
  );
}

export function ShanghaiClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = now ? new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Shanghai", hour: "2-digit", minute: "2-digit", second: "2-digit" }).format(now) : "--:--:--";
  return (
    <div className="flex items-center gap-4 border border-border px-5 py-4">
      <span className="relative flex h-3 w-3"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" /><span className="relative inline-flex h-3 w-3 rounded-full bg-primary" /></span>
      <div>
        <p className="font-display text-3xl leading-none tabular-nums">{time} <span className="text-base text-muted-foreground">China</span></p>
        <p className="mt-1 text-[0.65rem] uppercase tracking-[0.25em] text-mustard">Enquiries acknowledged within 2 hours</p>
      </div>
    </div>
  );
}

export function FaqList() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-border border-y border-border">
      {FAQ.map((f, i) => (
        <div key={f.q}>
          <button onClick={() => setOpen(open === i ? null : i)} aria-expanded={open === i} className="flex w-full items-center justify-between gap-6 py-7 text-left">
            <span className="font-display text-3xl uppercase">{f.q}</span>
            <Plus className={`h-6 w-6 shrink-0 text-primary transition-transform duration-500 ${open === i ? "rotate-45 text-mustard" : ""}`} />
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5 }} className="overflow-hidden pb-7 pr-12 text-muted-foreground">
                {f.a}
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

export function CtaBand({ onQuote, children = "Tell us what the vessel needs." }: { onQuote: () => void; children?: ReactNode }) {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24 print:hidden">
      <Reveal className="flex flex-col items-start justify-between gap-8 border-t border-border pt-16 md:flex-row md:items-end">
        <h2 className="text-[clamp(3rem,7vw,6rem)] uppercase">{children}</h2>
        <Button onClick={onQuote} className="h-auto rounded-none inline-flex items-center gap-3 bg-primary px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground hover:shadow-glow">Request a Quote <ArrowUpRight className="h-4 w-4" /></Button>
      </Reveal>
    </section>
  );
}
