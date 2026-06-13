import { describe, it, expect } from "vitest";
import { TEMPLATE_PRESETS } from "./templates";
import { ROLE_VIZ, vizFor } from "./role-visuals";

describe("TEMPLATE_PRESETS", () => {
  const entries = Object.entries(TEMPLATE_PRESETS);

  it("has the eight gallery templates", () => {
    expect(entries.length).toBe(8);
  });

  it.each(entries)("%s is a valid, Manager-led, budgeted mission", (_id, p) => {
    expect(p.name.length).toBeGreaterThan(0);
    expect(p.goal.length).toBeGreaterThan(0);
    expect(p.budget).toBeGreaterThan(0);
    expect(p.roles).toContain("Manager");
    expect(new Set(p.roles).size).toBe(p.roles.length); // no duplicate roles
  });
});

describe("role visuals", () => {
  it("maps each known role to a colour + glyph", () => {
    for (const role of ["User", "Manager", "Research", "Risk", "Payment", "Writer"]) {
      expect(ROLE_VIZ[role]).toBeTruthy();
    }
  });
  it("resolves a label substring", () => {
    expect(vizFor("Manager Agent").glyph).toBe("star");
    expect(vizFor("User Wallet").glyph).toBe("user");
  });
  it("falls back for an unknown label", () => {
    expect(vizFor("Totally Unknown").color).toBeTruthy();
  });
});
