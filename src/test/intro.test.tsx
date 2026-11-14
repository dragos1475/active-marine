import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Intro } from "@/components/site/Cinematic";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  sessionStorage.clear();
});

it("keeps the first screen for three seconds before automatically dismissing it", () => {
  vi.useFakeTimers();
  sessionStorage.clear();
  const { container } = render(<Intro />);
  act(() => vi.advanceTimersByTime(2250));
  act(() => vi.advanceTimersByTime(749));
  expect(container.firstChild).not.toBeNull();
  act(() => vi.advanceTimersByTime(1));
  expect(container.firstChild).toBeNull();
});

it("waits for the page to be ready before fading out on a slow connection", () => {
  vi.useFakeTimers();
  const { container, rerender } = render(<Intro ready={false} />);
  act(() => vi.advanceTimersByTime(3000));
  expect(container.firstChild).not.toBeNull();
  rerender(<Intro ready />);
  act(() => vi.advanceTimersByTime(749));
  expect(container.firstChild).not.toBeNull();
  act(() => vi.advanceTimersByTime(1));
  expect(container.firstChild).toBeNull();
});

it("does not repeat the intro when returning to the homepage in the same session", () => {
  vi.useFakeTimers();
  const firstVisit = render(<Intro />);
  act(() => vi.advanceTimersByTime(2250));
  act(() => vi.advanceTimersByTime(750));
  expect(firstVisit.container.firstChild).toBeNull();
  firstVisit.unmount();
  const returnVisit = render(<Intro />);
  expect(returnVisit.container.firstChild).toBeNull();
});

it("lets a visitor skip the intro with the Skip button or the Escape key", () => {
  vi.useFakeTimers();
  const byButton = render(<Intro />);
  fireEvent.click(screen.getByRole("button", { name: "Skip intro" }));
  expect(byButton.container.firstChild).toBeNull();
  byButton.unmount();
  sessionStorage.clear();
  const byKey = render(<Intro />);
  expect(byKey.container.firstChild).not.toBeNull();
  fireEvent.keyDown(window, { key: "Escape" });
  expect(byKey.container.firstChild).toBeNull();
});
