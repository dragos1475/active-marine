import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { NAV, NAV_PAGES, CONTACT } from "./content";
import { Logo } from "./Reveal";

export function Header({ onQuote }: { onQuote: () => void }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 40));
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${solid ? "glass border-b border-border" : ""}`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-6 px-6">
        <a href="/#top" className="flex items-center gap-3" aria-label="ActivMarine home">
          <Logo />
          <span className="leading-none">
            <span className="block font-display text-2xl tracking-[0.12em]">ACTIVMARINE</span>
            <span className="block text-[0.55rem] tracking-[0.3em] text-muted-foreground">ENGINEERING · SUPPLY · SOLUTIONS</span>
          </span>
        </a>
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:text-primary">
              {n.label}
            </a>
          ))}
          {NAV_PAGES.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm font-medium tracking-wide text-muted-foreground transition-colors hover:text-primary" activeProps={{ className: "text-primary" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={`mailto:${CONTACT.email}`} className="hidden text-sm font-medium text-primary xl:block">{CONTACT.email}</a>
          <button onClick={onQuote} className="group hidden items-center gap-2 bg-primary px-5 py-3 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground transition-all hover:shadow-glow sm:inline-flex">
            Request a Quote <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </button>
          <button className="p-2 lg:hidden" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
      {open && (
        <nav className="glass border-t border-border px-6 pb-6 lg:hidden">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} onClick={() => setOpen(false)} className="block border-b border-border py-4 font-display text-3xl">
              {n.label}
            </a>
          ))}
          {NAV_PAGES.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block border-b border-border py-4 font-display text-3xl">{n.label}</Link>
          ))}
          <button onClick={() => { setOpen(false); onQuote(); }} className="mt-6 w-full bg-primary py-4 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground">
            Request a Quote
          </button>
        </nav>
      )}
    </motion.header>
  );
}
