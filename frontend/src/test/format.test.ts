import { describe, it, expect } from "vitest";
import { formatNotional, formatDate, formatDateTime } from "@/lib/format";

describe("formatNotional", () => {
  it("formats as a currency with thousands separators", () => {
    expect(formatNotional(1_250_000, "USD")).toBe("$1,250,000");
  });

  it("handles unknown currency codes gracefully", () => {
    const result = formatNotional(5_000, "XYZ");
    expect(result).toContain("5,000");
  });
});

describe("formatDate", () => {
  it("renders an ISO date in a human-readable form", () => {
    const result = formatDate("2026-02-12");
    expect(result).toMatch(/12 Feb 2026/);
  });

  it("renders an em-dash for nullish input", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate(undefined)).toBe("—");
  });
});

describe("formatDateTime", () => {
  it("renders an em-dash for null input", () => {
    expect(formatDateTime(null)).toBe("—");
  });
});
