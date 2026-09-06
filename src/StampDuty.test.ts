import { describe, expect, test } from "vitest";
import { cleanDutyInput, formatDutyInput } from "./StampDuty";

describe("cleanDutyInput", () => {
  test("strips dollar sign and commas", () => {
    expect(cleanDutyInput("$1,234,567.50")).toBe("1234567.50");
  });

  test("removes non-numeric characters", () => {
    expect(cleanDutyInput("$abc12.x34")).toBe("12.34");
  });

  test("keeps only the first decimal point", () => {
    expect(cleanDutyInput("1.2.3")).toBe("1.23");
  });
});

describe("formatDutyInput", () => {
  test("groups thousands with commas", () => {
    expect(formatDutyInput("1234567")).toBe("$1,234,567");
  });

  test("preserves decimal digits", () => {
    expect(formatDutyInput("1234.50")).toBe("$1,234.50");
  });

  test("handles a lone decimal point", () => {
    expect(formatDutyInput("12.")).toBe("$12.");
  });
});