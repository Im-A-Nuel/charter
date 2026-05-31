"use client";

import { useStore } from "@/lib/store";
import { shortAddr } from "@/lib/utils";
import { explorerAddr } from "@/lib/chain";
import { Glyph, vizFor, ROLE_VIZ, type Viz } from "@/lib/role-visuals";

function addr(a?: string) {
  if (!a) return "";
  return a.startsWith("0x") && a.length > 12 ? shortAddr(a, 5) : a;
}

interface ChainNode {
  nm: string;
  rl: string;
  cap: string;
  addr: string;
  viz: Viz;
  root?: boolean;
  redel?: boolean;
  mode?: "real" | "simulated";
}

export function PermissionChain({ missionId }: { missionId: string }) {
  const { links } = useStore();
  const rows = links.filter((l) => l.missionId === missionId);

  const nodes: ChainNode[] = [];
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
    });
  }

  const status =
    rows.length === 0 ? "unsigned" : rows.every((l) => l.mode === "real") ? "signed · on-chain" : "signed · simulated";

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
          <div className="chain">
            {nodes.map((n, i) => {
              const last = i === nodes.length - 1;
              return (
                <div key={i} className={`clink signed${last ? " last" : ""}`} style={{ ["--cc" as string]: n.viz.color }}>
                  <div className="rail">
                    <div className="node-ic"><Glyph name={n.viz.glyph} /></div>
                    <div className="wire" />
                  </div>
                  <div className="meat">
                    <div className="top">
                      <span className="nm">{n.nm}</span>
                      <span className="rl">{n.rl}</span>
                    </div>
                    <div className="cap"><span className="arrow">↳</span> {n.cap}</div>
                    <div className="sig">
                      {n.root ? (
                        <span className="badge blue"><span className="bd" />root authority</span>
                      ) : (
                        <>
                          <span className={`badge ${n.mode === "real" ? "green" : "neutral"}`}>
                            <span className="bd" />{n.mode === "real" ? "ERC-7710 signed" : "simulated"}
                          </span>
                          <span className="badge violet">{n.redel ? "redelegation" : "delegation"}</span>
                        </>
                      )}
                      {n.addr.startsWith("0x") ? (
                        <span className="addr"><a href={explorerAddr(n.addr)} target="_blank" rel="noreferrer">{n.addr} ↗</a></span>
                      ) : (
                        <span className="addr">{n.addr}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
