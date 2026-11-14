import { act, cleanup, render } from "@testing-library/react";
import { afterEach, expect, it, vi } from "vitest";
import { Intro } from "@/components/site/Cinematic";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  sessionStorage.clear();
});

it("keeps the first screen for five seconds before automatically dismissing it", () => {
  vi.useFakeTimers();
  sessionStorage.clear();
  const { container } = render(<Intro />);
  act(() => vi.advanceTimersByTime(4250));
  act(() => vi.advanceTimersByTime(749));
  expect(container.firstChild).not.toBeNull();
  act(() => vi.advanceTimersByTime(1));
  expect(container.firstChild).toBeNull();
});

it("waits for moving video before fading out on a slow connection", () => {
  vi.useFakeTimers();
  const { container, rerender } = render(<Intro ready={false} />);
  act(() => vi.advanceTimersByTime(5000));
  expect(container.firstChild).not.toBeNull();
  rerender(<Intro ready />);
  act(() => vi.advanceTimersByTime(749));
  expect(container.firstChild).not.toBeNull();
  act(() => vi.advanceTimersByTime(1));
  expect(container.firstChild).toBeNull();
});