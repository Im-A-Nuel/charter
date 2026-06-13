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
            {rows.map((s, i) => (
              <div key={s.id} className={`tstep ${stateClass[s.status] ?? ""}`}>
                <div className="t-rail">
                  <span className="t-dot"><i /></span>
                  {i < rows.length - 1 && <span className="t-line" />}
                </div>
                <div className="t-body">
                  <div className="t-lab">{s.label}</div>
                  {s.detail && <div className="t-det">{s.detail}</div>}
                </div>
                <span className="t-state">{stateLabel[s.status]}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
