import { describe, expect, it } from "vitest";
import { CONTACT, FAQ, HERO_FACTS } from "@/components/site/content";

describe("Confirmed company rules", () => {
  it("uses the confirmed company name", () => {
    expect(CONTACT.company).toBe("Activ Marine Limited");
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