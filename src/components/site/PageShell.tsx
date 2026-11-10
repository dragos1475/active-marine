import { useCallback, useState, type ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Sections";
import { QuoteDialog } from "./QuoteDialog";
import { FloatingChat } from "./More";

export function PageShell({ children }: { children: (openQuote: () => void) => ReactNode }) {
  const [quote, setQuote] = useState(false);
  const open = useCallback(() => setQuote(true), []);
  const close = useCallback(() => setQuote(false), []);
  return (
    <div className="overflow-x-clip">
      <Header onQuote={open} />
      <main>{children(open)}</main>
      <Footer />
      <FloatingChat />
      <QuoteDialog open={quote} onClose={close} />
    </div>
  );
}
