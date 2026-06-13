import { describe, it, expect } from "vitest";
import { toUnits, shortAddr, uid } from "./utils";

describe("toUnits (USDC 6dp → base units)", () => {
  it("converts whole numbers", () => {
    expect(toUnits(5)).toBe(5_000_000n);
    expect(toUnits(0)).toBe(0n);
  });
  it("converts fractional amounts", () => {
    expect(toUnits(0.25)).toBe(250_000n);
    expect(toUnits("1.5")).toBe(1_500_000n);
  });
  it("never over-pads fractions beyond 6 decimals", () => {
    expect(toUnits("1.1234567")).toBe(1_123_456n);
  });
});

describe("shortAddr", () => {
  it("truncates an address keeping head+tail", () => {
    expect(shortAddr("0x71C2abcdef0000000000000000000000000000009a3")).toBe("0x71C2…09a3");
    expect(shortAddr("0x71C2abcdef0000000000000000000000000000009a3", 3)).toBe("0x71C…9a3");
  });
  it("returns empty string for undefined", () => {
    expect(shortAddr(undefined)).toBe("");
  });
});

describe("uid", () => {
  it("prefixes and is unique-ish", () => {
    const a = uid("mission");
    const b = uid("mission");
    expect(a.startsWith("mission_")).toBe(true);
    expect(a).not.toBe(b);
  });
});
