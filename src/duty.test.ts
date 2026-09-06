import { describe, expect, test } from "vitest";
import {
  calculateHomeDuty,
  calculateHomeDutyWithFhbas,
  calculateMotorVehicleDuty,
} from "./duty";

describe("calculateHomeDuty", () => {
  test("applies the $20 minimum in the first bracket", () => {
    expect(calculateHomeDuty(200)).toBe(20);
  });

  test("applies 1.25% for values up to $18,000", () => {
    expect(calculateHomeDuty(10000)).toBe(125);
  });

  test("matches Revenue NSW example for $450,000", () => {
    expect(calculateHomeDuty(450000)).toBeCloseTo(14437);
  });

  test("matches Revenue NSW example for $1,350,000", () => {
    expect(calculateHomeDuty(1350000)).toBeCloseTo(55537);
  });

  test("matches Revenue NSW premium duty example for $4,000,000", () => {
    expect(calculateHomeDuty(4000000)).toBeCloseTo(203237);
  });

  test("applies the 5.5% top bracket between $1.29m and $3.87m", () => {
    expect(calculateHomeDuty(2000000)).toBeCloseTo(
      52237 + (5.5 * (2000000 - 1290000)) / 100
    );
  });

  test("applies the 7% premium bracket above $3.87m", () => {
    expect(calculateHomeDuty(5000000)).toBeCloseTo(
      194137 + (7 * (5000000 - 3870000)) / 100
    );
  });
});

describe("calculateHomeDutyWithFhbas", () => {
  test("exempts duty up to $800,000", () => {
    expect(calculateHomeDutyWithFhbas(799999)).toBe(0);
    expect(calculateHomeDutyWithFhbas(800000)).toBe(0);
  });

  test("applies the sliding concession between $800k and $1m", () => {
    const fullDuty = calculateHomeDuty(900000);
    const dutyAtExemption = calculateHomeDuty(800000);
    const expected = fullDuty - dutyAtExemption * 0.5;
    expect(calculateHomeDutyWithFhbas(900000)).toBeCloseTo(expected);
  });

  test("returns full duty at or above $1,000,000", () => {
    expect(calculateHomeDutyWithFhbas(1000000)).toBe(
      calculateHomeDuty(1000000)
    );
    expect(calculateHomeDutyWithFhbas(1200000)).toBe(
      calculateHomeDuty(1200000)
    );
  });
});

describe("calculateMotorVehicleDuty", () => {
  test("applies 3% below $45,000", () => {
    expect(calculateMotorVehicleDuty(44000)).toBeCloseTo(1320);
  });

  test("applies $1,350 at the $45,000 threshold", () => {
    expect(calculateMotorVehicleDuty(45000)).toBe(1350);
  });

  test("adds 5% over $45,000 above the threshold", () => {
    expect(calculateMotorVehicleDuty(60000)).toBe(
      1350 + (5 * (60000 - 45000)) / 100
    );
  });
});