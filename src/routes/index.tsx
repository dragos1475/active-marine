import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import hero from "@/assets/hero.png.asset.json";
import office from "@/assets/office-team-final.png.asset.json";
import parts from "@/assets/marine-spares-electronics.png.asset.json";
import { SITE_MARKUP } from "@/site-markup";

const TITLE = "ActivMarine | Engineering. Supply. Solutions.";
const DESC =
  "Shanghai-based marine engineering, ship spares, technical services, China sourcing, docking supervision and marine surveys.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { name: "theme-color", content: "#071d32" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const markup = SITE_MARKUP.replace("__OFFICE__", office.url).replace("__PARTS__", parts.url);

function Index() {
  useEffect(() => {
    const ac = new AbortController();
    const o = { signal: ac.signal };
    const $ = <T extends HTMLElement>(s: string) => document.querySelector(s) as T;
    const menuBtn = $("#menuBtn"), navLinks = $("#navLinks");
    menuBtn.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      menuBtn.setAttribute("aria-expanded", String(open));
    }, o);
    navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    }, o));
    const modal = $("#rfqModal"), closeBtn = $("#closeModal");
    let lastTrigger: HTMLElement | null = null;
    const closeModal = () => {
      modal.classList.remove("open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      lastTrigger?.focus();
    };
    document.querySelectorAll<HTMLElement>("[data-rfq]").forEach((el) => el.addEventListener("click", (e) => {
      e.preventDefault();
      lastTrigger = el;
      modal.classList.add("open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }, o));
    closeBtn.addEventListener("click", closeModal, o);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); }, o);
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
    }, o);
    const drawings = $<HTMLInputElement>("#drawings");
    drawings.addEventListener("change", () => {
      const list = $("#drawingList");
      list.replaceChildren();
      Array.from(drawings.files ?? []).forEach((f) => {
        const li = document.createElement("li");
        li.textContent = f.name;
        list.appendChild(li);
      });
    }, o);
    $<HTMLFormElement>("#rfqForm").addEventListener("submit", async (e) => {
      e.preventDefault();
      const v = Object.fromEntries(new FormData(e.target as HTMLFormElement).entries()) as Record<string, string>;
      const files = Array.from(drawings.files ?? []).map((f) => f.name).join("\n") || "None selected";
      const msg = `ACTIVMARINE — REQUEST FOR QUOTATION\n\nName: ${v.name}\nCompany: ${v.company}\nVessel: ${v.vessel}\nEmail: ${v.email}\nPhone: ${v.phone}\nType: ${v.type}\n\nRequirements:\n${v.details}\n\nDrawings (attach separately):\n${files}`;
      const success = $("#copySuccess");
      try {
        await navigator.clipboard.writeText(msg);
        success.textContent = "Enquiry text copied. Paste it into an email to office@activ-marine.com and attach any selected drawings separately.";
      } catch {
        const area = document.createElement("textarea");
        area.value = msg;
        area.style.width = "100%";
        area.style.height = "145px";
        success.replaceChildren(area);
        area.select();
        success.prepend(document.createTextNode("Select and copy this enquiry text: "));
      }
      success.classList.add("show");
    }, o);
    return () => { ac.abort(); document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      className="activmarine"
      style={{ ["--hero-img" as string]: `url('${hero.url}')` }}
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}
