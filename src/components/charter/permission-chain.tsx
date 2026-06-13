"use client";

import { useStore } from "@/lib/store";
import { shortAddr } from "@/lib/utils";
import { explorerAddr } from "@/lib/chain";
import { Glyph, vizFor, ROLE_VIZ, type Viz } from "@/lib/role-visuals";

const NODE_W = 158;
const NODE_H = 122;
const GAP = 56;
const PAD = 18;
const STAGGER = 34;

function addr(a?: string) {
  if (!a) return "";
  return a.startsWith("0x") && a.length > 12 ? shortAddr(a, 5) : a;
}

interface FNode {
  nm: string;
  rl: string;
  cap: string;
  addr: string;
  viz: Viz;
  root?: boolean;
  redel?: boolean;
  mode?: "real" | "simulated";
}
interface FEdge {
  type: "delegation" | "redelegation";
  budget: number;
  mode: "real" | "simulated";
}

export function PermissionChain({ missionId }: { missionId: string }) {
  const { links } = useStore();
  const rows = links.filter((l) => l.missionId === missionId);

  const nodes: FNode[] = [];
  const edges: FEdge[] = [];
  if (rows.length) {
    nodes.push({ nm: "User", rl: "owner", cap: "holds budget", addr: addr(rows[0].from), viz: ROLE_VIZ.User, root: true });
    rows.forEach((l) => {
      nodes.push({
        nm: l.toLabel.replace(/ Agent$/, ""),
        rl: l.isRedelegation ? "spend" : "approve",
        cap: `${l.isRedelegation ? "per-tx ≤" : "≤"} ${l.budget} USDC`,
        addr: addr(l.to),
        viz: vizFor(l.toLabel),
        redel: l.isRedelegation,
        mode: l.mode,
      });
      edges.push({ type: l.isRedelegation ? "redelegation" : "delegation", budget: l.budget, mode: l.mode });
    });
  }

  const status =
    rows.length === 0 ? "unsigned" : rows.every((l) => l.mode === "real") ? "signed · on-chain" : "signed · simulated";

  // n8n-style layout: nodes laid left→right with a gentle zigzag so edges curve.
  const pos = nodes.map((_, i) => ({ x: PAD + i * (NODE_W + GAP), y: PAD + (i % 2 === 1 ? STAGGER : 0) }));
  const W = PAD * 2 + nodes.length * NODE_W + Math.max(0, nodes.length - 1) * GAP;
  const H = PAD * 2 + NODE_H + STAGGER;

  return (
    <section className="dpanel">
      <div className="dp-h">
        <div className="t">
          <svg viewBox="0 0 24 24"><path d="M9 12a3 3 0 0 1 3-3h2a3 3 0 0 1 0 6h-1M15 12a3 3 0 0 1-3 3h-2a3 3 0 0 1 0-6h1" /></svg>
          Permission Chain
        </div>
        <span className="sub">{status}</span>
      </div>
      <div className="dp-b">
        {nodes.length === 0 ? (
          <div className="empty">Run the mission to build the chain of authority.</div>
        ) : (
          <div className="flow">
            <div className="flow-canvas" style={{ width: W, height: H }}>
              <svg className="flow-edges" width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none">
                <defs>
                  <marker id="fc-arrow" markerWidth="8" markerHeight="8" refX="5.5" refY="3" orient="auto">
                    <path d="M0 0 L6 3 L0 6 Z" fill="var(--green)" />
                  </marker>
                </defs>
                {edges.map((e, i) => {
                  const a = pos[i], b = pos[i + 1];
                  const x1 = a.x + NODE_W, y1 = a.y + NODE_H / 2;
                  const x2 = b.x, y2 = b.y + NODE_H / 2;
                  const cx = (x1 + x2) / 2;
                  const d = `M ${x1} ${y1} C ${cx} ${y1}, ${cx} ${y2}, ${x2 - 3} ${y2}`;
                  return (
                    <g key={i}>
                      <path d={d} className="fe-base" />
                      <path d={d} className="fe-flow" markerEnd="url(#fc-arrow)" />
                    </g>
                  );
                })}
              </svg>

              {edges.map((e, i) => {
                const a = pos[i], b = pos[i + 1];
                const mx = (a.x + NODE_W + b.x) / 2;
                const my = (a.y + b.y) / 2 + NODE_H / 2;
                return (
                  <div key={i} className="fe-label" style={{ left: mx, top: my }}>
                    <span className="fe-type">{e.type}</span>
                    <span className="fe-cap">≤ {e.budget} USDC</span>
                  </div>
                );
              })}

              {nodes.map((n, i) => (
                <div
                  key={i}
                  className={`fnode${n.root ? " root" : n.mode === "real" ? " signed" : " sim"}`}
                  style={{ left: pos[i].x, top: pos[i].y, width: NODE_W, height: NODE_H, ["--nc" as string]: n.viz.color }}
                >
                  <div className="fn-head">
                    <span className="fn-ic"><Glyph name={n.viz.glyph} /></span>
                    <span className="fn-role">{n.rl}</span>
                  </div>
                  <div className="fn-title">{n.nm}</div>
                  <div className="fn-cap">↳ {n.cap}</div>
                  <div className="fn-foot">
                    {n.root ? (
                      <span className="fn-badge blue">root</span>
                    ) : (
                      <span className={`fn-badge ${n.mode === "real" ? "green" : "neutral"}`}>{n.mode === "real" ? "ERC-7710" : "sim"}</span>
                    )}
                    {n.addr.startsWith("0x") ? (
                      <a className="fn-addr" href={explorerAddr(n.addr)} target="_blank" rel="noreferrer">{n.addr} ↗</a>
                    ) : (
                      <span className="fn-addr">{n.addr}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
