import type { Role } from "./types";

export interface TemplatePreset {
  name: string;
  goal: string;
  budget: number;
  roles: Role[];
}

/** Mission presets keyed by template id (see /templates). Manager is always included. */
export const TEMPLATE_PRESETS: Record<string, TemplatePreset> = {
  procurement: {
    name: "Procurement Agent",
    goal: "Source 3 office-supply vendors, shortlist the best by price and lead time, and pay a refundable deposit to the top pick — within budget.",
    budget: 25,
    roles: ["Manager", "Research", "Risk", "Payment", "Writer"],
  },
  "market-scan": {
    name: "Market Scan",
    goal: "Survey a market segment, gather competitor data, and return a ranked briefing with sources.",
    budget: 12,
    roles: ["Manager", "Research", "Writer"],
  },
  "budget-analyst": {
    name: "Budget Analyst",
    goal: "Forecast and reconcile this mission's spend with Venice, flagging anything over the cap.",
    budget: 8,
    roles: ["Manager", "Research", "Risk", "Writer"],
  },
  "ledger-query": {
    name: "Ledger Query",
    goal: "Answer questions about on-chain settlements in plain language and cite the txHashes.",
    budget: 4,
    roles: ["Manager", "Research", "Writer"],
  },
  "report-writer": {
    name: "Report Writer",
    goal: "Turn a completed mission's timeline and A2A log into a shareable executive summary.",
    budget: 6,
    roles: ["Manager", "Writer"],
  },
  outreach: {
    name: "Outreach Sequencer",
    goal: "Draft, schedule, and pay for a multi-touch outreach run within a fixed campaign budget.",
    budget: 20,
    roles: ["Manager", "Research", "Risk", "Payment", "Writer"],
  },
  compliance: {
    name: "Compliance Sweep",
    goal: "Run rule-based and model-graded checks across the mission before any funds are released.",
    budget: 5,
    roles: ["Manager", "Risk", "Writer"],
  },
  "data-pull": {
    name: "Data Pull · x402",
    goal: "Buy a metered dataset through x402, normalize it, and hand it to downstream agents.",
    budget: 10,
    roles: ["Manager", "Research", "Payment", "Writer"],
  },
};
