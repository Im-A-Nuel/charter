import { describe, it, expect } from "vitest";
import { POST } from "./route";

function post(body: unknown, raw = false) {
  return POST(
    new Request("http://localhost/api/venice", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: raw ? (body as string) : JSON.stringify(body),
    })
  );
}

describe("POST /api/venice (mock path, no API key)", () => {
  it("rejects malformed JSON with 400", async () => {
    const res = await post("{ not json", true);
    expect(res.status).toBe(400);
  });

  it("rejects a missing messages array with 400", async () => {
    const res = await post({ json: true });
    expect(res.status).toBe(400);
  });

  it("returns a Risk verdict matching { approved, reason }", async () => {
    const res = await post({
      messages: [
        { role: "system", content: "You are the Risk agent." },
        { role: "user", content: "Price: 0.25 USDC\nBudget: 1 USDC" },
      ],
      json: true,
    });
    const data = await res.json();
    const verdict = JSON.parse(data.text);
    expect(verdict.approved).toBe(true);
    expect(typeof verdict.reason).toBe("string");
  });

  it("rejects when price exceeds budget", async () => {
    const res = await post({
      messages: [
        { role: "system", content: "You are the Risk agent." },
        { role: "user", content: "Price: 9 USDC\nBudget: 1 USDC" },
      ],
      json: true,
    });
    const verdict = JSON.parse((await res.json()).text);
    expect(verdict.approved).toBe(false);
  });

  it("returns a Manager plan with one assignment per role", async () => {
    const res = await post({
      messages: [
        { role: "system", content: "You are the Manager agent." },
        { role: "user", content: "Available roles: Manager, Research, Risk\nMission budget: 5 USDC" },
      ],
      json: true,
    });
    const plan = JSON.parse((await res.json()).text);
    expect(plan.assignments).toHaveLength(3);
    expect(plan.paymentBudget).toBeLessThan(5); // redelegated budget strictly smaller
  });
});
