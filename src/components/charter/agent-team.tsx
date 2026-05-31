"use client";

import { useStore } from "@/lib/store";
import { ROLE_VIZ, Glyph } from "@/lib/role-visuals";
import type { AgentCharter } from "@/lib/types";

export function AgentTeam({ missionId }: { missionId: string }) {
  const { charters } = useStore();
  const rows = charters.filter((c) => c.missionId === missionId);

  return (
    <section className="dpanel">
      <div className="dp-h">
        <div className="t">
          <svg viewBox="0 0 24 24"><circle cx="8" cy="9" r="3" /><circle cx="17" cy="11" r="2.4" /><path d="M3 19c0-2.8 2.2-5 5-5s5 2.2 5 5M14 18c.4-1.8 1.8-3 3.5-3 1.4 0 2.6.8 3.2 2" /></svg>
          Agent Team
        </div>
        <span className="sub">{rows.length} agents</span>
      </div>
      <div className="dp-b">
        {rows.length === 0 ? (
          <div className="empty">No charters yet.</div>
        ) : (
          <div className="team">
            {rows.map((c) => <Agent key={c.id} charter={c} />)}
          </div>
        )}
      </div>
    </section>
  );
}

function Agent({ charter: c }: { charter: AgentCharter }) {
  const viz = ROLE_VIZ[c.role] ?? ROLE_VIZ.Research;
  return (
    <div className="agent" style={{ ["--ac" as string]: viz.color }}>
      <div className="av"><Glyph name={viz.glyph} /></div>
      <div className="info">
        <div className="nm">
          {c.agent}
          {c.role === "Manager" && <span className="badge green" style={{ padding: "1px 6px", fontSize: 9 }}>coordinator</span>}
        </div>
        <div className="rl">{c.description}</div>
        <div className="caps">
          <Cap on={c.canSpend} label={c.canSpend ? `spend ≤ ${c.budget} USDC` : "no spend"} />
          <Cap on={c.canApprove} label="approve" />
          <Cap on={c.canRedelegate} label="redelegate" />
        </div>
      </div>
    </div>
  );
}

function Cap({ on, label }: { on: boolean; label: string }) {
  return (
    <span className={`cap-chip${on ? " on" : ""}`}>
      {on ? (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="M5 12l5 5L20 7" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 6l12 12M18 6L6 18" /></svg>
      )}
      {label}
    </span>
  );
}
