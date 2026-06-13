"use client";

import { useStore } from "@/lib/store";
import { shortAddr } from "@/lib/utils";
import { explorerAddr } from "@/lib/chain";
import { Glyph, vizFor, ROLE_VIZ, type Viz } from "@/lib/role-visuals";

const NODE_W = 144;
const NODE_H = 130;
const GAP = 80;
const PAD = 24;

function addr(a?: string) {
  if (!a) return "";
  return a.startsWith("0x") && a.length > 12 ? shortAddr(a, 4) : a;
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

export function PermissionChain({ missionId }: { missionId: string }) {
  const { links } = useStore();
  const rows = links.filter((l) => l.missionId === missionId);

  const nodes: FNode[] = [];
  if (rows.length) {
    nodes.push({ nm: "User", rl: "owner", cap: "holds budget", addr: addr(rows[0].from), viz: ROLE_VIZ.User, root: true });
    rows.forEach((l) => {
      nodes.push({
        nm: l.toLabel.replace(/ Agent$/, ""),
        rl: l.isRedelegation ? "spend" : "approve",
        cap: `≤ ${l.budget} USDC`,
        addr: addr(l.to),
        viz: vizFor(l.toLabel),
        mode: l.mode,
      });
    });
  }

  const status =
    rows.length === 0 ? "unsigned" : rows.every((l) => l.mode === "real") ? "signed · on-chain" : "signed · simulated";

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
              <svg className="flow-edges" width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
                <defs>
                  <filter id="pc-glow" x="-30%" y="-30%" width="160%" height="160%">
                    <feGaussianBlur stdDeviation="2.4" result="b" />
                    <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                  </filter>
                  <marker id="pc-arrow" markerWidth="9" markerHeight="9" refX="6" refY="3" orient="auto">
                    <path d="M0 0 L7 3 L0 6 Z" fill="var(--green)" />
                  </marker>
                </defs>
                <g filter="url(#pc-glow)">
                  {nodes.slice(1).map((_, i) => {
                    const x1 = pos[i].x + NODE_W, x2 = pos[i + 1].x;
                    const c = (x2 - x1) * 0.5;
                    const d = `M ${x1} ${cy} C ${x1 + c} ${cy}, ${x2 - c} ${cy}, ${x2 - 4} ${cy}`;
                    return <path key={i} className="wf-edge wf-dash" d={d} markerEnd="url(#pc-arrow)" />;
                  })}
                </g>
              </svg>

              {nodes.map((n, i) => (
                <div
                  key={i}
                  className={`wf-node${n.root || n.mode === "real" ? " signed" : ""}`}
                  style={{ left: pos[i].x, top: pos[i].y, width: NODE_W, height: NODE_H, ["--nc" as string]: n.viz.color }}
                >
                  {i > 0 && <span className="wf-port left" />}
                  <div className="wf-ic"><Glyph name={n.viz.glyph} size={26} /></div>
                  <div className="wf-label">{n.nm}</div>
                  <div className="wf-meta"><span className="wf-tag">{n.rl}</span> {n.cap}</div>
                  {n.addr.startsWith("0x") ? (
                    <a className="wf-addr" href={explorerAddr(n.addr)} target="_blank" rel="noreferrer">{n.addr} ↗</a>
                  ) : (
                    <span className="wf-addr">{n.addr}</span>
                  )}
                  {i < last && <span className="wf-port right" />}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
