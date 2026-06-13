"use client";

import * as React from "react";
import { useStore } from "@/lib/store";
import { vizFor, Glyph } from "@/lib/role-visuals";
import type { AgentMessage } from "@/lib/types";

const KC: Record<AgentMessage["kind"], string> = {
  instruct: "#5b9dff",
  request: "#a78bfa",
  approve: "#00e599",
  execute: "#ffb347",
  report: "#f472b6",
};

export function A2AConsole({ missionId }: { missionId: string }) {
  const { messages } = useStore();
  const rows = messages.filter((m) => m.missionId === missionId);
  const streamRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = streamRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [rows.length]);

  return (
    <section className="dpanel">
      <div className="dp-h">
        <div className="t">
          <svg viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4V5Z" /><path d="M8 10h8M8 13h5" /></svg>
          A2A Console
        </div>
        <span className="sub">{rows.length} messages</span>
      </div>
      <div className="dp-b">
        <div className="a2a">
          <div className="stream" ref={streamRef}>
            {rows.length === 0 ? (
              <div className="empty">No inter-agent traffic yet. Run the mission to watch agents coordinate.</div>
            ) : (
              rows.map((m, i) => {
                const viz = vizFor(m.from);
                return (
                  <div key={m.id} className="msg" style={{ ["--mc2" as string]: viz.color, ["--kc" as string]: KC[m.kind] }}>
                    <div className="m-rail">
                      <div className="mav"><Glyph name={viz.glyph} size={22} /></div>
                      {i < rows.length - 1 && <div className="mline" />}
                    </div>
                    <div className="mb">
                      <div className="mhead">
                        <span className="from" style={{ color: viz.color }}>{m.from}</span>
                        <span className="arr">→</span>
                        <span className="to">{m.to}</span>
                        <span className="kind">{m.kind}</span>
                      </div>
                      <div className="text">{m.message}</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
