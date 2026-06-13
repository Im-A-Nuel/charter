"use client";

import { useStore } from "@/lib/store";
import { shortAddr } from "@/lib/utils";
import { explorerAddr } from "@/lib/chain";
import { Glyph, vizFor, ROLE_VIZ, type Viz } from "@/lib/role-visuals";

const NODE_W = 178;
const NODE_H = 100;
const GAP = 116;
const PAD = 26;

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
  mode?: "real" | "simulated";
}
interface FEdge {
  type: "delegation" | "redelegation";
  budget: number;
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
        mode: l.mode,
      });
      edges.push({ type: l.isRedelegation ? "redelegation" : "delegation", budget: l.budget });
    });
  }

  const status =
    rows.length === 0 ? "unsigned" : rows.every((l) => l.mode === "real") ? "signed · on-chain" : "signed · simulated";

  // straight horizontal flow (n8n style): all nodes share one baseline.
  const last = nodes.length - 1;
  const pos = nodes.map((_, i) => ({ x: PAD + i * (NODE_W + GAP), y: PAD }));
  const W = PAD * 2 + nodes.length * NODE_W + Math.max(0, last) * GAP;
  const H = PAD * 2 + NODE_H;
  const cy = PAD + NODE_H / 2;

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
                  <marker id="fc-arrow" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
                    <path d="M0 0 L6 3 L0 6 Z" fill="var(--green)" />
                  </marker>
                </defs>
                {edges.map((e, i) => {
                  const x1 = pos[i].x + NODE_W, x2 = pos[i + 1].x;
                  const c = (x2 - x1) * 0.5;
                  const d = `M ${x1} ${cy} C ${x1 + c} ${cy}, ${x2 - c} ${cy}, ${x2 - 4} ${cy}`;
                  return (
                    <g key={i}>
                      <path d={d} className="fe-base" />
                      <path d={d} className="fe-flow" markerEnd="url(#fc-arrow)" />
                    </g>
                  );
                })}
              </svg>

              {edges.map((e, i) => {
                const mx = (pos[i].x + NODE_W + pos[i + 1].x) / 2;
                return (
                  <div key={i} className="fe-label" style={{ left: mx, top: cy }}>
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
                  {i > 0 && <span className="fn-port in" />}
                  {i < last && <span className="fn-port out" />}
                  <div className="fn-row">
                    <span className="fn-ic"><Glyph name={n.viz.glyph} /></span>
                    <div className="fn-meat">
                      <div className="fn-title">{n.nm}<span className="fn-role">{n.rl}</span></div>
                      <div className="fn-cap">{n.cap}</div>
                    </div>
                  </div>
                  <div className="fn-tags">
                    {n.root ? (
                      <span className="fn-badge blue">root</span>
                    ) : (
                      <span className={`fn-badge ${n.mode === "real" ? "green" : "neutral"}`}>{n.mode === "real" ? "ERC-7710" : "simulated"}</span>
                    )}
                    {n.addr.startsWith("0x") ? (
                      <a className="fn-addr" href={explorerAddr(n.addr)} target="_blank" rel="noreferrer">{n.addr}</a>
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
