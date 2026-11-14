import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import daylight from "@/assets/china-daylight-vessel.jpg";
import { CONTACT, HERO_FACTS } from "./content";

export function Hero({ onQuote }: { onQuote: () => void }) {
  return (
    <section id="top" className="daylight-hero relative isolate overflow-hidden bg-background text-foreground">
      <img src={daylight} alt="Cargo vessel underway in clear daylight off the China coast" width={1920} height={1088} fetchPriority="high" className="absolute inset-0 -z-10 h-full w-full object-cover object-[65%_center]" />
      <div className="daylight-wash absolute inset-0 -z-10" />
      <div className="mx-auto flex min-h-[760px] max-w-7xl flex-col justify-center px-6 pb-16 pt-36 3xl:mx-0 3xl:max-w-none 3xl:px-[7vw]">
        <p className="eyebrow mb-6 max-w-xl leading-relaxed">China · Engineering · Supply · Solutions</p>
        <h1 className="max-w-3xl text-[2.6rem] uppercase sm:text-5xl lg:text-7xl">
          <span className="block">Ship spares,</span>
          <span className="block">repairs &amp; docking</span>
          <span className="block text-burgundy">in any Chinese port.</span>
        </h1>
        <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground">Led by former seafarers and marine surveyors. Send the maker, model or part number: we source, inspect and deliver to the vessel, and put engineers on board when the job needs them.</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {/* On phones the fixed action bar already carries Send enquiry and Email. */}
          <Button size="lg" onClick={onQuote} className="hidden h-auto rounded-none px-6 py-4 sm:inline-flex text-xs font-bold uppercase tracking-widest">Send enquiry <ArrowUpRight /></Button>
          <Button asChild variant="outline" size="lg" className="h-auto rounded-none px-6 py-4 text-xs font-bold uppercase tracking-widest"><Link to="/services">Explore Services <ArrowUpRight /></Link></Button>
        </div>
        <p className="mt-4 hidden text-sm text-muted-foreground sm:block">
          Or email <a href={`mailto:${CONTACT.email}`} className="font-semibold text-foreground underline underline-offset-4 hover:text-primary">{CONTACT.email}</a>
        </p>
        <dl className="mt-10 grid max-w-lg grid-cols-[auto_auto_auto] justify-between gap-x-6 border-t border-foreground/20 pt-6">
          {HERO_FACTS.map((fact) => (
            <div key={fact.label} className="flex flex-col-reverse justify-end">
              <dt className="mt-2 max-w-[8.5rem] text-[0.65rem] font-semibold uppercase leading-snug tracking-[0.18em] text-muted-foreground">{fact.label}</dt>
              <dd className="whitespace-nowrap font-display text-3xl uppercase leading-none text-foreground sm:text-4xl">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
