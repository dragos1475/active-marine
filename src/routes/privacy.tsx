import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { CONTACT } from "@/components/site/content";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | ActivMarine" },
      { name: "description", content: "How ActivMarine handles personal data and technical drawings sent with quotation requests." },
      { property: "og:title", content: "Privacy Policy | ActivMarine" },
      { property: "og:description", content: "How ActivMarine handles personal data and technical drawings sent with quotation requests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

const SECTIONS = [
  ["Who we are", `${CONTACT.company} ("ActivMarine") is responsible for personal data collected through this website. Contact: ${CONTACT.email}.`],
  ["What we collect", "When you request a quotation we receive your name, company, vessel name, email, telephone, enquiry details and any drawings or documents you choose to send."],
  ["Why we use it", "Only to answer your enquiry, prepare quotations and deliver the requested supply or service. Legal basis: steps prior to entering a contract and our legitimate interest in responding to business enquiries."],
  ["Technical drawings", "Drawings and specifications are treated as confidential, shared only with manufacturers or workshops needed to fulfil your request, and never published."],
  ["How long we keep it", "Enquiries that do not lead to an order are deleted after 24 months. Order records are kept as long as required by accounting and tax law."],
  ["Your rights", "You may request access, correction, deletion, restriction or a copy of your data, and object to processing, by writing to us. You may also complain to your data protection authority."],
  ["Cookies", "This website does not use advertising cookies. Basic, privacy-friendly visit statistics may be collected without identifying you."],
];

function Privacy() {
  return (
    <PageShell>
      {() => (
        <article className="mx-auto max-w-3xl px-6 pb-32 pt-40">
          <p className="eyebrow">Legal</p>
          <h1 className="mt-6 text-[clamp(3.5rem,9vw,7rem)] uppercase">Privacy policy</h1>
          <p className="mt-4 text-sm text-muted-foreground">Draft for review — to be confirmed by the company before launch. Last updated November 2026.</p>
          <div className="mt-16 space-y-12">
            {SECTIONS.map(([h, t], i) => (
              <section key={h} className="grid gap-4 border-t border-border pt-8 md:grid-cols-[4rem_1fr]">
                <span className="font-display text-4xl text-primary">0{i + 1}</span>
                <div><h2 className="text-3xl uppercase">{h}</h2><p className="mt-3 leading-relaxed text-muted-foreground">{t}</p></div>
              </section>
            ))}
          </div>
        </article>
      )}
    </PageShell>
  );
}
