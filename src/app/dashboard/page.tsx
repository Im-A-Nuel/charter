"use client";

import * as React from "react";
import { SiteNav } from "@/components/site-nav";
import { MissionBuilder } from "@/components/charter/mission-builder";
import { AgentTeam } from "@/components/charter/agent-team";
import { PermissionChain } from "@/components/charter/permission-chain";
import { Timeline } from "@/components/charter/timeline";
import { A2AConsole } from "@/components/charter/a2a-console";
import { FinalReport } from "@/components/charter/final-report";
import { useStore } from "@/lib/store";
import { useMissionRunner, type Phase } from "@/lib/orchestrator";
import type { Mission } from "@/lib/types";

function phaseGroup(phase: Phase): "idle" | "running" | "done" | "rejected" {
  if (phase === "done") return "done";
  if (phase === "rejected") return "rejected";
  if (phase === "idle") return "idle";
  return "running";
}

export default function Dashboard() {
  const { missions, charters, ready } = useStore();
  const [selected, setSelected] = React.useState<string | null>(null);
  const [showBuilder, setShowBuilder] = React.useState(false);

  const active = missions.find((m) => m.id === selected) ?? missions[0];

  React.useEffect(() => {
    if (ready && missions.length === 0) setShowBuilder(true);
  }, [ready, missions.length]);

  return (
    <>
      <SiteNav />
      <main className="mc">
        {missions.length > 0 && (
          <div className="mtabs">
            {missions.map((m) => (
              <button key={m.id} onClick={() => setSelected(m.id)} className={`mtab${active?.id === m.id ? " on" : ""}`}>
                {m.name} · {m.budget} USDC
              </button>
            ))}
            <button className="mtab" onClick={() => setShowBuilder((s) => !s)}>+ New mission</button>
          </div>
        )}

        {showBuilder && (
          <MissionBuilder onCreated={(id) => { setSelected(id); setShowBuilder(false); }} />
        )}

        {!active ? (
          <div className="empty" style={{ padding: "80px 0" }}>No mission yet. Create one to get started.</div>
        ) : (
          <MissionView key={active.id} mission={active} charters={charters.filter((c) => c.missionId === active.id)} onNew={() => setShowBuilder((s) => !s)} />
        )}
      </main>
    </>
  );
}

function MissionView({ mission, charters, onNew }: { mission: Mission; charters: ReturnType<typeof useStore>["charters"]; onNew: () => void }) {
  const { run, running, phase, veniceMeta } = useMissionRunner(mission, charters);
  const group = phaseGroup(phase);

  return (
    <>
      <div className="mc-bar">
        <div className="m-id">
          <span className="lbl">Mission</span>
          <span className="nm">{mission.name}<span className="goal">{mission.goal}</span></span>
        </div>
        <div className="spacer" />
        <div className="badges">
          {veniceMeta && (
            <span className="venice-badge">
              <svg viewBox="0 0 24 24"><path d="M12 3l2.2 5.5L20 9l-4.2 3.6L17 18l-5-3-5 3 1.2-5.4L4 9l5.8-.5L12 3Z" /></svg>
              Venice · {veniceMeta.model}
            </span>
          )}
          <span className="phase" data-p={group}><span className="pd" />{phase}</span>
        </div>
        <div className="acts">
          <button className="btn btn-ghost" onClick={onNew}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 5v14M5 12h14" /></svg>
            New mission
          </button>
          <button className="btn btn-green" onClick={run} disabled={running}>
            {running ? (
              <svg className="spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M12 3a9 9 0 1 0 9 9" strokeLinecap="round" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
            )}
            {running ? "Agents working…" : group === "done" || group === "rejected" ? "Run again" : "Run mission"}
          </button>
        </div>
      </div>

      <div className="mc-grid">
        <div className="mc-col">
          <PermissionChain missionId={mission.id} />
          <AgentTeam missionId={mission.id} />
          <Timeline missionId={mission.id} />
        </div>
        <div className="mc-col">
          <A2AConsole missionId={mission.id} />
          <FinalReport missionId={mission.id} />
        </div>
      </div>
    </>
  );
}
