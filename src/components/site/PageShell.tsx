import { useCallback, useState, type ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Sections";
import { QuoteDialog } from "./QuoteDialog";
import { FloatingChat } from "./More";
import { Intro, Cursor } from "./Cinematic";
import { PlaybackContext } from "./Playback";

export function PageShell({ children, waitForVideo = false }: { children: (openQuote: () => void) => ReactNode; waitForVideo?: boolean }) {
  const [ready, setReady] = useState(!waitForVideo);
  const [revealed, setRevealed] = useState(false);
  const markReady = useCallback(() => setReady(true), []);
  const reveal = useCallback(() => setRevealed(true), []);
  const [quote, setQuote] = useState(false);
  const open = useCallback(() => setQuote(true), []);
  const close = useCallback(() => setQuote(false), []);
  return (
    <PlaybackContext.Provider value={{ ready, revealed, markReady }}>
    <div className="overflow-x-clip">
      <Header onQuote={open} />
      <main>{children(open)}</main>
      <Footer />
      <FloatingChat />
      <Intro ready={ready} onDone={reveal} />
      <Cursor />
      <QuoteDialog open={quote} onClose={close} />
    </div>
    </PlaybackContext.Provider>
  );
}
