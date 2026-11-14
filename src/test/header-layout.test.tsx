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
  const container = logo.parentElement?.parentElement as HTMLElement;
  const nav = screen.getByRole("navigation", { name: "Main navigation" });
  const quote = screen.getByRole("button", { name: /send enquiry/i });
  return { container, logo, nav, quote };
}

it("places the menu on its own between the logo and the enquiry button", () => {
  const { container, logo, nav, quote } = bar();
  const leftGroup = logo.parentElement as HTMLElement;
  const rightGroup = quote.parentElement as HTMLElement;
  expect([...container.children]).toEqual([leftGroup, nav, rightGroup]);
  expect(container.className).toContain("xl:grid-cols-[1fr_auto_1fr]");
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

it("lets the bar span the screen so the logo and the button sit near the edges", () => {
  const { container } = bar();
  expect(container.className).not.toContain("max-w-7xl");
  expect(container.className).not.toContain("mx-auto");
});
