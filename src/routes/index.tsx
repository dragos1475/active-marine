import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { About, Approach, China, Contact, Footer, Marquee, Services } from "@/components/site/Sections";
import { QuoteDialog } from "@/components/site/QuoteDialog";

const TITLE = "ActivMarine | Marine Engineering, Supply & Solutions — Shanghai";
const DESC =
  "Former seafarers and marine surveyors delivering ship spares, technical services, China sourcing, docking supervision and marine surveys from Shanghai.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "theme-color", content: "#0c2340" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [quote, setQuote] = useState(false);
  const open = useCallback(() => setQuote(true), []);
  const close = useCallback(() => setQuote(false), []);
  return (
    <div className="overflow-x-clip">
      <Header onQuote={open} />
      <main>
        <Hero onQuote={open} />
        <Marquee />
        <About />
        <Services />
        <Approach />
        <China />
        <Contact onQuote={open} />
      </main>
      <Footer />
      <QuoteDialog open={quote} onClose={close} />
    </div>
  );
}
