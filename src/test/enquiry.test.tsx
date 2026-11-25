import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { ENQUIRY_FORM_FIELDS, ENQUIRY_FORM_MARKER, ENQUIRY_FORM_NAME, ENQUIRY_FORM_PATH, netlifyFormBody, sendEnquiry, stashAgent, DRAFT_STORAGE_KEY, applyPaste, buildEnquiry, emptyFields, emptyItem, formatWhen, isValidImo, mailtoHref, makeReference, nextEnquiry, parseDraft, parsePastedCells, responseTimes, type EnquiryInput } from "@/lib/enquiry";

afterEach(() => {
  cleanup();
  localStorage.clear();
});

const base: EnquiryInput = {
  reference: "AM-261114-TEST",
  urgent: false,
  type: "Ship spares & equipment",
  name: "Jane Doe",
  company: "Example Ship Management",
  email: "jane@example.com",
  phone: "+30 000 000",
  vessel: "MV Example",
  imo: "",
  port: "",
  eta: "",
  requiredBy: "",
  agent: "",
  details: "",
  items: [],
  files: [],
};

describe("Enquiry helpers", () => {
  it("accepts a real IMO number and rejects a wrong check digit or length", () => {
    expect(isValidImo("9074729")).toBe(true);
    expect(isValidImo("IMO 9074729")).toBe(true);
    expect(isValidImo("9074728")).toBe(false);
    expect(isValidImo("907472")).toBe(false);
  });

  it("treats a single pasted value as ordinary text and a spreadsheet range as cells", () => {
    expect(parsePastedCells("90510-0123")).toBeNull();
    expect(parsePastedCells("MAN B&W\t6S50MC\r\nYanmar\t6EY18\r\n")).toEqual([
      ["MAN B&W", "6S50MC"],
      ["Yanmar", "6EY18"],
    ]);
  });

  it("fills columns from the pasted cell onwards and adds rows as needed", () => {
    const items = applyPaste([emptyItem()], 0, 3, [
      ["90510-0123", "Plunger and barrel", "2"],
      ["90510-0456", "Suction valve", "4"],
    ]);
    expect(items).toHaveLength(2);
    expect(items[0]).toMatchObject({ maker: "", partNo: "90510-0123", description: "Plunger and barrel", qty: "2" });
    expect(items[1]).toMatchObject({ partNo: "90510-0456", description: "Suction valve", qty: "4" });
  });

  it("builds a reference from the date and a short random suffix", () => {
    expect(makeReference(new Date(2026, 10, 14), () => 0)).toBe("AM-261114-AAAA");
  });

  it("marks urgent enquiries and puts vessel, IMO and port in the subject", () => {
    const { subject, body } = buildEnquiry({ ...base, urgent: true, imo: "IMO 9074729", port: "Ningbo" });
    expect(subject).toBe("URGENT Enquiry AM-261114-TEST — MV Example (IMO 9074729) — Ningbo");
    expect(body).toContain("*** URGENT");
    expect(body).toContain("IMO: 9074729");
  });

  it("lists only filled items and leaves out empty sections", () => {
    const { subject, body } = buildEnquiry({
      ...base,
      items: [{ ...emptyItem(), maker: "Yanmar", partNo: "123-456", qty: "2" }, emptyItem()],
    });
    expect(subject).toBe("Enquiry AM-261114-TEST — MV Example");
    expect(body).toContain("ITEMS\n1. Maker: Yanmar | Part no.: 123-456 | Qty: 2");
    expect(body).not.toContain("2. ");
    expect(body).not.toContain("REQUIREMENTS");
    expect(body).not.toContain("URGENT");
    expect(body).not.toContain("DRAWINGS");
  });

  it("keeps long enquiries out of the email link and sends them through the clipboard", () => {
    const short = buildEnquiry(base);
    expect(decodeURIComponent(mailtoHref("office@example.com", short, base.reference))).toContain("Name: Jane Doe");
    const long = buildEnquiry({ ...base, details: "Overhaul scope. ".repeat(200) });
    const href = decodeURIComponent(mailtoHref("office@example.com", long, base.reference));
    expect(href).toContain("Paste the copied enquiry text here");
    expect(href).not.toContain("Overhaul scope");
  });
});

describe("Enquiry draft and follow-up", () => {
  it("ignores stored drafts that are damaged or have the wrong shape", () => {
    expect(parseDraft(null)).toBeNull();
    expect(parseDraft("not json")).toBeNull();
    expect(parseDraft(JSON.stringify({ items: [] }))).toBeNull();
    const draft = parseDraft(JSON.stringify({ fields: { vessel: "MV Example", urgent: true, phone: 12 }, items: [{ partNo: "123" }, "junk"] }));
    expect(draft?.fields).toMatchObject({ vessel: "MV Example", urgent: true, phone: "" });
    expect(draft?.items).toHaveLength(2);
    expect(draft?.items[0]).toMatchObject({ partNo: "123", maker: "" });
  });

  it("keeps the vessel and contact for the next enquiry and clears the request itself", () => {
    const { fields, items } = nextEnquiry({ ...emptyFields(), vessel: "MV Example", imo: "9074729", name: "Jane Doe", email: "jane@example.com", port: "Ningbo", details: "Fuel pump", urgent: true });
    expect(fields).toMatchObject({ vessel: "MV Example", imo: "9074729", name: "Jane Doe", email: "jane@example.com", port: "", details: "", urgent: false });
    expect(items).toEqual([emptyItem()]);
  });

  it("counts the acknowledgement and the pricing indication from the moment of sending", () => {
    const sent = new Date("2026-11-14T10:00:00Z");
    const { acknowledgeBy, indicationBy } = responseTimes(sent);
    expect(acknowledgeBy.toISOString()).toBe("2026-11-14T12:00:00.000Z");
    expect(indicationBy.toISOString()).toBe("2026-11-16T10:00:00.000Z");
    expect(formatWhen(acknowledgeBy, "Asia/Shanghai")).toBe("Sat 20:00");
  });
});

describe("Enquiry form", () => {
  it("restores a draft saved in the browser and keeps saving as the visitor types", async () => {
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ fields: { ...emptyFields(), vessel: "MV Saved", name: "Jane Doe" }, items: [{ ...emptyItem(), partNo: "123-456" }] }));
    render(<EnquiryForm type="Technical services" port="Ningbo" />);
    expect(await screen.findByDisplayValue("MV Saved")).toBeInTheDocument();
    expect(within(screen.getByRole("group", { name: "Item 1" })).getByLabelText("Part no.")).toHaveValue("123-456");
    expect(screen.getByLabelText("Enquiry type")).toHaveValue("Technical services");
    expect(screen.getByLabelText("Port or yard in China")).toHaveValue("Ningbo");
    fireEvent.change(screen.getByLabelText("Company"), { target: { value: "Example Ship Management" } });
    await waitFor(() => expect(parseDraft(localStorage.getItem(DRAFT_STORAGE_KEY))?.fields.company).toBe("Example Ship Management"));
  });

  it("forgets everything when the visitor clears the form", async () => {
    render(<EnquiryForm />);
    fireEvent.change(screen.getByLabelText("Vessel"), { target: { value: "MV Example" } });
    fireEvent.click(await screen.findByRole("button", { name: /forget my details/i }));
    expect(screen.getByLabelText("Vessel")).toHaveValue("");
    await waitFor(() => expect(parseDraft(localStorage.getItem(DRAFT_STORAGE_KEY))?.fields.vessel).toBe(""));
  });

  it("starts with the part typed on the quick parts search", () => {
    render(<EnquiryForm part="Yanmar 6EY18 fuel pump" />);
    const first = screen.getByRole("group", { name: "Item 1" });
    expect(within(first).getByLabelText("Description")).toHaveValue("Yanmar 6EY18 fuel pump");
  });

  it("spreads a pasted spreadsheet range over rows and columns", () => {
    render(<EnquiryForm />);
    const first = screen.getByRole("group", { name: "Item 1" });
    fireEvent.paste(within(first).getByLabelText("Maker"), {
      clipboardData: { getData: () => "MAN B&W\t6S50MC\t\t90510-0123\tPlunger\t2\nYanmar\t6EY18\t\t123-456\tNozzle\t6" },
    });
    expect(within(screen.getByRole("group", { name: "Item 1" })).getByLabelText("Part no.")).toHaveValue("90510-0123");
    const second = screen.getByRole("group", { name: "Item 2" });
    expect(within(second).getByLabelText("Maker")).toHaveValue("Yanmar");
    expect(within(second).getByLabelText("Qty")).toHaveValue("6");
    expect(screen.getByText("2 items filled in")).toBeInTheDocument();
  });

  it("warns about an invalid IMO number without blocking the enquiry", () => {
    render(<EnquiryForm />);
    fireEvent.change(screen.getByLabelText(/IMO number/), { target: { value: "1234568" } });
    expect(screen.getByRole("status")).toHaveTextContent("does not look like a valid IMO number");
    fireEvent.change(screen.getByLabelText(/IMO number/), { target: { value: "9074729" } });
    expect(screen.queryByRole("status")).toBeNull();
  });

  it("asks for an item or a description before preparing the enquiry", async () => {
    render(<EnquiryForm />);
    fireEvent.submit(screen.getByRole("button", { name: /copy text/i }).closest("form") as HTMLFormElement);
    expect(await screen.findByRole("alert")).toHaveTextContent("Add at least one item");
  });

  it("copies the prepared enquiry and shows its reference", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<EnquiryForm part="Fuel pump" />);
    const fill = (name: string, value: string) => fireEvent.change(screen.getByLabelText(name), { target: { value } });
    fill("Vessel", "MV Example");
    fill("Name", "Jane Doe");
    fill("Company", "Example Ship Management");
    fill("Contact email", "jane@example.com");
    fill("Phone number", "+30 000 000");
    fireEvent.click(screen.getByLabelText(/Urgent/));
    fireEvent.click(screen.getByRole("button", { name: /copy text/i }));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    const copied = String(writeText.mock.calls[0]?.[0]);
    expect(copied).toContain("Vessel: MV Example");
    expect(copied).toContain("1. Description: Fuel pump");
    expect(copied).toContain("*** URGENT");
    expect(await screen.findByText(/^Reference AM-\d{6}-[A-Z0-9]{4}$/)).toBeInTheDocument();
    expect(screen.getByText("What happens next")).toBeInTheDocument();
    expect(screen.getByText("Within 2 hours")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /start another enquiry/i }));
    expect(screen.getByLabelText("Vessel")).toHaveValue("MV Example");
    expect(within(screen.getByRole("group", { name: "Item 1" })).getByLabelText("Description")).toHaveValue("");
    expect(screen.queryByText("What happens next")).toBeNull();
  });
});

describe("Local agent's details", () => {
  it("adds the agent to the delivery block and to the fields sent, when given", () => {
    const withAgent = { ...base, port: "Ningbo", agent: "  Example Agency, Mr Li, +86 000  " };
    expect(buildEnquiry(withAgent).body).toContain("Port: Ningbo\nLocal agent: Example Agency, Mr Li, +86 000");
    expect(netlifyFormBody(withAgent).get("agent")).toBe("Example Agency, Mr Li, +86 000");
    expect(buildEnquiry(base).body).not.toContain("Local agent");
  });

  it("carries the agent typed on the homepage into the form through browser storage, not the address", async () => {
    stashAgent("Example Agency, Mr Li", localStorage);
    expect(parseDraft(localStorage.getItem(DRAFT_STORAGE_KEY))?.fields.agent).toBe("Example Agency, Mr Li");
    render(<EnquiryForm port="Dalian" />);
    expect(await screen.findByDisplayValue("Example Agency, Mr Li")).toBeInTheDocument();
    expect(screen.getByLabelText("Port or yard in China")).toHaveValue("Dalian");
  });

  it("keeps an existing draft when the agent is added, and does nothing for an empty agent", () => {
    stashAgent("   ", localStorage);
    expect(localStorage.getItem(DRAFT_STORAGE_KEY)).toBeNull();
    localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify({ fields: { ...emptyFields(), vessel: "MV Saved" }, items: [emptyItem()] }));
    stashAgent("Example Agency", localStorage);
    expect(parseDraft(localStorage.getItem(DRAFT_STORAGE_KEY))?.fields).toMatchObject({ vessel: "MV Saved", agent: "Example Agency" });
  });
});

describe("Sending through Netlify Forms", () => {
  const blueprint = readFileSync(resolve(process.cwd(), "public/__forms.html"), "utf8");

  it("declares every field it sends in the static form Netlify reads at deploy time", () => {
    expect(blueprint).toContain(`<form name="${ENQUIRY_FORM_NAME}"`);
    expect(blueprint).toContain('data-netlify="true"');
    expect(blueprint).toContain('netlify-honeypot="bot-field"');
    for (const field of ["bot-field", ...ENQUIRY_FORM_FIELDS]) expect(blueprint).toContain(`name="${field}"`);
    expect(ENQUIRY_FORM_PATH).toBe("/__forms.html");
  });

  it("sends each detail as its own field, plus the full text", () => {
    const body = netlifyFormBody({ ...base, urgent: true, imo: "IMO 9074729", port: "Ningbo", items: [{ ...emptyItem(), maker: "Yanmar", qty: "2" }, emptyItem()] });
    expect(body.get("form-name")).toBe("enquiry");
    expect(body.get("bot-field")).toBe("");
    expect(body.get("subject")).toBe("URGENT Enquiry AM-261114-TEST — MV Example (IMO 9074729) — Ningbo");
    expect(body.get("urgent")).toBe("yes");
    expect(body.get("imo")).toBe("9074729");
    expect(body.get("items")).toBe("1. Maker: Yanmar | Qty: 2");
    expect(body.get("email")).toBe("jane@example.com");
    expect(body.get("message")).toContain("ACTIV MARINE LIMITED — ENQUIRY");
    expect([...body.keys()].sort()).toEqual(["bot-field", "form-name", ...ENQUIRY_FORM_FIELDS].sort());
  });

  it("reports success only when the service accepts the enquiry", async () => {
    const body = netlifyFormBody(base);
    const reply = (ok: boolean, text = "Thank you") => vi.fn().mockResolvedValue({ ok, text: async () => text });
    const accepted = reply(true);
    expect(await sendEnquiry(body, accepted)).toBe(true);
    expect(accepted).toHaveBeenCalledWith("/__forms.html", expect.objectContaining({ method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" } }));
    expect(String(accepted.mock.calls[0]?.[1]?.body)).toContain("form-name=enquiry");
    expect(await sendEnquiry(body, reply(false))).toBe(false);
    expect(await sendEnquiry(body, vi.fn().mockRejectedValue(new Error("offline")))).toBe(false);
  });

  it("does not take the declaration page served back for an accepted enquiry", async () => {
    expect(blueprint).toContain(ENQUIRY_FORM_MARKER);
    const echoed = vi.fn().mockResolvedValue({ ok: true, text: async () => blueprint });
    expect(await sendEnquiry(netlifyFormBody(base), echoed)).toBe(false);
  });

  const fillRequired = () => {
    const fill = (name: string, value: string) => fireEvent.change(screen.getByLabelText(name), { target: { value } });
    fill("Vessel", "MV Example");
    fill("Name", "Jane Doe");
    fill("Company", "Example Ship Management");
    fill("Contact email", "jane@example.com");
    fill("Phone number", "+30 000 000");
  };

  it("keeps preparing an email when the site is not built for Netlify", () => {
    render(<EnquiryForm />);
    expect(screen.queryByRole("button", { name: /send enquiry/i })).toBeNull();
    expect(screen.getByRole("button", { name: /open in email/i })).toBeInTheDocument();
  });

  it("sends the enquiry and says so when the service accepts it", async () => {
    const send = vi.fn().mockResolvedValue({ ok: true, text: async () => "Thank you" });
    vi.stubGlobal("fetch", send);
    render(<EnquiryForm part="Fuel pump" delivery="netlify" />);
    fillRequired();
    fireEvent.click(screen.getByRole("button", { name: /send enquiry/i }));
    expect(await screen.findByText(/^Enquiry sent · Reference AM-/)).toBeInTheDocument();
    expect(screen.getByText(/has been sent to our office/)).toBeInTheDocument();
    expect(screen.getByText("What happens next")).toBeInTheDocument();
    expect(String(send.mock.calls[0]?.[1]?.body)).toContain("vessel=MV+Example");
    vi.unstubAllGlobals();
  });

  it("never claims the enquiry was sent when the service refuses it", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false, text: async () => "" }));
    render(<EnquiryForm part="Fuel pump" delivery="netlify" />);
    fillRequired();
    fireEvent.click(screen.getByRole("button", { name: /send enquiry/i }));
    expect(await screen.findByText(/^Not sent · Reference AM-/)).toBeInTheDocument();
    expect(screen.getByText(/nothing has reached us yet/)).toBeInTheDocument();
    expect(screen.queryByText("What happens next")).toBeNull();
    expect(screen.queryByText(/has been sent to our office/)).toBeNull();
    vi.unstubAllGlobals();
  });
});
