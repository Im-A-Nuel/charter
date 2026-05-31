import { NextResponse } from "next/server";

/**
 * Server-side proxy to the Venice AI API (OpenAI-compatible).
 * Keeps VENICE_API_KEY on the server. Falls back to a deterministic
 * mock so the app always runs, even without a key.
 *
 * Docs: https://docs.venice.ai  base: https://api.venice.ai/api/v1
 */

const VENICE_BASE = process.env.VENICE_BASE_URL || "https://api.venice.ai/api/v1";
const VENICE_MODEL = process.env.VENICE_MODEL || "llama-3.3-70b";

type Msg = { role: "system" | "user" | "assistant"; content: string };

export async function POST(req: Request) {
  const body = (await req.json()) as {
    messages: Msg[];
    json?: boolean;
    temperature?: number;
  };
  const key = process.env.VENICE_API_KEY;

  if (!key) {
    return NextResponse.json({
      text: mockResponse(body.messages, body.json),
      model: "mock-venice",
      mode: "mock",
    });
  }

  try {
    const res = await fetch(`${VENICE_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: VENICE_MODEL,
        messages: body.messages,
        temperature: body.temperature ?? 0.6,
        ...(body.json ? { response_format: { type: "json_object" } } : {}),
        venice_parameters: { include_venice_system_prompt: false },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({
        text: mockResponse(body.messages, body.json),
        model: "mock-venice",
        mode: "mock",
        note: `Venice API error ${res.status}: ${errText.slice(0, 140)} — using fallback`,
      });
    }

    const data = await res.json();
    const text = data?.choices?.[0]?.message?.content ?? "";
    return NextResponse.json({ text, model: data?.model ?? VENICE_MODEL, mode: "real" });
  } catch (e) {
    return NextResponse.json({
      text: mockResponse(body.messages, body.json),
      model: "mock-venice",
      mode: "mock",
      note: `Venice request failed: ${(e as Error).message} — using fallback`,
    });
  }
}

/** Deterministic, context-aware mock so demos work without a key. */
function mockResponse(messages: Msg[], json?: boolean): string {
  const last = messages[messages.length - 1]?.content ?? "";
  const lower = last.toLowerCase();
  const system = (messages.find((m) => m.role === "system")?.content ?? "").toLowerCase();

  // MANAGER plan — must match the ManagerPlan shape { summary, assignments, paymentBudget }.
  if (json && (system.includes("manager agent") || /available roles:/i.test(last))) {
    const rolesMatch = last.match(/available roles:\s*([^\n]+)/i);
    const roles = rolesMatch
      ? rolesMatch[1].split(",").map((r) => r.trim()).filter(Boolean)
      : ["Manager", "Research", "Risk", "Payment", "Writer"];
    const missionBudget = Number(last.match(/budget:\s*([\d.]+)/i)?.[1] ?? "5");
    const instructions: Record<string, string> = {
      Manager: "Coordinate the mission and redelegate scoped payment authority.",
      Research: "Collect free public and on-chain signals for the target.",
      Risk: "Approve a paid data purchase only if it is safe and within the redelegated budget.",
      Payment: "Execute an x402 payment only with redelegated authority and Risk approval.",
      Writer: "Synthesize all findings into a final risk report.",
    };
    return JSON.stringify({
      summary:
        "Use free signals first; buy one policy-approved paid data source only if it materially improves the risk call, then write the report.",
      assignments: roles.map((role) => ({
        role,
        instruction: instructions[role] ?? `Handle ${role} duties for the mission.`,
      })),
      paymentBudget: Math.min(1, missionBudget * 0.2),
    });
  }

  // RISK evaluation — must match { approved, reason }; reject when price exceeds the budget.
  if (json && system.includes("risk agent")) {
    const price = Number(last.match(/price:\s*([\d.]+)/i)?.[1] ?? "0");
    const budget = Number(last.match(/budget:\s*([\d.]+)/i)?.[1] ?? "0");
    const approved = price <= budget;
    return JSON.stringify({
      approved,
      reason: approved
        ? "Seller is verified, price is within the redelegated budget, and the purpose matches the mission."
        : `Price ${price} USDC exceeds the redelegated budget of ${budget} USDC.`,
    });
  }

  // WRITER final report (markdown).
  if (lower.includes("risk report") || lower.includes("final report")) {
    return [
      "## Risk Assessment",
      "",
      "**Verdict:** Medium short-term risk.",
      "",
      "Free price and on-chain activity were inconclusive on their own, so a paid sentiment report was purchased under the charter. Social sentiment is mildly negative with elevated derivative funding — consistent with a short-term pullback risk, but no structural red flags.",
      "",
      "- Liquidity: healthy",
      "- Sentiment: slightly negative (paid signal)",
      "- Volatility: elevated",
      "",
      "_Generated by the agent using free data + one policy-approved paid datapoint._",
    ].join("\n");
  }

  return "The agent evaluated the request and proceeded within the bounds of the active charter.";
}
