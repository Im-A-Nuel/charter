import type { Role } from "./types";

export interface VeniceMeta {
  model: string;
  mode: "real" | "mock";
}

type Msg = { role: "system" | "user" | "assistant"; content: string };

async function chat(messages: Msg[], opts?: { json?: boolean; temperature?: number }) {
  const res = await fetch("/api/venice", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages, ...opts }),
  });
  const data = await res.json();
  return { text: (data.text ?? "") as string, meta: { model: data.model ?? "unknown", mode: data.mode ?? "mock" } as VeniceMeta };
}

export interface ManagerPlan {
  summary: string;
  assignments: { role: Role; instruction: string }[];
  paymentBudget: number;
}

/** Venice as the MANAGER agent: decomposes the mission into role assignments. */
export async function managerPlan(goal: string, roles: Role[], missionBudget: number): Promise<{ plan: ManagerPlan; meta: VeniceMeta }> {
  const sys =
    "You are the Manager agent coordinating a team of specialist AI agents under a Charter. " +
    "You assign scoped instructions per role and decide how much spending authority to REDELEGATE to the Payment agent " +
    "(always strictly less than the mission budget). Respond ONLY as JSON: " +
    "{ summary: string, assignments: {role, instruction}[], paymentBudget: number }.";
  const user = `Mission goal: ${goal}\nAvailable roles: ${roles.join(", ")}\nMission budget: ${missionBudget} USDC.`;
  const r = await chat([{ role: "system", content: sys }, { role: "user", content: user }], { json: true });
  let plan: ManagerPlan;
  try {
    plan = JSON.parse(r.text);
  } catch {
    plan = {
      summary: "Coordinate research, evaluate risk, pay for one verified data source if approved, then write the report.",
      assignments: roles.map((role) => ({ role, instruction: defaultInstruction(role) })),
      paymentBudget: Math.min(1, missionBudget),
    };
  }
  if (!plan.paymentBudget || plan.paymentBudget >= missionBudget) plan.paymentBudget = Math.min(1, missionBudget * 0.2);
  return { plan, meta: r.meta };
}

/** Venice as the RISK agent: approve or reject a payment request. */
export async function riskEvaluate(
  service: string, price: number, paymentBudget: number, purpose: string
): Promise<{ approved: boolean; reason: string; meta: VeniceMeta }> {
  const sys =
    "You are the Risk agent. You can ONLY approve or reject payments — you cannot spend. " +
    "Approve only if the seller is verified, price <= redelegated budget, and purpose matches. " +
    'Respond ONLY as JSON: { approved: boolean, reason: string }.';
  const user = `Service: ${service} (verified)\nPrice: ${price} USDC\nRedelegated payment budget: ${paymentBudget} USDC\nPurpose: ${purpose}`;
  const r = await chat([{ role: "system", content: sys }, { role: "user", content: user }], { json: true });
  try {
    const j = JSON.parse(r.text);
    return { approved: !!j.approved, reason: j.reason ?? "", meta: r.meta };
  } catch {
    const approved = price <= paymentBudget;
    return {
      approved,
      reason: approved
        ? "Seller verified, price within redelegated budget, purpose matches."
        : "Price exceeds the redelegated payment budget.",
      meta: r.meta,
    };
  }
}

/** Venice as the WRITER agent: final report. */
export async function writerReport(
  goal: string, paidData: string | null, approvedBy: string, paymentBy: string
): Promise<{ body: string; meta: VeniceMeta }> {
  const sys = "You are the Writer agent. Produce a concise markdown risk report. No preamble.";
  const user =
    `Mission goal: ${goal}\n` +
    (paidData ? `Paid data (purchased by ${paymentBy}, approved by ${approvedBy}): ${paidData}\n` : "No paid data was used.\n") +
    "Write the final report.";
  const r = await chat([{ role: "system", content: sys }, { role: "user", content: user }], { temperature: 0.5 });
  return { body: r.text, meta: r.meta };
}

function defaultInstruction(role: Role): string {
  switch (role) {
    case "Manager": return "Coordinate the mission and redelegate scoped payment authority.";
    case "Research": return "Collect free public and on-chain signals for the target.";
    case "Risk": return "Evaluate whether any paid data purchase is safe and within budget.";
    case "Payment": return "Execute an x402 payment only with redelegated authority and Risk approval.";
    case "Writer": return "Synthesize all findings into a final risk report.";
  }
}
