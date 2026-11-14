import { useEffect, useState } from "react";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { strongest, type PortWind } from "@/lib/port-wind";

const CHINA = "Asia/Shanghai";
const clock = new Intl.DateTimeFormat("en-GB", { timeZone: CHINA, hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
const hourOf = new Intl.DateTimeFormat("en-GB", { timeZone: CHINA, hour: "2-digit", hourCycle: "h23" });
const dayOf = new Intl.DateTimeFormat("en-GB", { timeZone: CHINA, weekday: "short" });

/** Current time in China as HH:MM; null until the page is running in the browser. */
export function useChinaTime(): string | null {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    const tick = () => setTime(clock.format(new Date()));
    tick();
    const timer = setInterval(tick, 20000);
    return () => clearInterval(timer);
  }, []);
  return time;
}

/** Bars are scaled against at least this many knots, so a calm day does not look like a gale. */
const MIN_SCALE_KN = 20;

function Outlook({ wind }: { wind: PortWind }) {
  const scale = Math.max(MIN_SCALE_KN, ...wind.outlook.map((point) => point.speedKn));
  const peak = strongest(wind.outlook);
  return (
    <div>
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Next 48 hours · knots · China time</p>
      <div className="mt-3 overflow-x-auto pb-1">
        <ol className="flex gap-1">
          {wind.outlook.map((point, index) => {
            const date = new Date(point.time);
            const hour = hourOf.format(date);
            // Name the day on the first bar and wherever a new day starts.
            const newDay = index === 0 || Number(hour) < 3;
            return (
              <li key={point.time} className="flex min-w-8 flex-1 flex-col items-center text-center">
                <span className="h-4 text-[0.6rem] font-semibold uppercase tracking-wider text-muted-foreground">{newDay ? dayOf.format(date) : ""}</span>
                <span className="flex h-20 w-full items-end bg-muted" aria-hidden="true">
                  <span className={`w-full ${point.beaufort >= 6 ? "bg-burgundy" : "bg-primary"}`} style={{ height: `${Math.max(4, (point.speedKn / scale) * 100)}%` }} />
                </span>
                <span className="mt-1 text-sm font-semibold tabular-nums text-foreground">{point.speedKn}</span>
                <span className="text-[0.6rem] text-muted-foreground">{point.compass}</span>
                <span className="mt-1 text-[0.65rem] tabular-nums text-muted-foreground">{hour}h</span>
              </li>
            );
          })}
        </ol>
      </div>
      {peak && (
        <p className="mt-3 text-sm text-muted-foreground">
          Strongest in this period: <span className="font-semibold text-foreground">{peak.speedKn} kn from {peak.compass}, force {peak.beaufort}</span>, {dayOf.format(new Date(peak.time))} {hourOf.format(new Date(peak.time))}:00. Force 6 and above is marked in red.
        </p>
      )}
    </div>
  );
}

/** Opens over the Network page when a port is picked: local time, wind now, two-day outlook, enquiry. */
export function PortPanel({ port, wind, loading, onClose }: { port: string | null; wind: PortWind | undefined; loading: boolean; onClose: () => void }) {
  const time = useChinaTime();
  return (
    <Dialog open={port !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[90svh] max-w-2xl gap-6 overflow-y-auto rounded-none p-6 sm:rounded-none sm:p-8">
        <div>
          <p className="eyebrow">Port · China</p>
          <DialogTitle className="mt-3 font-display text-5xl font-normal uppercase leading-none tracking-normal">{port}</DialogTitle>
          <DialogDescription className="mt-3">Local time {time ?? "--:--"}. Wind forecast at the port approach: indicative only, not for navigation.</DialogDescription>
        </div>
        {wind ? (
          <>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-y border-border py-5">
              <p className="font-display text-5xl leading-none text-foreground">{wind.speedKn} <span className="text-2xl text-muted-foreground">kn</span></p>
              <p className="flex items-center gap-2 text-lg text-foreground">
                <ArrowUp aria-hidden="true" className="h-5 w-5 text-primary" style={{ transform: `rotate(${wind.directionDeg + 180}deg)` }} />
                From {wind.compass} <span className="tabular-nums text-muted-foreground">{wind.directionDeg}°</span>
              </p>
              <p className="text-lg text-foreground">Force {wind.beaufort}</p>
            </div>
            <Outlook wind={wind} />
          </>
        ) : (
          <p className="border-y border-border py-5 text-sm text-muted-foreground">{loading ? "Loading the wind forecast…" : "The wind forecast is not available right now."}</p>
        )}
        {port && (
          <Link to="/enquiry" search={{ part: "", port }} className="inline-flex items-center justify-center gap-2 bg-primary px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground hover:shadow-glow">
            Send enquiry for {port} <ArrowUpRight className="h-4 w-4" />
          </Link>
        )}
        <p className="text-xs text-muted-foreground">
          Wind data from <a href="https://api.met.no/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-primary">MET Norway</a>, licensed under{" "}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-primary">CC BY 4.0</a>.
        </p>
      </DialogContent>
    </Dialog>
  );
}
