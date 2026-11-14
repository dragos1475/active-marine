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
- The homepage uses a static daylight vessel image with locally scoped semantic light tokens, preceded by the logo and CSS-animated line intro once per browser session for five seconds; keep the native browser cursor and do not load legacy videos — preserves the opening identity without restoring the dark video background.
