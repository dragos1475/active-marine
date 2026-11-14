import { useCallback, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Header } from "./Header";
import { Footer } from "./Sections";
import { FloatingChat } from "./More";

export function PageShell({ children }: { children: (openQuote: () => void) => ReactNode }) {
  const navigate = useNavigate();
  const open = useCallback(() => { void navigate({ to: "/enquiry", search: { part: "" } }); }, [navigate]);
  return (
    <div className="overflow-x-clip">
      <Header onQuote={open} />
      <main>{children(open)}</main>
      <Footer />
      <FloatingChat />
    </div>
  );
}
