import { useEffect, useRef, useState } from "react";

const INTRO_MS = 5000;

/** First-visit cinematic intro (once per browser session). */
export function Intro({ ready = true, onDone }: { ready?: boolean; onDone?: () => void }) {
  const [show, setShow] = useState(false);
  const [elapsed, setElapsed] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(5);
  useEffect(() => {
    if (sessionStorage.getItem("am-intro")) { onDone?.(); return; }
    sessionStorage.setItem("am-intro", "1");
    setShow(true);
    const t = setTimeout(() => setElapsed(true), INTRO_MS - 750);
    return () => clearTimeout(t);
  }, [onDone]);
  useEffect(() => {
    if (!show || !elapsed || !ready) return;
    setLeaving(true);
    const t = setTimeout(() => { setShow(false); onDone?.(); }, 750);
    return () => clearTimeout(t);
  }, [show, elapsed, ready, onDone]);
  useEffect(() => {
    if (!show) return;
    const started = Date.now();
    const timer = setInterval(() => {
      setSecondsLeft(Math.max(0, Math.ceil((INTRO_MS - (Date.now() - started)) / 1000)));
    }, 200);
    return () => clearInterval(timer);
  }, [show]);
  return (
    <>
      {show && (
        <div
          className={`am-intro ${leaving ? "am-intro-leaving" : ""} fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-background px-6`}
          onClick={() => { setShow(false); onDone?.(); }}
        >
          <svg viewBox="0 0 52 52" className="h-24 w-24" aria-hidden="true">
            <path d="M25.5 4 47 42H36L25.5 22 15.5 42H5Z" className="fill-primary" />
            <path d="M8 43c10-8 18-8 28-2 4 2 8 3 12 1" className="am-intro-wave stroke-foreground" strokeWidth="4" fill="none" pathLength="1" />
          </svg>
          <div className="mt-6 font-display text-4xl tracking-[0.12em] sm:text-5xl md:text-7xl">
            ACTIVMARINE
          </div>
          <div className="am-intro-horizon mt-5 h-0.5 w-60 max-w-full bg-tide" aria-hidden="true" />
          <p className="mt-5 text-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Shanghai · Marine Expertise
          </p>
          <div className="absolute bottom-12 left-1/2 w-72 max-w-[calc(100%-3rem)] -translate-x-1/2 sm:bottom-16">
            <div role="status" aria-live="polite" className="mb-4 flex h-5 items-center justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className={`h-1 w-1 rounded-full ${ready ? "bg-primary" : "am-loading-beacon bg-mustard"}`} aria-hidden="true" />
                {secondsLeft > 0 ? "Loading" : ready ? "Opening film" : "Buffering film"}
              </span>
              <span className="min-w-10 text-right tabular-nums text-mustard">
                {secondsLeft > 0 ? `0${secondsLeft}s` : ready ? "Ready" : "…"}
              </span>
            </div>
            <div className="relative h-px overflow-hidden bg-border" aria-hidden="true">
              <div className={`h-full w-full origin-left bg-tide ${secondsLeft === 0 && !ready ? "am-loading-wait" : "am-loading-progress"}`} />
            </div>
            <div className="mt-3 flex justify-between text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60" aria-hidden="true">
              <span>ActivMarine</span><span>Shanghai / At sea</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/** Mustard dot cursor that grows into a labelled ring over links, buttons and [data-cursor]. */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    document.documentElement.classList.add("am-cursor");
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0, started = false;
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      if (!started) { started = true; cx = x; cy = y; setEnabled(true); }
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-cursor],a,button,img,video");
      setActive(!!el);
      setLabel(el?.dataset['cursor'] ?? (el && (el.tagName === "IMG" || el.tagName === "VIDEO") ? "View" : null));
    };
    const loop = () => {
      cx += (x - cx) * 0.2; cy += (y - cy) * 0.2;
      if (dot.current) dot.current.style.transform = `translate3d(${cx}px,${cy}px,0) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("pointermove", move); cancelAnimationFrame(raf); document.documentElement.classList.remove("am-cursor"); };
  }, []);
  if (!enabled) return null;
  return (
    <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[110]">
      <div
        className={`flex items-center justify-center rounded-full transition-all duration-300 ease-out ${
          label ? "h-20 w-20 bg-primary/90 text-primary-foreground" : active ? "h-10 w-10 border border-primary bg-primary/10" : "h-2.5 w-2.5 bg-primary"
        }`}
      >
        {label && <span className="text-[10px] font-semibold uppercase tracking-[0.2em]">{label}</span>}
      </div>
    </div>
  );
}
