import { describe, expect, it } from "vitest";
import { CONTACT, FAQ } from "@/components/site/content";

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
});