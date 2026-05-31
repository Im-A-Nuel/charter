"use client";

import * as React from "react";
import { useWallet } from "@/lib/wallet";
import { useStore } from "@/lib/store";
import { ROLE_LIBRARY, type Mission, type AgentCharter, type Role } from "@/lib/types";
import { ROLE_VIZ } from "@/lib/role-visuals";
import { uid } from "@/lib/utils";

const ALL_ROLES: Role[] = ["Manager", "Research", "Risk", "Payment", "Writer"];

export function MissionBuilder({ onCreated }: { onCreated?: (id: string) => void }) {
  const { account, correctChain } = useWallet();
  const { createMission } = useStore();
  const onChain = !!account && correctChain;

  const [name, setName] = React.useState("Token Risk Report");
  const [goal, setGoal] = React.useState("Generate a risk report for a new token. Use paid data if needed.");
  const [budget, setBudget] = React.useState("5");
  const [duration, setDuration] = React.useState("24");
  const [roles, setRoles] = React.useState<Role[]>(["Manager", "Research", "Risk", "Payment", "Writer"]);

  function toggle(r: Role) {
    if (r === "Manager") return; // manager is mandatory
    setRoles((p) => (p.includes(r) ? p.filter((x) => x !== r) : [...p, r]));
  }

  function create() {
    const id = uid("mission");
    const mission: Mission = {
      id, name, goal,
      budget: Number(budget), token: "USDC",
      durationHours: Number(duration),
      roles: ALL_ROLES.filter((r) => roles.includes(r)),
      status: "draft",
      createdAt: new Date().toISOString(),
      user: account ?? "0xSIMULATED",
    };
    const charters: AgentCharter[] = mission.roles.map((role) => {
      const lib = ROLE_LIBRARY[role];
      return {
        id: uid("charter"), missionId: id,
        agent: `${role} Agent`, role, description: lib.description,
        canSpend: lib.canSpend, canApprove: lib.canApprove, canRedelegate: lib.canRedelegate,
        budget: role === "Payment" ? Math.min(1, Number(budget) * 0.2) : 0,
        allowedServices: role === "Payment" ? ["verified-x402-api.demo"] : [],
      };
    });
    createMission(mission, charters);
    onCreated?.(id);
  }

  return (
    <section className="dpanel builder">
      <div className="dp-h">
        <div className="t">
          <svg viewBox="0 0 24 24"><path d="M12 3c1.3 1.7 2.7 2.3 4.7 2.5-.2 2 .4 3.4 2 4.7-1.6 1.3-2.2 2.7-2 4.7-2 .2-3.4.8-4.7 2.5-1.3-1.7-2.7-2.3-4.7-2.5.2-2-.4-3.4-2-4.7 1.6-1.3 2.2-2.7 2-4.7 2-.2 3.4-.8 4.7-2.5Z" /></svg>
          Mission Builder
        </div>
        <span className="sub">define · scope · sign</span>
      </div>
      <div className="dp-b">
        {/* left */}
        <div className="b-main">
          <div className="field">
            <label>Mission name</label>
            <input className="inp mono" value={name} onChange={(e) => setName(e.target.value)} spellCheck={false} />
          </div>
          <div className="field">
            <label>Goal <span className="hint">what should the agent team accomplish?</span></label>
            <textarea className="inp" value={goal} onChange={(e) => setGoal(e.target.value)} spellCheck={false} />
          </div>
          <div className="field">
            <label>Roles <span className="hint">Manager is mandatory</span></label>
            <div className="rolepick">
              {ALL_ROLES.map((r) => {
                const on = roles.includes(r);
                const locked = r === "Manager";
                return (
                  <button
                    key={r}
                    type="button"
                    className={`rolechip${on ? " on" : ""}`}
                    style={{ ["--rc" as string]: ROLE_VIZ[r].color }}
                    onClick={() => toggle(r)}
                    disabled={locked}
                  >
                    <span className="rdot" />{r}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* right */}
        <div className="b-side">
          <div className="field">
            <label>Budget cap <span className="hint">USDC</span></label>
            <input className="inp mono" type="number" value={budget} onChange={(e) => setBudget(e.target.value)} />
          </div>
          <div className="field">
            <label>Duration <span className="hint">hours</span></label>
            <input className="inp mono" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
          </div>
          <div className="field">
            <label>Permission model</label>
            <div className="perm-row">
              <span className="pl">
                <svg viewBox="0 0 24 24" fill="none"><path d="M3 17 14 6l4 4L7 21H3v-4Z" /><path d="M14 6l3-3 4 4-3 3" /></svg>
                ERC-7710 delegation<span className="ps">scoped, budget-bounded</span>
              </span>
            </div>
            <div className="perm-row">
              <span className="pl">
                <svg viewBox="0 0 24 24" fill="none" stroke={onChain ? "var(--green)" : "var(--amber)"}><path d="M9 12l2 2 4-4M5 7l7-4 7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V7Z" /></svg>
                {onChain ? "On-chain redelegation" : "Simulated run"}<span className="ps">{onChain ? "real signatures on Base" : "no wallet — dry-run"}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="build-foot">
          <span className="est">Permission chain · <b>User → Manager → Payment</b> · cap <b>{budget || "—"} USDC</b></span>
          <button className="btn btn-green" onClick={create}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12l5 5L20 7" /></svg>
            Create mission
          </button>
        </div>
      </div>
    </section>
  );
}
