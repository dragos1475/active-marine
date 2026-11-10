import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { PageShell } from "@/components/site/PageShell";
import { MockLabel } from "@/components/site/More";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard (demo) | ActivMarine" },
      { name: "description", content: "Demo overview of website visits and quotation requests." },
      { property: "og:title", content: "Dashboard (demo) | ActivMarine" },
      { property: "og:description", content: "Demo overview of website visits and quotation requests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Dashboard,
});

const WEEKS = [12, 18, 15, 22, 27, 24, 31, 35]; // demo quote requests per week
const KPIS = [["1,284", "Visitors this month"], ["35", "Quote requests this week"], ["2.7%", "Visitor → request"], ["4h 10m", "Avg. first reply"]];
const BY_TYPE = [["Ship spares & equipment", 42], ["Technical services", 23], ["China sourcing", 14], ["Docking & supervision", 11], ["Surveys", 10]] as const;
const RECENT = [
  ["Aegean Bulk", "MV Aegean Star", "Ship spares", "Qingdao", "New"],
  ["Nordic Tankers", "MT Nordic Fjord", "Electrical repair", "Ningbo", "Quoted"],
  ["Levant Marine", "MV Cedar", "Docking supervision", "Guangzhou", "In progress"],
  ["Pacific Reefers", "MV Coral Bay", "Survey", "Xiamen", "Won"],
];

function Dashboard() {
  const max = Math.max(...WEEKS);
  return (
    <PageShell>
      {() => (
        <div className="mx-auto max-w-7xl px-6 pb-32 pt-36">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div><p className="eyebrow">Owner view</p><h1 className="mt-4 text-[clamp(3rem,7vw,6rem)] uppercase">Dashboard</h1></div>
            <MockLabel>Demo data — not connected</MockLabel>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-px bg-border lg:grid-cols-4">
            {KPIS.map(([v, k]) => (
              <div key={k} className="bg-background p-8"><div className="text-tide font-display text-6xl">{v}</div><div className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">{k}</div></div>
            ))}
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
            <div className="border border-border bg-card p-8">
              <p className="eyebrow">Quote requests per week</p>
              <div className="mt-8 flex h-64 items-end gap-3">
                {WEEKS.map((w, i) => (
                  <div key={i} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-xs text-muted-foreground">{w}</span>
                    <motion.div initial={{ height: 0 }} animate={{ height: `${(w / max) * 100}%` }} transition={{ delay: i * 0.08, duration: 0.8 }} className="w-full bg-tide" />
                    <span className="text-[0.6rem] text-muted-foreground">W{i + 38}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-border bg-card p-8">
              <p className="eyebrow">By enquiry type</p>
              <div className="mt-8 space-y-5">
                {BY_TYPE.map(([t, p]) => (
                  <div key={t}>
                    <div className="flex justify-between text-sm"><span>{t}</span><span className="text-muted-foreground">{p}%</span></div>
                    <div className="mt-2 h-1 bg-muted"><motion.div initial={{ width: 0 }} animate={{ width: `${p}%` }} transition={{ duration: 1 }} className="h-full bg-primary" /></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto border border-border bg-card p-8">
            <p className="eyebrow">Latest requests</p>
            <table className="mt-6 w-full min-w-[600px] text-left text-sm">
              <thead className="text-[0.65rem] uppercase tracking-[0.2em] text-muted-foreground"><tr>{["Company", "Vessel", "Type", "Port", "Status"].map((h) => <th key={h} className="pb-3">{h}</th>)}</tr></thead>
              <tbody>{RECENT.map((r) => <tr key={r[1]} className="border-t border-border">{r.map((c, j) => <td key={j} className={`py-4 ${j === 4 ? "text-primary" : ""}`}>{c}</td>)}</tr>)}</tbody>
            </table>
          </div>
        </div>
      )}
    </PageShell>
  );
}
