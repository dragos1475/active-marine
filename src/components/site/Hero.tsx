import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import daylight from "@/assets/china-daylight-vessel.jpg";

export function Hero({ onQuote }: { onQuote: () => void }) {
  return (
    <section id="top" className="daylight-hero relative isolate overflow-hidden bg-background text-foreground">
      <img src={daylight} alt="Cargo vessel underway in clear daylight off the China coast" width={1920} height={1088} fetchPriority="high" className="absolute inset-0 -z-10 h-full w-full object-cover object-[65%_center]" />
      <div className="daylight-wash absolute inset-0 -z-10" />
      <div className="mx-auto flex min-h-[760px] max-w-7xl flex-col justify-center px-6 pb-20 pt-36 3xl:mx-0 3xl:max-w-none 3xl:px-[7vw]">
        <p className="eyebrow mb-6 max-w-xl leading-relaxed">China · Engineering · Supply · Solutions</p>
        <h1 className="max-w-2xl text-6xl uppercase sm:text-8xl lg:text-9xl">Marine<br />Expertise<br /><span className="text-burgundy">in Action.</span></h1>
        <p className="mt-7 max-w-md text-lg leading-relaxed text-muted-foreground">Led by former seafarers and marine surveyors. Practical engineering, dependable marine supply and responsive technical solutions for vessels and operators.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg" className="h-auto rounded-none px-6 py-4 text-xs font-bold uppercase tracking-widest"><Link to="/services">Explore Solutions <ArrowUpRight /></Link></Button>
          <Button variant="outline" size="lg" onClick={onQuote} className="h-auto rounded-none px-6 py-4 text-xs font-bold uppercase tracking-widest">Send Enquiry <ArrowUpRight /></Button>
        </div>
      </div>
    </section>
  );
}
