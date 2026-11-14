import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { EnquiryForm } from "@/components/site/EnquiryForm";
import { DRAFT_STORAGE_KEY, applyPaste, buildEnquiry, emptyFields, emptyItem, formatWhen, isValidImo, mailtoHref, makeReference, nextEnquiry, parseDraft, parsePastedCells, responseTimes, type EnquiryInput } from "@/lib/enquiry";

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
