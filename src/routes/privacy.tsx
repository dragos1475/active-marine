import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/site/PageShell";
import { CONTACT } from "@/components/site/content";
import { ENQUIRY_DELIVERY } from "@/lib/enquiry";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Activ Marine" },
      { name: "description", content: "How Activ Marine handles personal data and technical drawings sent with quotation requests." },
      { property: "og:title", content: "Privacy Policy | Activ Marine" },
      { property: "og:description", content: "How Activ Marine handles personal data and technical drawings sent with quotation requests." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

// The policy has to match how this build of the site really delivers an enquiry.
const sentBySite = ENQUIRY_DELIVERY === "netlify";

const SECTIONS = [
  ["Who we are", `${CONTACT.company} ("Activ Marine") is responsible for personal data collected through this website. Contact: ${CONTACT.email}.`],
  ["What we collect", sentBySite
    ? "When you press Send enquiry, the form sends us your name, company, vessel name and IMO number, port, any local agent's details you enter, email, telephone and the items and details of your enquiry. It is received and stored for us by our hosting provider, Netlify, and passed on to our office by email. Drawings and documents are not uploaded through the website; we receive them only if you email them to us."
    : "The enquiry form on this website does not send anything to us by itself: it prepares an email that you send from your own email account. When you send it we receive your name, company, vessel name and IMO number, port, any local agent's details you enter, email, telephone, the items and details of your enquiry and any drawings or documents you choose to attach."],
  ["Why we use it", "Only to answer your enquiry, prepare quotations and deliver the requested supply or service. Legal basis: steps prior to entering a contract and our legitimate interest in responding to business enquiries."],
  ["Technical drawings", "Drawings and specifications are treated as confidential, shared only with manufacturers or workshops needed to fulfil your request, and never published."],
  ["How long we keep it", "Enquiries that do not lead to an order are deleted after 24 months. Order records are kept as long as required by accounting and tax law."],
  ["Your rights", "You may request access, correction, deletion, restriction or a copy of your data, and object to processing, by writing to us. You may also complain to your data protection authority."],
  ["Stored in your browser", `While you fill in the enquiry form, a draft is saved in your own browser so that it is not lost if the connection drops, and your vessel and contact details are kept there for your next enquiry. This draft stays on your device and ${sentBySite ? "reaches us only when you press Send enquiry" : "is not sent to us"}. You can remove it at any time with "Clear the form and forget my details" on the enquiry page. The browser also remembers the colour theme you chose and that you have already seen the opening screen.`],
  ["Cookies and other services", "This website does not use advertising cookies, and its fonts are served from the website itself rather than from a third party. The wind forecast on the Network page is requested from MET Norway by our server; your browser does not contact MET Norway and nothing about you is passed on. Basic, privacy-friendly visit statistics may be collected without identifying you."],
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
