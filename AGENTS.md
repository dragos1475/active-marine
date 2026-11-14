<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

- Homepage is composed of section components in src/components/site/ with motion (motion/react) for scroll/reveal animation; shared site content lives in src/components/site/content.ts — keeps copy editable in one place.
- Every page wraps content in PageShell (header, footer, floating chat); its enquiry callback navigates to /enquiry rather than opening a modal — keeps every quote CTA on the complete enquiry page.
- Site is multi-page: each section area has its own route (about, services + services/$slug, cases, network, faq, contact, insights); main nav lives in NAV in content.ts and the Services mega-menu reads SERVICES — avoids an endless single page and gives each area its own SEO head.
- Keep homepage text outside animated transforms and opacity layers; the intro exits by fading rather than translating — prevents abrupt title motion and preserves sharp text above the videos.
- Animate the intro wave and horizon with CSS, separate from static text and without a grain overlay — keeps the title crisp and the line animation independent of Motion scheduling.
- Keep Vercel's asset-prefix rewrite pointing to the original Lovable media service — asset pointers contain relative URLs that otherwise resolve to missing files on external hosting; page routes must remain untouched.
- The homepage uses a static daylight vessel image with locally scoped semantic light tokens, preceded by the logo and CSS-animated line intro once per browser session for three seconds; keep the native browser cursor and do not load legacy videos — preserves the opening identity without restoring the dark video background.
- All site surfaces and photographic text washes inherit the shared daylight semantic tokens in src/styles.css; keep glass surfaces and shadows token-based — ensures every page, menu, form and map stays readable under the same theme.
- ThemeProvider owns the light/medium/dark choice at the root and restores browser storage after hydration; theme overrides include the homepage's scoped wash — keeps navigation persistent without SSR browser access or mismatched markup.
- The homepage hero states the offer, port coverage and response times, with Send Enquiry as the primary action; its figures come from HERO_FACTS in content.ts and must restate the FAQ commitments — keeps the first screen factual, with no unverified claims. The intro can be skipped with its Skip button, a click or Escape.
- The enquiry page is an RFQ sheet: vessel and IMO, port, ETA, required-by date, urgent flag and a line-item table that accepts rows pasted from Excel; its text, reference and IMO check live in src/lib/enquiry.ts. It still only prepares an email (mailto link or copied text) and never uploads files — no backend exists, so the page must not claim anything is sent.
- The enquiry form keeps its draft in the visitor's browser (localStorage) and remembers vessel and contact for the next enquiry; nothing is stored on a server. After preparing the email it shows "What happens next" with the FAQ response times in the visitor's and China's time.
- The homepage leads with Situations: each service is phrased as the client's need (ask in SERVICES) and links straight to the enquiry with that type preselected; the port and ETA strip also opens the enquiry prefilled — clients arrive with a problem, not a department.
- Service pages are a service sheet: scope, what to send (need in SERVICES), the three STEPS and the matching FAQ answers. Do not add terms, lead times or claims to the sheet that the FAQ does not state.
- Phones get a fixed bottom action bar (Send enquiry, Email) on every page except the enquiry page. Print styles in src/styles.css drop navigation, animation and colour so any page prints or saves to PDF as plain text.
- Reveal animations are short (0.4s) and never blur; the capabilities ticker was removed from the homepage — visitors on slow links must be able to read each section as soon as it appears, and the services were already shown twice above it.
- The services overview is a dense list (photo, title, scope, Send enquiry, Service sheet) and service pages use the compact PageHero; on phones the homepage situations are a compact list without photos and the hero drops its own Send Enquiry button because the fixed action bar carries it.
- Ports on the Network page link to the enquiry with that port filled in.
- The Network page shows a wind forecast per port (knots, direction, Beaufort) from MET Norway's free Locationforecast. It is fetched by the server function in src/lib/port-wind.functions.ts and cached there until the service's Expires time, never called from the browser; the page must keep the "not for navigation" note and the MET Norway / CC BY 4.0 credit. Wave and swell data were left out on purpose: the free source for them (Open-Meteo) does not allow commercial use.
- Fonts (Bebas Neue, Barlow) are bundled from @fontsource and imported in src/styles.css; do not load fonts from Google or any other host — the site must render the same from mainland China, where Google Fonts is unreachable.
- One name per thing: the action that opens the enquiry form is always "Send enquiry", and the company is "Activ Marine" in running text and page titles, "Activ Marine Limited" in legal text; the ACTIVMARINE wordmark beside the logo is the only joined form.
- The privacy policy describes what the site really does (email prepared in the browser, draft in local storage, wind fetched by the server) and stays marked as a draft until the company approves it; update it whenever the site starts storing or sending something new.
- The header bar spans the full width: logo at the left edge, the menu centred in larger type, Send enquiry at the right edge (the owner asked for this; it no longer lines up with the centred page column on wide screens). The header menu has five entries from HEADER_NAV and no status strip above it (tried and removed at the owner's request); FAQ, Insights and the theme selector live in the footer.
- On desktop the enquiry form shows a live preview of the email and a list of details still missing; missing details and past dates only warn, they never block sending.
- Picking a port on the Network page opens PortPanel: local time, wind now and a 48-hour outlook in three-hour steps, plus the enquiry link for that port.
- The ship spares page compares Genuine, OEM and Quality alternative from SPARE_TYPES in content.ts; that wording is general guidance awaiting the company's confirmation, so do not add prices, lead times or certificates to it.
- Pages are kept short on purpose (measured in screens, see the compacting pass): the footer has no giant wordmark, the closing CtaBand is one slim line and is hidden on phones (the fixed bar does its job), the enquiry form starts right under a short heading, and the parts search is a single row inside Situations. On phones, long reference content folds: scope lists on the services overview, standing terms on a service sheet, and the spare-type comparison open one at a time. Folded content must still print.
- Interior page imagery uses PageHero's theme-aware image wash or MaritimeImage's compact photo band, with generated scenes described as illustrative where descriptive alt text is present — adds restrained maritime color without obscuring text or implying verified company photography.

- Allocate imagery by page and placement in the shared imagery module, with separate maps for homepage, service listing, detail hero and each related-service pair; never reuse a source across placements — keeps subjects relevant while making duplication testable.
