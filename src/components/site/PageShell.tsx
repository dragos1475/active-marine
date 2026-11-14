import { useCallback, type ReactNode } from "react";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Sections";
import { FloatingChat } from "./More";
import { MobileActionBar } from "./MobileActionBar";

export function PageShell({ children }: { children: (openQuote: () => void) => ReactNode }) {
  const navigate = useNavigate();
  const open = useCallback(() => { void navigate({ to: "/enquiry", search: { part: "" } }); }, [navigate]);
  // The enquiry page is the destination of the bar, so it does not need one.
  const actionBar = !useLocation({ select: (location) => location.pathname }).startsWith("/enquiry");
  return (
    <div className={`overflow-x-clip ${actionBar ? "pb-[4.5rem] sm:pb-0 print:pb-0" : ""}`}>
      <Header onQuote={open} />
      <main>{children(open)}</main>
      <Footer />
      <FloatingChat raised={actionBar} />
      {actionBar && <MobileActionBar />}
    </div>
  );
}
