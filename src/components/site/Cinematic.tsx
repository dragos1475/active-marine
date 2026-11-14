import { useEffect, useState } from "react";

const INTRO_MS = 5000;

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
    <>
      {show && (
        <div
          className="am-intro fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-background px-6"
          onClick={() => setShow(false)}
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
        </div>
      )}
    </>
  );
}
