import { cleanup, render, screen } from "@testing-library/react";
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

afterEach(cleanup);

function bar() {
  render(<Header onQuote={() => {}} />);
  const header = screen.getByRole("banner");
  const container = header.firstElementChild as HTMLElement;
  const logo = screen.getByRole("link", { name: "ActivMarine home" });
  const nav = screen.getByRole("navigation", { name: "Main navigation" });
  const quote = screen.getByRole("button", { name: /request a quote/i });
  return { container, logo, nav, quote };
}

it("keeps the logo and the menu together as the left group", () => {
  const { logo, nav } = bar();
  const leftGroup = logo.parentElement as HTMLElement;
  expect(leftGroup).toBe(nav.parentElement);
});

it("puts the theme selector and the quote button in a separate right group", () => {
  const { container, logo, quote } = bar();
  const leftGroup = logo.parentElement as HTMLElement;
  const rightGroup = quote.parentElement as HTMLElement;
  expect(rightGroup).not.toBe(leftGroup);
  expect(rightGroup.parentElement).toBe(container);
  expect(leftGroup.parentElement).toBe(container);
  expect(rightGroup.querySelector('[aria-label="Choose theme"]')).not.toBeNull();
});

it("lets the bar span the screen on very wide monitors instead of a centred column", () => {
  const { container } = bar();
  expect(container.className).toContain("3xl:max-w-none");
  expect(container.className).toContain("3xl:px-[7vw]");
});
