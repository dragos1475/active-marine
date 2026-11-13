import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const INTRO_MS = 4500;

/** First-visit cinematic intro (once per browser session). */
export function Intro() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    if (sessionStorage.getItem("am-intro")) return;
    sessionStorage.setItem("am-intro", "1");
    setShow(true);
    const t = setTimeout(() => setShow(false), INTRO_MS);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-background grain"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%", transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } }}
          onClick={() => setShow(false)}
        >
          <motion.svg viewBox="0 0 52 52" className="h-24 w-24" initial={{ opacity: 0, scale: 0.8, filter: "blur(12px)" }} animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }} transition={{ duration: 1.6, ease: "easeOut" }}>
            <motion.path d="M25.5 4 47 42H36L25.5 22 15.5 42H5Z" className="fill-primary" />
            <motion.path d="M8 43c10-8 18-8 28-2 4 2 8 3 12 1" className="stroke-foreground" strokeWidth="4" fill="none" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 1.4 }} />
          </motion.svg>
          <motion.div className="mt-6 font-display text-5xl tracking-[0.3em] md:text-7xl" initial={{ opacity: 0, letterSpacing: "0.8em" }} animate={{ opacity: 1, letterSpacing: "0.3em" }} transition={{ delay: 1.2, duration: 1.8, ease: "easeOut" }}>
            ACTIVMARINE
          </motion.div>
          <motion.div className="mt-4 h-px bg-tide" initial={{ width: 0 }} animate={{ width: 240 }} transition={{ delay: 2.2, duration: 1.4, ease: "easeInOut" }} />
          <motion.p className="mt-4 text-xs uppercase tracking-[0.4em] text-muted-foreground" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.8, duration: 1 }}>
            Shanghai · Marine Expertise
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
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
    setEnabled(true);
    document.documentElement.classList.add("am-cursor");
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
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
