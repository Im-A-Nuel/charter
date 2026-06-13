import { describe, it, expect } from "vitest";
import { GET } from "./route";

describe("GET /api/x402/sentiment", () => {
  it("returns a 402 x402 envelope without payment", async () => {
    const res = await GET(new Request("http://localhost/api/x402/sentiment"));
    expect(res.status).toBe(402);
    const body = await res.json();
    const accept = body.accepts?.[0];
    expect(accept.scheme).toBe("exact");
    expect(accept.network).toBe("base-sepolia");
    expect(accept.maxAmountRequired).toBe("250000"); // 0.25 USDC, 6dp
    expect(accept.payTo).toMatch(/^0x/);
  });

  it("delivers the resource with an X-PAYMENT proof", async () => {
    const res = await GET(
      new Request("http://localhost/api/x402/sentiment", { headers: { "x-payment": "0xdeadbeef" } })
    );
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.paid).toBe(true);
    expect(body.paymentProof).toBe("0xdeadbeef");
    expect(body.resource.asset).toBe("ETH");
  });
});
