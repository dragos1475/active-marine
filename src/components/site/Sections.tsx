import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowUpRight, Check, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Reveal, Logo } from "./Reveal";
import { CONTACT, SERVICES, STEPS, TAGS, NAV } from "./content";
import { LIST_SERVICE_IMAGES, PLACEMENT_IMAGES } from "./imagery";
import approachWide from "@/assets/about-logistics-underway.jpg";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-32">
      <div className="grid gap-16 lg:grid-cols-12">
        <Reveal className="lg:col-span-7">
          <p className="eyebrow">Who we are</p>
          <h2 className="mt-6 text-[clamp(3.5rem,8vw,7.5rem)] uppercase">
            One partner.<br /><span className="text-tide">Several solutions.</span>
          </h2>
        </Reveal>
        <Reveal delay={0.2} className="flex flex-col justify-end gap-6 text-lg font-light leading-relaxed text-muted-foreground lg:col-span-5">
          <p>
            Run by former seafarers and marine surveyors, ActivMarine brings first-hand operational experience, technical understanding, marine equipment sourcing and service coordination together in one focused offering.
          </p>
          <p>
            Our presence in China puts us closer to the manufacturers and shipyards your vessel depends on — fewer layers between you and the people doing the work.
          </p>
        </Reveal>
      </div>
      <div className="mt-24 grid grid-cols-2 gap-px bg-border md:grid-cols-4">
        {[["06", "Connected services"], ["CN", "Nationwide reach"], ["1:1", "Direct to manufacturers"], ["24/7", "Operational mindset"]].map(([k, v], i) => (
          <Reveal key={v} delay={i * 0.1} className="bg-background p-8">
            <div className="text-tide font-display text-6xl">{k}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">{v}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/** Services overview as a dense list: what it is, what it covers, and the two next steps. */
export function Services() {
  return (
    <section id="solutions" className="mx-auto max-w-7xl px-6 pb-16 pt-20 md:pt-24">
      <Reveal className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow">What we do</p>
          <h1 className="mt-6 text-[clamp(2.5rem,5vw,4.5rem)] uppercase">Solutions for every<br />operational challenge.</h1>
        </div>
        <p className="max-w-xs text-muted-foreground">Six connected areas of support designed around the practical demands of shipping and ship management.</p>
      </Reveal>
      <div className="border-t border-border">
        {SERVICES.map((s) => (
          <article key={s.slug} className="grid gap-5 border-b border-border py-7 md:grid-cols-[9rem_1fr_1.3fr_10rem] md:gap-8">
            <img src={LIST_SERVICE_IMAGES[s.slug]?.src} alt={LIST_SERVICE_IMAGES[s.slug]?.alt} loading="lazy" width={1536} height={1024} className="hidden h-24 w-36 border border-border object-cover md:block" />
            <div>
              <p className="eyebrow">{s.n} / {s.tag}</p>
              <h2 className="mt-3 text-3xl uppercase">{s.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{s.ask}</p>
            </div>
            <div>
              <p className="text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              <ul className="mt-3 grid gap-x-6 gap-y-1 text-sm sm:grid-cols-2">
                {s.points.map((point) => <li key={point} className="flex items-start gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-mustard" />{point}</li>)}
              </ul>
            </div>
            <div className="flex flex-wrap items-start gap-x-6 gap-y-3 md:flex-col">
              <Link to="/enquiry" search={{ part: "", type: s.enquiry }} className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary hover:text-foreground">Send enquiry <ArrowUpRight className="h-4 w-4" /></Link>
              <Link to="/services/$slug" params={{ slug: s.slug }} className="text-sm text-muted-foreground underline underline-offset-4 hover:text-primary">Service sheet</Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Approach() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  return (
    <section id="approach" className="py-32">
      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-2">
        <Reveal className="lg:sticky lg:top-32 lg:self-start">
          <p className="eyebrow">Our approach</p>
          <h2 className="mt-6 text-[clamp(3rem,7vw,6rem)] uppercase">From the first request<br /><span className="text-tide">to the vessel.</span></h2>
          <p className="mt-8 max-w-md text-lg font-light text-muted-foreground">
            Every requirement is different. Our workflow centres on specification, suitability and coordination — the details that matter when a ship is waiting.
          </p>
        </Reveal>
        <div className="space-y-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1} className="group border border-border bg-card p-10 transition-colors hover:border-primary">
              <div className="flex items-start justify-between gap-6"><div className="text-tide font-display text-8xl">{s.n}</div><img src={PLACEMENT_IMAGES[`approach-${i}` as "approach-0" | "approach-1" | "approach-2"].src} alt={["Illustrative marine spare parts", "Illustrative marine engine", "Illustrative vessel delivery terminal"][i]} loading="lazy" width={1536} height={1024} className="h-20 w-28 shrink-0 border border-border object-cover sm:h-24 sm:w-36" /></div>
              <h3 className="mt-4 text-4xl uppercase">{s.title}</h3>
              <p className="mt-3 text-muted-foreground">{s.text}</p>
            </Reveal>
          ))}
          <Reveal className="border-l-2 border-primary bg-muted p-8 text-muted-foreground">
            <strong className="text-foreground">Have a technical enquiry?</strong> Send the maker, model, part number or the problem to be solved. The more detail, the better the starting point.
          </Reveal>
        </div>
      </div>
      <div ref={ref} className="relative mt-32 h-[80vh] overflow-hidden">
        <motion.img style={{ y }} src={approachWide} alt="Illustrative container vessel and port logistics in daylight" loading="lazy" className="absolute inset-0 h-[130%] w-full -translate-y-[15%] object-cover" />
        <div className="absolute inset-0 bg-veil" />
        <div className="absolute bottom-10 left-6 right-6 mx-auto max-w-7xl">
          <p className="font-display text-[clamp(2.5rem,6vw,5rem)] uppercase">Keeping the maritime world moving.</p>
          <p className="mt-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">Port logistics · Illustrative visual</p>
        </div>
      </div>
    </section>
  );
}

export function China() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-25, 25]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  return (
    <section ref={ref} id="china" className="grain relative overflow-hidden py-40">
      <motion.img style={{ y: bgY }} src={PLACEMENT_IMAGES["network-background"].src} alt="" loading="lazy" className="absolute inset-0 h-[120%] w-full object-cover opacity-30" />
      <div className="absolute inset-0 bg-veil" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">Based in China · Supporting you across China</p>
          <h2 className="mt-6 text-[clamp(3rem,7vw,6.5rem)] uppercase">Closer to the source.<br /><span className="text-tide">A clear advantage for your fleet.</span></h2>
          <p className="mt-8 max-w-lg text-lg font-light leading-relaxed text-muted-foreground">
            Through direct contact with manufacturers and coordination with local suppliers and shipyards, we support spare-parts sourcing, repairs and docking wherever your vessel needs us in China.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {TAGS.map((t) => (
              <span key={t} className="glass border border-input px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em]">{t}</span>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.2} className="relative mx-auto aspect-square w-full max-w-lg">
          <motion.div style={{ rotate }} className="absolute -inset-6 rounded-full border border-dashed border-primary/40" />
          <div className="absolute -inset-12 rounded-full border border-border" />
          <img src={PLACEMENT_IMAGES["network-parts"].src} alt="Marine spare parts: cylinder liner, pistons, pump, valves and electronics" loading="lazy" className="relative h-full w-full rounded-full object-cover shadow-glow" />
          <p className="mt-14 text-center text-xs uppercase tracking-[0.25em] text-muted-foreground">Cylinder liners · Pistons · Pumps · Valves · Electronics</p>
        </Reveal>
      </div>
    </section>
  );
}

export function Contact({ onQuote }: { onQuote: () => void }) {
  return (
    <section id="contact" className="relative overflow-hidden py-32">
      <div className="relative mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-2">
        <Reveal>
          <p className="eyebrow">Contact ActivMarine</p>
          <h2 className="mt-6 text-[clamp(3.5rem,9vw,8rem)] uppercase">Tell us what<br /><span className="text-tide">your vessel needs.</span></h2>
          <p className="mt-6 max-w-md text-muted-foreground">Speak with our team about spare parts, technical services, docking or marine surveys.</p>
          <a href={`mailto:${CONTACT.email}`} className="mt-8 inline-flex items-center gap-3 font-display text-[clamp(1.8rem,3.5vw,3rem)] text-primary hover:underline">
            <Mail className="h-8 w-8" /> {CONTACT.email}
          </a>
          <div className="mt-8">
            <Button onClick={onQuote} className="h-auto rounded-none group inline-flex items-center gap-3 bg-primary px-8 py-5 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground transition-all hover:shadow-glow">
              Request a Quote <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.2} className="glass self-end border border-border p-10 shadow-deep">
          <p className="eyebrow">China office</p>
          <h3 className="mt-4 text-4xl uppercase">{CONTACT.company}</h3>
          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            {[["Telephone", CONTACT.phone], ["Email", CONTACT.email], ["WeChat", CONTACT.wechat], ["WhatsApp", CONTACT.whatsapp]].map(([k, v]) => (
              <div key={k}>
                <dt className="text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">{k}</dt>
                <dd className="mt-1 break-words">{v}</dd>
              </div>
            ))}
            <div className="sm:col-span-2">
              <dt className="text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground">Office address</dt>
              <dd className="mt-1">{CONTACT.address.map((l) => <span key={l} className="block">{l}</span>)}</dd>
            </div>
          </dl>
          {CONTACT.placeholder && (
            <p className="mt-8 border-t border-border pt-4 text-xs text-muted-foreground">
              Telephone, WeChat, WhatsApp and address are illustrative placeholders. Company name and email are confirmed.
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border bg-abyss pt-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 pb-16 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-3"><Logo /><span className="font-display text-2xl tracking-[0.12em]">ACTIVMARINE</span></div>
            <p className="mt-6 max-w-xs text-sm text-muted-foreground">Marine engineering, supply and technical solutions shaped around operational needs.</p>
          </div>
          <div>
            <p className="eyebrow">Explore</p>
            {NAV.map((n) => <Link key={n.to} to={n.to} className="mt-3 block text-sm text-muted-foreground hover:text-primary">{n.label}</Link>)}
            <Link to="/privacy" className="mt-3 block text-sm text-muted-foreground hover:text-primary">Privacy policy</Link>
          </div>
          <div>
            <p className="eyebrow">Services</p>
            {SERVICES.map((s) => <Link key={s.n} to="/services/$slug" params={{ slug: s.slug }} className="mt-3 block text-sm text-muted-foreground hover:text-primary">{s.title}</Link>)}
            <a href={`mailto:${CONTACT.email}`} className="mt-3 block text-sm text-primary">{CONTACT.email}</a>
          </div>
        </div>
        <div className="select-none overflow-hidden font-display text-[22vw] leading-[0.8] text-muted opacity-60">ACTIVMARINE</div>
        <div className="flex flex-wrap justify-between gap-4 border-t border-border py-6 text-xs uppercase tracking-[0.2em] text-muted-foreground">
          <span>© 2026 Activ Marine Limited · China</span>
          <span>Keeping the maritime world moving</span>
        </div>
      </div>
    </footer>
  );
}
