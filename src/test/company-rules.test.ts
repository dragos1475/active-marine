import { describe, expect, it } from "vitest";
import { CONTACT, CONTACT_TEL, FAQ, HERO_FACTS } from "@/components/site/content";

describe("Confirmed company rules", () => {
  it("uses the confirmed company name", () => {
    expect(CONTACT.company).toBe("Activ Marine Limited");
  });
  it("shows the contact details the company confirmed, and no WhatsApp number", () => {
    expect(CONTACT.email).toBe("enquiry@activ-marine.com");
    expect(CONTACT.phone).toBe("+86 166 2120 4292");
    expect(CONTACT_TEL).toBe("tel:+8616621204292");
    expect(CONTACT.wechat).toBe("ActivMarine");
    expect(CONTACT.address).toEqual(["2nd Floor, No. 25-1 Hongcao Road", "Xuhui District, Shanghai", "PR China"]);
    expect(CONTACT).not.toHaveProperty("whatsapp");
  });
  it("covers all Chinese ports including Hong Kong", () => {
    expect(FAQ.find((item) => item.q === "Which ports do you cover?")?.a).toBe("All Chinese ports including Hong Kong");
  });
  it("commits to acknowledgement within 2 hours and aims for availability and pricing within 48 hours", () => {
    const response = FAQ.find((item) => item.q === "How fast can you respond?")?.a;
    expect(response).toContain("acknowledge all enquiries within 2 hours");
    expect(response).toContain("trying our best");
    expect(response).toContain("availability and pricing within 48 hours");
  });
  it("states only the confirmed response times and port coverage on the homepage hero", () => {
    expect(HERO_FACTS.map((fact) => fact.value)).toEqual(["2 h", "48 h", "All ports"]);
    expect(HERO_FACTS[1].label).toContain("Target");
    expect(HERO_FACTS[2].label).toContain("Hong Kong");
  });
});