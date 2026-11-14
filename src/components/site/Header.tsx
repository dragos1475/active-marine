import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X, ArrowUpRight, ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { NAV, SERVICES, CONTACT } from "./content";
import { Logo } from "./Reveal";

const linkCls = "text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:text-primary";

export function Header({ onQuote }: { onQuote: () => void }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => { setSolid(v > 40); setMega(false); });
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${solid || mega ? "glass border-b border-border" : "bg-background border-b border-border"}`}
      onMouseLeave={() => setMega(false)}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6">
        <Link to="/" className="flex items-center gap-3" aria-label="ActivMarine home">
          <Logo />
          <span className="leading-none">
            <span className="block font-display text-2xl tracking-[0.12em]">ACTIVMARINE</span>
            <span className="block text-[0.55rem] tracking-[0.3em] text-muted-foreground">ENGINEERING · SUPPLY · SOLUTIONS</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 xl:flex" aria-label="Main navigation">
          {NAV.map((n) =>
            n.to === "/services" ? (
              <button key={n.to} onMouseEnter={() => setMega(true)} onClick={() => setMega(!mega)} aria-expanded={mega} className={`${linkCls} inline-flex items-center gap-1`}>
                {n.label} <ChevronDown className={`h-3.5 w-3.5 transition-transform ${mega ? "rotate-180" : ""}`} />
              </button>
            ) : (
              <Link key={n.to} to={n.to} onMouseEnter={() => setMega(false)} className={linkCls} activeProps={{ className: "text-primary" }}>{n.label}</Link>
            ),
          )}
        </nav>
        <div className="flex items-center gap-3">
          <Button onClick={onQuote} className="h-auto rounded-none group hidden items-center gap-2 bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground transition-all hover:shadow-glow sm:inline-flex">
            Request a Quote <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Button>
          <button className="p-2 xl:hidden" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mega && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }} className="hidden border-t border-border xl:block">
            <div className="mx-auto grid max-w-7xl grid-cols-4 gap-8 px-6 py-10">
              <div>
                <p className="eyebrow">Services</p>
                <p className="mt-4 text-sm text-muted-foreground">Six connected areas of support, across China.</p>
                <Link to="/services" onClick={() => setMega(false)} className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">Overview <ArrowUpRight className="h-4 w-4" /></Link>
              </div>
              <div className="col-span-3 grid grid-cols-3 gap-px bg-border">
                {SERVICES.map((s) => (
                  <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} onClick={() => setMega(false)} className="group bg-background p-5 transition-colors hover:bg-card">
                    <span className="font-display text-xl text-muted-foreground group-hover:text-mustard">{s.n}</span>
                    <span className="mt-2 block font-display text-2xl uppercase leading-none">{s.title}</span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.nav initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass max-h-[calc(100svh-5rem)] overflow-y-auto border-t border-border px-6 pb-8 xl:hidden">
            {NAV.map((n, i) => (
              <motion.div key={n.to} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                <Link to={n.to} onClick={() => setOpen(false)} className="block border-b border-border py-4 font-display text-3xl">{n.label}</Link>
                {n.to === "/services" && (
                  <div className="grid grid-cols-2 gap-2 border-b border-border py-3">
                    {SERVICES.map((s) => (
                      <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }} onClick={() => setOpen(false)} className="text-sm text-muted-foreground">{s.title}</Link>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
            <a href={`mailto:${CONTACT.email}`} className="mt-6 block text-sm text-primary">{CONTACT.email}</a>
            <button onClick={() => { setOpen(false); onQuote(); }} className="mt-6 w-full bg-primary py-4 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground">
              Request a Quote
            </button>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
