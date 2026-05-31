"use client";

import * as React from "react";
import type { Address } from "viem";
import { useWallet } from "./wallet";
import { useStore } from "./store";
import { managerPlan, riskEvaluate, writerReport, type VeniceMeta } from "./venice";
import { requestPaidData, settleAndDeliver } from "./x402";
import { createSmartAccount, SALT } from "./smart-account";
import { createRootDelegation, createRedelegation, executeRedelegatedPayment, type SignedDelegation } from "./redelegation";
import type { Mission, AgentCharter } from "./types";
import { uid } from "./utils";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export type Phase = "idle" | "planning" | "delegating" | "research" | "risk" | "redelegating" | "paying" | "writing" | "done" | "rejected";

export function useMissionRunner(mission: Mission, charters: AgentCharter[]) {
  const { account, correctChain } = useWallet();
  const store = useStore();
  const [phase, setPhase] = React.useState<Phase>("idle");
  const [veniceMeta, setVeniceMeta] = React.useState<VeniceMeta>();
  const running = !["idle", "done", "rejected"].includes(phase);

  const msg = (from: string, to: string, message: string, kind: "instruct" | "report" | "request" | "approve" | "execute") =>
    store.addMessage({ id: uid("msg"), missionId: mission.id, from, to, message, kind, timestamp: new Date().toISOString() });

  const step = (label: string, detail?: string) => {
    const id = uid("tl");
    store.addTimeline({ id, missionId: mission.id, label, detail, status: "running", timestamp: new Date().toISOString() });
    return id;
  };
  const done = (id: string, detail?: string) => store.patchTimeline(id, { status: "done", ...(detail ? { detail } : {}) });
  const block = (id: string, detail?: string) => store.patchTimeline(id, { status: "blocked", ...(detail ? { detail } : {}) });

  const payAgent = charters.find((c) => c.role === "Payment");
  const riskAgent = charters.find((c) => c.role === "Risk");

  async function run() {
    store.clearMissionRuntime(mission.id);
    store.updateMission(mission.id, { status: "active" });
    const real = !!account && correctChain;

    // 1. MANAGER PLAN (Venice)
    setPhase("planning");
    const s1 = step("Manager Agent plans the mission", "Venice AI decomposing the goal into role assignments…");
    const { plan, meta } = await managerPlan(mission.goal, mission.roles, mission.budget);
    setVeniceMeta(meta);
    done(s1, plan.summary);
    for (const a of plan.assignments) {
      await sleep(220);
      msg("Manager Agent", `${a.role} Agent`, a.instruction, "instruct");
    }
    const paymentBudget = Math.min(plan.paymentBudget, payAgent?.budget ?? plan.paymentBudget);

    // 2. ROOT DELEGATION  User -> Manager
    setPhase("delegating");
    const s2 = step("User grants mission authority to Manager", real ? "Sign the ERC-7710 delegation in MetaMask…" : "Simulated delegation (no wallet).");
    let userAddr: string = account ?? "0xUSER";
    let managerAddr: string = "0xMANAGER";
    let payAddr: string = "0xPAYMENT";
    let root: SignedDelegation | undefined;

    if (real) {
      const userSA = await createSmartAccount(account!, SALT.user);
      const managerSA = await createSmartAccount(account!, SALT.manager);
      const paymentSA = await createSmartAccount(account!, SALT.payment);
      userAddr = userSA.address; managerAddr = managerSA.address; payAddr = paymentSA.address;
      root = await createRootDelegation(userSA, managerSA.address as Address, mission.budget);
      store.setSigned(mission.id, "root", root);
    }
    store.addLink({
      id: uid("link"), missionId: mission.id,
      fromLabel: "User Wallet", toLabel: "Manager Agent",
      from: userAddr, to: managerAddr,
      authority: "Mission authority", budget: mission.budget,
      scope: "erc20TransferAmount · USDC", isRedelegation: false,
      signature: root?.signature, delegationManager: root?.delegationManager,
      mode: real ? "real" : "simulated",
    });
    done(s2, `Manager may coordinate up to ${mission.budget} USDC.`);

    // 3. RESEARCH -> finds paid data (x402)
    setPhase("research");
    const s3 = step("Research Agent collects data", "Querying free signals, then an x402 paid source…");
    const res = await requestPaidData();
    if (res.status === "ok") {
      done(s3, "Free data was sufficient — no payment needed.");
      await finishNoPayment(real, userAddr);
      return;
    }
    const payment = res.payment;
    done(s3, `Found paid source: ${payment.resource} · ${payment.price} USDC`);
    msg("Research Agent", "Risk Agent", `Paid sentiment data found. Price: ${payment.price} USDC. Seller: ${payment.service}.`, "request");

    // 4. RISK evaluation (Venice)
    setPhase("risk");
    const s4 = step("Risk Agent evaluates the payment", "Venice AI checking seller, price and budget…");
    const verdict = await riskEvaluate(payment.service, payment.price, paymentBudget, payment.purpose);
    if (!verdict.approved) {
      block(s4, verdict.reason);
      msg("Risk Agent", "Manager Agent", `Rejected: ${verdict.reason}`, "report");
      setPhase("rejected");
      store.updateMission(mission.id, { status: "completed" });
      return;
    }
    done(s4, verdict.reason);
    msg("Risk Agent", "Manager Agent", `Approved. ${verdict.reason}`, "approve");

    // 5. REDELEGATION  Manager -> Payment
    setPhase("redelegating");
    const s5 = step("Manager redelegates payment authority to Payment Agent", real ? "Sign the redelegation in MetaMask…" : "Simulated redelegation.");
    let redel: SignedDelegation | undefined;
    if (real && root) {
      const managerSA = await createSmartAccount(account!, SALT.manager);
      redel = await createRedelegation(managerSA, payAddr as Address, paymentBudget, root);
      store.setSigned(mission.id, "redelegation", redel);
    }
    store.addLink({
      id: uid("link"), missionId: mission.id,
      fromLabel: "Manager Agent", toLabel: "Payment Agent",
      from: managerAddr, to: payAddr,
      authority: "Payment authority (redelegated)", budget: paymentBudget,
      scope: "erc20TransferAmount · USDC", isRedelegation: true,
      signature: redel?.signature, delegationManager: redel?.delegationManager,
      mode: real ? "real" : "simulated",
    });
    done(s5, `Payment Agent may spend up to ${paymentBudget} USDC — far less than the mission budget.`);
    msg("Manager Agent", "Payment Agent", `Redelegated authority approved. Execute payment up to ${paymentBudget} USDC.`, "execute");

    // 6. PAYMENT execution (redeem chain)
    setPhase("paying");
    const s6 = step("Payment Agent executes x402 payment", "Redeeming the redelegation → root chain…");
    let txHash = "0x" + uid("sim").replace(/[^a-f0-9]/g, "0").padEnd(64, "0");
    let execMode: "real" | "simulated" = "simulated";
    let note: string | undefined;
    if (real && root && redel) {
      const userSA = await createSmartAccount(account!, SALT.user);
      const managerSA = await createSmartAccount(account!, SALT.manager);
      const paymentSA = await createSmartAccount(account!, SALT.payment);
      const r = await executeRedelegatedPayment(
        redel,
        root,
        { paymentSA, userSA, managerSA, delegateEOA: account! },
        payment.payTo as Address,
        payment.price
      );
      txHash = r.transactionHash; execMode = r.mode; note = r.note;
    }
    done(s6, `${execMode === "real" ? "On-chain" : "Simulated"} redemption · ${txHash.slice(0, 14)}…`);

    const delivered = await settleAndDeliver(res.endpoint, txHash);
    const paidData = JSON.stringify((delivered as { resource?: unknown }).resource ?? delivered);
    msg("Payment Agent", "Writer Agent", "Paid data received. Generate the final report.", "report");

    // 7. WRITER report (Venice)
    setPhase("writing");
    const s7 = step("Writer Agent generates the final report", "Venice AI writing…");
    const { body, meta: wMeta } = await writerReport(mission.goal, paidData, "Risk Agent", "Payment Agent");
    setVeniceMeta(wMeta);
    done(s7);

    store.setReport({
      missionId: mission.id,
      riskLevel: "Medium",
      paidDataUsed: true,
      paymentBy: "Payment Agent",
      approvedBy: "Risk Agent",
      totalSpent: payment.price,
      remaining: mission.budget - payment.price,
      body,
      txHash,
      execMode,
      veniceModel: wMeta.model,
    });
    if (note) msg("Payment Agent", "User", note, "report");
    store.updateMission(mission.id, { status: "completed" });
    setPhase("done");
  }

  async function finishNoPayment(real: boolean, userAddr: string) {
    void real; void userAddr;
    setPhase("writing");
    const s = step("Writer Agent generates the final report", "Venice AI writing (no payment needed)…");
    const { body, meta } = await writerReport(mission.goal, null, "—", "—");
    setVeniceMeta(meta);
    done(s);
    store.setReport({
      missionId: mission.id, riskLevel: "Low", paidDataUsed: false,
      paymentBy: "—", approvedBy: "—", totalSpent: 0, remaining: mission.budget,
      body, execMode: "simulated", veniceModel: meta.model,
    });
    store.updateMission(mission.id, { status: "completed" });
    setPhase("done");
  }

  return { run, running, phase, veniceMeta };
}
