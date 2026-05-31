"use client";

import { useStore } from "@/lib/store";

const stateClass: Record<string, string> = { running: "run", done: "done", blocked: "blocked", pending: "" };
const stateLabel: Record<string, string> = { running: "running", done: "done", blocked: "blocked", pending: "queued" };

export function Timeline({ missionId }: { missionId: string }) {
  const { timeline } = useStore();
  const rows = timeline.filter((t) => t.missionId === missionId);
  const done = rows.filter((t) => t.status === "done").length;

  return (
    <section className="dpanel">
      <div className="dp-h">
        <div className="t">
          <svg viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h10" /></svg>
          Timeline
        </div>
        <span className="sub">{rows.length === 0 ? "0 steps" : `${done} / ${rows.length} steps`}</span>
      </div>
      <div className="dp-b">
        {rows.length === 0 ? (
          <div className="empty">No steps yet. Run the mission.</div>
        ) : (
          <div className="tl">
            {rows.map((s) => (
              <div key={s.id} className={`tstep ${stateClass[s.status] ?? ""}`}>
                <div className="dot"><i /></div>
                <div className="lab">
                  <span className="lt">{s.label}</span>
                  {s.detail && <span className="ld">{s.detail}</span>}
                </div>
                <div className="ms">{stateLabel[s.status]}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
