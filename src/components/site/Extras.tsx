import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion, useInView, AnimatePresence } from "motion/react";
import { ArrowUpRight, Plus, Search, Quote } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal } from "./Reveal";
import { MockLabel } from "./More";
import { CONTACT, FAQ, SERVICES, STATS, TESTIMONIALS, TIMELINE } from "./content";

export function PageHero({ eyebrow, title, accent, text, image }: { eyebrow: string; title: string; accent: string; text?: string; image?: string }) {
  return (
    <section className="relative overflow-hidden pb-20 pt-40">
      {image && (
        <>
          <motion.img src={image} alt="" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 2.4, ease: [0.16, 1, 0.3, 1] }} className="absolute inset-0 h-full w-full object-cover opacity-35" />
          <div className="absolute inset-0 bg-veil" />
        </>
      )}
      <div className="relative mx-auto max-w-7xl px-6">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="mt-6 text-[clamp(3.5rem,10vw,9rem)] uppercase">{title}<br /><span className="text-tide">{accent}</span></h1>
          {text && <p className="mt-8 max-w-xl text-lg text-muted-foreground">{text}</p>}
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

export function ServicesTeaser() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <h2 className="text-[clamp(3rem,7vw,6rem)] uppercase">Six ways<br />we keep you moving.</h2>
        <Link to="/services" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">All services <ArrowUpRight className="h-4 w-4" /></Link>
      </Reveal>
      <div className="grid gap-px border border-border bg-border md:grid-cols-3">
        {SERVICES.map((s, i) => (
          <Reveal key={s.slug} delay={(i % 3) * 0.08} className="bg-background">
            <Link to="/services/$slug" params={{ slug: s.slug }} className="group flex h-full flex-col p-8 transition-colors hover:bg-card">
              <span className="font-display text-5xl text-muted-foreground transition-colors group-hover:text-mustard">{s.n}</span>
              <span className="mt-6 font-display text-3xl uppercase">{s.title}</span>
              <span className="mt-3 text-sm text-muted-foreground">{s.tag}</span>
              <ArrowUpRight className="mt-6 h-5 w-5 text-primary transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
            </Link>
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
  const t = TESTIMONIALS[i]!;
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

export function PartsSearch() {
  const [q, setQ] = useState("");
  const href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(`Part enquiry: ${q}`)}&body=${encodeURIComponent(`Part number / maker: ${q}\nVessel:\nQuantity:\nDelivery port:\n`)}`;
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <Reveal className="glass relative overflow-hidden border border-border p-10 md:p-16">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-burgundy opacity-30 blur-3xl" />
        <p className="eyebrow">Quick parts enquiry</p>
        <h2 className="mt-6 text-[clamp(2.5rem,5vw,4.5rem)] uppercase">Know the part number?</h2>
        <p className="mt-4 max-w-lg text-muted-foreground">Type the part number, maker or model and send it straight to our sourcing desk.</p>
        <form onSubmit={(e) => { e.preventDefault(); if (q.trim()) window.location.href = href; }} className="relative mt-10 flex flex-col gap-3 sm:flex-row">
          <label className="flex flex-1 items-center gap-3 border border-input bg-muted px-5">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. MAN B&W 90510-0123, Yanmar 6EY18 fuel pump" aria-label="Part number or maker" className="w-full bg-transparent py-4 text-foreground outline-none placeholder:text-muted-foreground" />
          </label>
          <button type="submit" className="bg-primary px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground hover:shadow-glow">Send enquiry</button>
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
        <p className="font-display text-3xl leading-none tabular-nums">{time} <span className="text-base text-muted-foreground">Shanghai</span></p>
        <p className="mt-1 text-[0.65rem] uppercase tracking-[0.25em] text-mustard">Available now · 24/7 response</p>
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
    <section className="mx-auto max-w-7xl px-6 py-24">
      <Reveal className="flex flex-col items-start justify-between gap-8 border-t border-border pt-16 md:flex-row md:items-end">
        <h2 className="text-[clamp(3rem,7vw,6rem)] uppercase">{children}</h2>
        <button onClick={onQuote} className="inline-flex items-center gap-3 bg-primary px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground hover:shadow-glow">Request a Quote <ArrowUpRight className="h-4 w-4" /></button>
      </Reveal>
    </section>
  );
}
