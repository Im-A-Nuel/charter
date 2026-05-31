import type { Address, Hex } from "viem";

export type Role = "Manager" | "Research" | "Risk" | "Payment" | "Writer";

export interface Mission {
  id: string;
  name: string;
  goal: string;
  budget: number;
  token: "USDC";
  durationHours: number;
  roles: Role[];
  status: "draft" | "active" | "completed";
  createdAt: string;
  user: Address | string;
}

export interface AgentCharter {
  id: string;
  missionId: string;
  agent: string;
  role: Role;
  description: string;
  canSpend: boolean;
  budget: number; // USDC authority
  canApprove: boolean;
  canRedelegate: boolean;
  allowedServices: string[];
  smartAccount?: Address;
}

export type LinkMode = "real" | "simulated";

/** An edge in the chain of authority (a delegation or redelegation). */
export interface PermissionLink {
  id: string;
  missionId: string;
  fromLabel: string;
  toLabel: string;
  from: Address | string;
  to: Address | string;
  authority: string; // human label e.g. "Mission authority"
  budget: number;
  scope: string; // e.g. "erc20TransferAmount · USDC"
  isRedelegation: boolean;
  signature?: Hex;
  delegationManager?: Address;
  mode: LinkMode;
}

export interface AgentMessage {
  id: string;
  missionId: string;
  from: string;
  to: string;
  message: string;
  kind: "instruct" | "report" | "request" | "approve" | "execute";
  timestamp: string;
}

export interface TimelineStep {
  id: string;
  missionId: string;
  label: string;
  detail?: string;
  status: "pending" | "running" | "done" | "blocked";
  timestamp: string;
}

export interface FinalReport {
  missionId: string;
  riskLevel: "Low" | "Medium" | "High";
  paidDataUsed: boolean;
  paymentBy: string;
  approvedBy: string;
  totalSpent: number;
  remaining: number;
  body: string;
  txHash?: string;
  execMode: LinkMode;
  veniceModel: string;
}

/** x402 payment request parsed from a 402 response. */
export interface PaymentRequest {
  id: string;
  service: string;
  resource: string;
  price: number;
  token: "USDC";
  payTo: Address | string;
  purpose: string;
  scheme: string;
  network: string;
  raw402?: unknown;
}

export const ROLE_LIBRARY: Record<Role, { description: string; canSpend: boolean; canApprove: boolean; canRedelegate: boolean }> = {
  Manager: { description: "Coordinates the mission and redelegates scoped authority.", canSpend: false, canApprove: false, canRedelegate: true },
  Research: { description: "Collects public and on-chain data. Cannot spend.", canSpend: false, canApprove: false, canRedelegate: false },
  Risk: { description: "Approves or rejects payment requests. Cannot spend.", canSpend: false, canApprove: true, canRedelegate: false },
  Payment: { description: "Executes x402 payments via redelegated authority.", canSpend: true, canApprove: false, canRedelegate: false },
  Writer: { description: "Generates the final report. Cannot spend.", canSpend: false, canApprove: false, canRedelegate: false },
};
