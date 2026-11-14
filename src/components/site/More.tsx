import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, X, MapPin, ArrowUp, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getPortWind } from "@/lib/port-wind.functions";
import { Link } from "@tanstack/react-router";
import { PortPanel } from "./PortPanel";
import { Reveal } from "./Reveal";
import { TEAM, CASES, MAKERS, CERTS, PORTS, CONTACT } from "./content";
import { PLACEMENT_IMAGES } from "./imagery";

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
              <img src={PLACEMENT_IMAGES[`case-${i}` as "case-0" | "case-1" | "case-2"].src} alt={["Illustrative marine spare parts", "Illustrative marine engine equipment", "Illustrative ship in dry dock"][i]} loading="lazy" width={1536} height={1024} className="mb-6 h-24 w-36 border border-border object-cover" />
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


const chinaTime = (iso: string) => new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Shanghai", weekday: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

export function PortsMap() {
  const [selected, setSelected] = useState<string | null>(null);
  // Fetched in the browser after the page is up, so a slow or failed forecast never holds the page back.
  const { data, isPending, isError } = useQuery({ queryKey: ["port-wind"], queryFn: () => getPortWind(), staleTime: 30 * 60 * 1000, retry: 1 });
  const wind = new Map((data?.ports ?? []).map((entry) => [entry.name, entry]));
  const validAt = data?.ports[0]?.validAt;
  const cellHead = "px-2 py-3 text-left sm:px-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground";
  return (
    <section id="network" className="mx-auto max-w-7xl px-6 py-12">
      <Reveal className="mb-8">
        <p className="eyebrow">Where we work</p>
        <h2 className="mt-4 text-3xl uppercase md:text-5xl">All Chinese ports.<br /><span className="text-tide">Including Hong Kong.</span></h2>
      </Reveal>
      {/* Map and wind table sit side by side on wide screens, so both are visible without scrolling. */}
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start">
      <div className="border border-border bg-abyss p-4 sm:p-6">
        <svg viewBox="0 0 700 740" role="img" aria-label="China coast with Dalian, Tianjin, Qingdao, Shanghai, Ningbo, Zhoushan, Xiamen, Guangzhou, Shenzhen and Hong Kong">
          <path d="M30 20H290L340 75L400 115L430 145L390 175L350 190L370 230L420 265L390 300L420 350L450 395L435 440L410 480L380 530L335 575L300 615L230 655L160 690H30Z" className="fill-muted stroke-primary" strokeWidth="2" />
          <text x="130" y="340" className="fill-muted-foreground" fontSize="35">CHINA</text>
          {PORTS.map((p, i) => {
            const x = p.x * 5.5;
            const y = p.y * 7;
            const labelY = 75 + i * 66;
            const here = wind.get(p.name);
            // Clicking a port on the map is a shortcut; the table under the map is the accessible route.
            return <g key={p.name} onClick={() => setSelected(p.name)} className="group cursor-pointer">
              <path d={`M${x} ${y} L475 ${labelY} H510`} fill="none" className="stroke-border group-hover:stroke-primary" strokeWidth="2" />
              <circle cx={x} cy={y} r="6" className="fill-primary" />
              <rect x="505" y={labelY - 24} width="190" height="56" fill="transparent" />
              <text x="525" y={labelY + 8} className="fill-foreground group-hover:fill-primary" fontSize="24">{p.name}</text>
              {here && <text x="525" y={labelY + 28} className="fill-muted-foreground" fontSize="15">{here.speedKn} kn {here.compass}</text>}
            </g>;
          })}
        </svg>
        <p className="mt-4 text-xs text-muted-foreground">Selected ports shown · Schematic coast, not to scale · Coverage throughout China</p>
      </div>
      <div>
        <p className="eyebrow">Wind at the ports</p>
        <p className="mt-3 text-sm text-muted-foreground">
          {validAt ? `Forecast for the hour from ${chinaTime(validAt)}, China time.` : isPending ? "Loading the wind forecast…" : "The wind forecast is not available right now."}
          {" "}Select a port for its 48-hour outlook; for any other Chinese port, name it in the enquiry.
        </p>
        <div className="mt-5 border border-border">
          <table className="w-full border-collapse text-sm">
            <thead className="border-b border-border bg-muted">
              <tr>
                <th scope="col" className={cellHead}>Port</th>
                <th scope="col" className={cellHead}>Wind</th>
                <th scope="col" className={cellHead}>From</th>
                <th scope="col" className={cellHead}><span className="sm:hidden">Bft</span><span className="hidden sm:inline">Beaufort</span></th>
                <th scope="col" className={cellHead}><span className="sr-only">Enquiry</span></th>
              </tr>
            </thead>
            <tbody>
              {PORTS.map((p) => {
                const here = wind.get(p.name);
                const blank = isPending ? "…" : "—";
                return (
                  <tr key={p.name} className="border-b border-border last:border-0">
                    <th scope="row" className="px-2 py-3 text-left sm:px-3">
                      <button type="button" onClick={() => setSelected(p.name)} aria-haspopup="dialog" className="font-semibold text-foreground underline decoration-border underline-offset-4 hover:text-primary hover:decoration-primary">{p.name}</button>
                    </th>
                    <td className="px-2 py-3 tabular-nums sm:px-3">{here ? `${here.speedKn} kn` : blank}</td>
                    <td className="px-2 py-3 sm:px-3">
                      {here ? (
                        <span className="inline-flex items-center gap-2">
                          {/* The arrow points where the wind is going, as on a weather chart. */}
                          <ArrowUp aria-hidden="true" className="h-4 w-4 text-primary" style={{ transform: `rotate(${here.directionDeg + 180}deg)` }} />
                          {here.compass} <span className="hidden text-muted-foreground tabular-nums sm:inline">{here.directionDeg}°</span>
                        </span>
                      ) : blank}
                    </td>
                    <td className="px-2 py-3 tabular-nums sm:px-3">{here ? <><span className="hidden sm:inline">Force </span>{here.beaufort}</> : blank}</td>
                    <td className="px-2 py-3 text-right sm:px-3">
                      <Link to="/enquiry" search={{ part: "", port: p.name }} className="inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-bold uppercase tracking-[0.18em] text-primary hover:text-foreground">
                        <span className="sr-only sm:not-sr-only">Enquiry</span> <ArrowUpRight className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {isError && "The forecast could not be loaded. "}
          Indicative forecast at the port approaches, not for navigation. Wind data from{" "}
          <a href="https://api.met.no/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-primary">MET Norway</a>, licensed under{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-primary">CC BY 4.0</a>.
        </p>
      </div>
      </div>
      <PortPanel port={selected} wind={selected ? wind.get(selected) : undefined} loading={isPending} onClose={() => setSelected(null)} />
    </section>
  );
}

export function FloatingChat({ raised = false }: { raised?: boolean }) {
  const [open, setOpen] = useState(false);
  const wa = CONTACT.whatsapp.replace(/\D/g, "");
  return (
    <div className={`fixed right-6 z-40 flex flex-col items-end gap-3 print:hidden ${raised ? "bottom-24 sm:bottom-6" : "bottom-6"}`}>
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
