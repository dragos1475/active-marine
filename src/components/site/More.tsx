import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, MapPin, Ship, ArrowUpRight } from "lucide-react";
import { Reveal } from "./Reveal";
import { TEAM, CASES, MAKERS, CERTS, PORTS, CLIENTS, CONTACT } from "./content";

export function MockLabel({ children = "Illustrative mockup" }: { children?: string }) {
  return <span className="inline-block border border-input px-2 py-1 text-[0.6rem] uppercase tracking-[0.25em] text-muted-foreground">{children}</span>;
}

export function Team() {
  return (
    <section id="team" className="mx-auto max-w-7xl px-6 py-32">
      <Reveal className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">The people</p>
          <h2 className="mt-6 text-[clamp(3rem,7vw,6rem)] uppercase">Seafarers first.<br /><span className="text-tide">Then specialists.</span></h2>
        </div>
        <MockLabel>Illustrative names — replace with real team</MockLabel>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TEAM.map((m, i) => (
          <Reveal key={m.name} delay={i * 0.1}>
            <motion.article whileHover={{ y: -8 }} className="group relative h-full overflow-hidden border border-border bg-card p-8">
              <div className="relative mb-10 flex aspect-square items-center justify-center overflow-hidden bg-secondary">
                <div className="absolute inset-0 bg-tide opacity-0 transition-opacity duration-700 group-hover:opacity-40" />
                <span className="relative font-display text-8xl text-primary">{m.initials}</span>
              </div>
              <p className="eyebrow">{m.role}</p>
              <h3 className="mt-3 text-3xl uppercase">{m.name}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{m.bio}</p>
            </motion.article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

export function Cases() {
  return (
    <section id="cases" className="bg-abyss py-32">
      <div className="mx-auto max-w-7xl px-6">
        <Reveal className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow">Selected work</p>
            <h2 className="mt-6 text-[clamp(3rem,7vw,6rem)] uppercase">Problem. Action.<br /><span className="text-tide">Vessel moving.</span></h2>
          </div>
          <MockLabel>Example cases — replace with real projects</MockLabel>
        </Reveal>
        <div className="grid gap-4 lg:grid-cols-3">
          {CASES.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.12} className="group flex flex-col border border-border bg-card p-8 transition-colors hover:border-primary">
              <div className="flex items-center justify-between">
                <span className="eyebrow">{c.tag}</span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{c.port}</span>
              </div>
              <h3 className="mt-6 text-4xl uppercase">{c.title}</h3>
              <dl className="mt-8 space-y-5 text-sm">
                {[["Problem", c.problem], ["What we did", c.action], ["Result", c.result]].map(([k, v], j) => (
                  <div key={k} className="grid grid-cols-[2rem_1fr] gap-3">
                    <span className="font-display text-2xl text-primary">0{j + 1}</span>
                    <div><dt className="text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">{k}</dt><dd className={`mt-1 ${j === 2 ? "text-primary" : ""}`}>{v}</dd></div>
                  </div>
                ))}
              </dl>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Makers() {
  const items = [...MAKERS, ...MAKERS];
  return (
    <section className="border-y border-border py-16">
      <div className="mx-auto mb-8 flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6">
        <p className="eyebrow">Makers we source for</p>
        <div className="flex flex-wrap gap-2">{CERTS.map((c) => <MockLabel key={c}>{c}</MockLabel>)}</div>
      </div>
      <div className="overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="flex w-max animate-marquee gap-16">
          {items.map((m, i) => (
            <span key={i} className="whitespace-nowrap font-display text-3xl uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground">{m}</span>
          ))}
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-7xl px-6 text-xs text-muted-foreground">Trademarks belong to their owners and are shown to indicate equipment we source parts for, not partnership.</p>
    </section>
  );
}

// Very simplified, stylised outline of China's eastern coast (decorative, not to scale).
const COAST = "M40 8 L58 6 L70 12 L78 16 L74 22 L66 24 L64 28 L70 30 L72 36 L66 40 L72 46 L78 50 L80 56 L78 62 L74 68 L72 74 L66 80 L60 86 L52 90 L44 92 L36 88 L30 80 L26 66 L22 50 L26 34 L32 20 Z";

export function PortsMap() {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <section id="network" className="mx-auto max-w-7xl px-6 py-32">
      <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">Where we work</p>
          <h2 className="mt-6 text-[clamp(3rem,7vw,6rem)] uppercase">Every major port.<br /><span className="text-tide">One point of contact.</span></h2>
        </div>
        <MockLabel>Client names illustrative</MockLabel>
      </Reveal>
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Reveal className="relative aspect-[4/3] overflow-hidden border border-border bg-abyss">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            <defs>
              <pattern id="grid" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M5 0H0V5" className="stroke-border" strokeWidth="0.15" fill="none" /></pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
            <motion.path d={COAST} className="fill-muted stroke-primary" strokeWidth="0.3" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 3, ease: "easeInOut" }} />
            {PORTS.filter((p) => !p.hq).map((p) => {
              const hq = PORTS.find((x) => x.hq)!;
              return <motion.path key={p.name} d={`M${hq.x} ${hq.y} Q ${(hq.x + p.x) / 2 + 10} ${(hq.y + p.y) / 2} ${p.x} ${p.y}`} className="stroke-accent" strokeWidth="0.25" strokeDasharray="1 1" fill="none" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 2, delay: 1.5 }} />;
            })}
          </svg>
          {PORTS.map((p, i) => {
            const clients = CLIENTS.filter((c) => c.port === p.name);
            const active = hover === p.name;
            return (
              <motion.button
                key={p.name}
                initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.2 + i * 0.12, type: "spring" }}
                onMouseEnter={() => setHover(p.name)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(p.name)} onBlur={() => setHover(null)}
                className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${p.x}%`, top: `${p.y}%` }} aria-label={p.name}
              >
                <span className={`relative flex items-center justify-center rounded-full ${p.hq ? "h-5 w-5 bg-primary shadow-glow" : "h-3 w-3 bg-accent"}`}>
                  <span className="absolute inset-0 animate-ping rounded-full bg-primary opacity-40" />
                </span>
                <span className={`absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap text-[0.65rem] uppercase tracking-[0.2em] ${p.hq ? "text-primary" : "text-foreground"}`}>{p.name}{p.hq ? " · HQ" : ""}</span>
                <AnimatePresence>
                  {active && clients.length > 0 && (
                    <motion.span initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass absolute bottom-6 left-1/2 z-10 block w-44 -translate-x-1/2 border border-border p-3 text-left">
                      {clients.map((c) => <span key={c.name} className="block text-xs"><Ship className="mr-1 inline h-3 w-3 text-primary" />{c.name} <span className="text-muted-foreground">· {c.vessel}</span></span>)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </Reveal>
        <Reveal delay={0.2} className="flex flex-col gap-3">
          {CLIENTS.map((c) => (
            <div key={c.name} onMouseEnter={() => setHover(c.port)} onMouseLeave={() => setHover(null)} className={`flex items-center justify-between border p-5 transition-colors ${hover === c.port ? "border-primary bg-card" : "border-border"}`}>
              <div className="flex items-center gap-4">
                <span className="flex h-10 w-10 items-center justify-center bg-secondary font-display text-xl text-primary">{c.name.split(" ").map((w) => w[0]).join("")}</span>
                <div><div className="font-semibold">{c.name}</div><div className="text-xs text-muted-foreground">{c.vessel}</div></div>
              </div>
              <span className="flex items-center gap-1 text-xs uppercase tracking-[0.2em] text-muted-foreground"><MapPin className="h-3 w-3 text-primary" />{c.port}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function FloatingChat() {
  const [open, setOpen] = useState(false);
  const wa = CONTACT.whatsapp.replace(/\D/g, "");
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }} className="glass w-72 border border-border p-5 shadow-deep">
            <p className="eyebrow">Talk to us now</p>
            <a href={`https://wa.me/${wa}`} target="_blank" rel="noreferrer" className="mt-4 flex items-center justify-between border border-border p-4 transition-colors hover:border-primary">
              <span><span className="block font-semibold">WhatsApp</span><span className="text-xs text-muted-foreground">{CONTACT.whatsapp}</span></span><ArrowUpRight className="h-4 w-4 text-primary" />
            </a>
            <div className="mt-2 border border-border p-4">
              <span className="block font-semibold">WeChat</span><span className="text-xs text-muted-foreground">ID: {CONTACT.wechat}</span>
            </div>
            <a href={`mailto:${CONTACT.email}`} className="mt-2 flex items-center justify-between border border-border p-4 transition-colors hover:border-primary">
              <span><span className="block font-semibold">Email</span><span className="text-xs text-muted-foreground">{CONTACT.email}</span></span><ArrowUpRight className="h-4 w-4 text-primary" />
            </a>
            {CONTACT.placeholder && <p className="mt-3 text-[0.65rem] text-muted-foreground">WhatsApp and WeChat are placeholders.</p>}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.5, type: "spring" }} onClick={() => setOpen(!open)} aria-label={open ? "Close chat options" : "Open chat options"} className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow">
        {open ? <X /> : <MessageCircle />}
      </motion.button>
    </div>
  );
}
