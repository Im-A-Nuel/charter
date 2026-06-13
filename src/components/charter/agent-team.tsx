"use client";

import { useStore } from "@/lib/store";
import { ROLE_VIZ, Glyph } from "@/lib/role-visuals";
import type { AgentCharter } from "@/lib/types";

const HUB_W = 168;
const HUB_H = 122;
const SUB_W = 132;
const SUB_H = 120;
const VGAP = 58;
const COL = 150;
const PAD = 24;

function capOf(c: AgentCharter): string {
  if (c.canSpend) return `spend ≤ ${c.budget}`;
  if (c.canApprove) return "approve / reject";
  if (c.canRedelegate) return "redelegates";
  if (c.role === "Research") return "read-only";
  if (c.role === "Writer") return "report only";
  return "scoped";
}

export function AgentTeam({ missionId }: { missionId: string }) {
  const { charters } = useStore();
  const rows = charters.filter((c) => c.missionId === missionId);
  const manager = rows.find((c) => c.role === "Manager");
  const specialists = rows.filter((c) => c.role !== "Manager");
  const n = specialists.length;

  const contentW = Math.max(HUB_W, n * COL);
  const W = contentW + PAD * 2;
  const hubX = PAD + (contentW - HUB_W) / 2;
  const hubBottom = PAD + HUB_H;
  const subTop = hubBottom + VGAP;
  const rowLeft = PAD + (contentW - n * COL) / 2;
  const subX = (i: number) => rowLeft + i * COL + (COL - SUB_W) / 2;
  const subCx = (i: number) => rowLeft + i * COL + COL / 2;
  const hubCx = hubX + HUB_W / 2;
  const H = subTop + SUB_H + PAD;
  const mgrViz = ROLE_VIZ.Manager;

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
        {rows.length === 0 || !manager ? (
          <div className="empty">No charters yet.</div>
        ) : (
          <div className="flow">
            <div className="flow-canvas" style={{ width: W, height: H }}>
              <svg className="flow-edges" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
                <defs>
                  <filter id="at-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="2.4" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <marker id="at-arrow" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
                    <path d="M0 0 L7 3 L0 6 Z" fill="var(--green)" />
                  </marker>
                </defs>
                <g filter="url(#at-glow)">
                  {specialists.map((_, i) => {
                    const x2 = subCx(i);
                    const d = `M ${hubCx} ${hubBottom} C ${hubCx} ${hubBottom + VGAP * 0.6}, ${x2} ${subTop - VGAP * 0.6}, ${x2} ${subTop - 3}`;
                    return <path key={i} className="wf-edge wf-dash" d={d} markerEnd="url(#at-arrow)" />;
                  })}
                </g>
              </svg>

              {/* hub: Manager */}
              <div className="wf-node signed" style={{ left: hubX, top: PAD, width: HUB_W, height: HUB_H, ["--nc" as string]: mgrViz.color }}>
                <div className="wf-ic"><Glyph name={mgrViz.glyph} size={26} /></div>
                <div className="wf-label">{manager.agent.replace(/ Agent$/, "")}</div>
                <div className="wf-meta"><span className="wf-tag">coordinator</span> redelegates</div>
                <span className="wf-port bottom" />
              </div>

              {/* sub-nodes: specialists */}
              {specialists.map((c, i) => {
                const viz = ROLE_VIZ[c.role] ?? ROLE_VIZ.Research;
                return (
                  <div key={c.id} className="wf-node signed" style={{ left: subX(i), top: subTop, width: SUB_W, height: SUB_H, ["--nc" as string]: viz.color }}>
                    <span className="wf-port top" />
                    <div className="wf-ic"><Glyph name={viz.glyph} size={24} /></div>
                    <div className="wf-label">{c.agent.replace(/ Agent$/, "")}</div>
                    <div className="wf-meta">{capOf(c)}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
