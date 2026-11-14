import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";

// The header is tested for grouping, not for look: links need a router, so the
// navigation primitive is replaced with a plain anchor.
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, to, activeProps, ...rest }: { children?: React.ReactNode; to: string; activeProps?: unknown }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));

import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Sections";

afterEach(cleanup);

function bar() {
  render(<Header onQuote={() => {}} />);
  const header = screen.getByRole("banner");
  const logo = screen.getByRole("link", { name: "Activ Marine home" });
  // The main bar holds the logo group; the status strip sits above it.
  const container = logo.parentElement?.parentElement as HTMLElement;
  const nav = screen.getByRole("navigation", { name: "Main navigation" });
  const quote = screen.getByRole("button", { name: /send enquiry/i });
  return { container, logo, nav, quote };
}

it("keeps the logo and the menu together as the left group", () => {
  const { logo, nav } = bar();
  const leftGroup = logo.parentElement as HTMLElement;
  expect(leftGroup).toBe(nav.parentElement);
});

it("puts the enquiry button in a separate right group", () => {
  const { container, logo, quote } = bar();
  const leftGroup = logo.parentElement as HTMLElement;
  const rightGroup = quote.parentElement as HTMLElement;
  expect(rightGroup).not.toBe(leftGroup);
  expect(rightGroup.parentElement).toBe(container);
  expect(leftGroup.parentElement).toBe(container);
});

it("keeps the header to five destinations and leaves the theme choice to the footer", () => {
  const { nav } = bar();
  expect(within(nav).getAllByRole("link").map((link) => link.textContent)).toEqual(["Network", "Projects", "About", "Contact"]);
  expect(within(nav).getByRole("button", { name: /services/i })).toBeInTheDocument();
  expect(within(screen.getByRole("banner")).queryByLabelText("Choose theme")).toBeNull();
  cleanup();
  render(<Footer />);
  const footer = screen.getByRole("contentinfo");
  expect(within(footer).getByLabelText("Choose theme")).toBeInTheDocument();
  expect(within(footer).getByRole("link", { name: "FAQ" })).toBeInTheDocument();
  expect(within(footer).getByRole("link", { name: "Insights" })).toBeInTheDocument();
});

it("shows the response commitment and the office email in the status strip", () => {
  bar();
  const header = screen.getByRole("banner");
  expect(within(header).getByText("Enquiries acknowledged within 2 hours")).toBeInTheDocument();
  expect(within(header).getAllByRole("link", { name: "office@activ-marine.com" }).length).toBeGreaterThan(0);
});

it("lets the bar span the screen on very wide monitors instead of a centred column", () => {
  const { container } = bar();
  expect(container.className).toContain("3xl:max-w-none");
  expect(container.className).toContain("3xl:px-[7vw]");
});
