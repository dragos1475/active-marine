import { act, cleanup, render, screen, fireEvent } from "@testing-library/react";
import { afterEach, expect, it } from "vitest";
import { ThemeProvider, useSiteTheme, THEME_STORAGE_KEY } from "@/components/site/Theme";

function Controls() {
  const { theme, setTheme } = useSiteTheme();
  return <><output>{theme}</output>{(["light", "medium", "dark"] as const).map(value => <button key={value} onClick={() => setTheme(value)}>{value}</button>)}</>;
}
afterEach(() => { cleanup(); localStorage.clear(); delete document.documentElement.dataset['theme']; document.documentElement.classList.remove("dark"); });

it("defaults to light when no preference is saved", () => {
  render(<ThemeProvider><Controls /></ThemeProvider>);
  expect(document.documentElement.dataset['theme']).toBe("light");
});
it.each(["medium", "dark", "light"] as const)("applies and saves the %s theme", (theme) => {
  render(<ThemeProvider><Controls /></ThemeProvider>);
  fireEvent.click(screen.getByRole("button", { name: theme }));
  expect(document.documentElement.dataset['theme']).toBe(theme);
  expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe(theme);
});
it("restores the saved choice after remounting", () => {
  localStorage.setItem(THEME_STORAGE_KEY, "medium");
  act(() => { render(<ThemeProvider><Controls /></ThemeProvider>); });
  expect(document.documentElement.dataset['theme']).toBe("medium");
});