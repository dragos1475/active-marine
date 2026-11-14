import { ArrowUpRight, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { CONTACT } from "./content";

/** Phone-only bar that keeps the two ways to reach the office in thumb reach on every page. */
export function MobileActionBar() {
  return (
    <div role="region" aria-label="Quick actions" className="fixed inset-x-0 bottom-0 z-30 flex gap-2 border-t border-border bg-background px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 sm:hidden print:hidden">
      <Link to="/enquiry" search={{ part: "" }} className="flex flex-1 items-center justify-center gap-2 bg-primary py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-primary-foreground">
        Send enquiry <ArrowUpRight className="h-4 w-4" />
      </Link>
      <a href={`mailto:${CONTACT.email}`} className="flex items-center justify-center gap-2 border border-input px-5 py-3.5 text-xs font-bold uppercase tracking-[0.18em] text-foreground">
        <Mail className="h-4 w-4" /> Email
      </a>
    </div>
  );
}
