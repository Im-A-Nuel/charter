"use client";

import { useStore } from "@/lib/store";
import { ROLE_VIZ, Glyph } from "@/lib/role-visuals";
import type { AgentCharter } from "@/lib/types";

const HUB_W = 216;
const HUB_H = 80;
const SUB_D = 58;
const VGAP = 66;
const COL = 130;
const PAD = 22;

function capOf(c: AgentCharter): string {
  if (c.canSpend) return `spend ≤ ${c.budget} USDC`;
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
  const subCx = (i: number) => rowLeft + i * COL + COL / 2;
  const ox = (i: number) => hubX + (HUB_W * (i + 1)) / (n + 1);
  const H = subTop + SUB_D + 44 + PAD;
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
          <div className="flow team-flow">
            <div className="flow-canvas" style={{ width: W, height: H }}>
              <svg className="flow-edges" width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
                {specialists.map((_, i) => {
                  const x1 = ox(i), x2 = subCx(i);
                  const d = `M ${x1} ${hubBottom} C ${x1} ${hubBottom + VGAP * 0.6}, ${x2} ${subTop - VGAP * 0.6}, ${x2} ${subTop}`;
                  return (
                    <g key={i}>
                      <path d={d} className="te-link" />
                      <rect className="te-diamond" x={x1 - 4} y={hubBottom - 4} width="8" height="8" transform={`rotate(45 ${x1} ${hubBottom})`} />
                      <rect className="te-diamond" x={x2 - 4} y={subTop - 4} width="8" height="8" transform={`rotate(45 ${x2} ${subTop})`} />
                    </g>
                  );
                })}
              </svg>

              {/* hub: Manager */}
              <div className="hub signed" style={{ left: hubX, top: PAD, width: HUB_W, height: HUB_H, ["--nc" as string]: mgrViz.color }}>
                <span className="fn-ic"><Glyph name={mgrViz.glyph} size={20} /></span>
                <div className="hub-meat">
                  <div className="hub-tt">{manager.agent.replace(/ Agent$/, "")}<span className="hub-tag">coordinator</span></div>
                  <div className="hub-cap">redelegates scoped authority</div>
                </div>
              </div>

              {/* sub-nodes: specialists */}
              {specialists.map((c, i) => {
                const viz = ROLE_VIZ[c.role] ?? ROLE_VIZ.Research;
                return (
                  <div key={c.id} className="sub" style={{ left: rowLeft + i * COL, top: subTop, width: COL, ["--nc" as string]: viz.color }}>
                    <span className="sub-ic"><Glyph name={viz.glyph} size={24} /></span>
                    <div className="sub-nm">{c.agent.replace(/ Agent$/, "")}</div>
                    <span className="sub-cap">{capOf(c)}</span>
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
