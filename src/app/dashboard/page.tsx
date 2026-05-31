"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Plus, Inbox, Play, Loader2, Sparkles } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { MissionBuilder } from "@/components/charter/mission-builder";
import { AgentTeam } from "@/components/charter/agent-team";
import { PermissionChain } from "@/components/charter/permission-chain";
import { Timeline } from "@/components/charter/timeline";
import { A2AConsole } from "@/components/charter/a2a-console";
import { FinalReport } from "@/components/charter/final-report";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { useWallet } from "@/lib/wallet";
import { useMissionRunner } from "@/lib/orchestrator";
import { shortAddr } from "@/lib/utils";
import type { Mission } from "@/lib/types";

export default function Dashboard() {
  const { missions, charters, ready } = useStore();
  const { account } = useWallet();
  const [selected, setSelected] = React.useState<string | null>(null);
  const [showBuilder, setShowBuilder] = React.useState(false);

  const active = missions.find((m) => m.id === selected) ?? missions[0];

  React.useEffect(() => {
    if (ready && missions.length === 0) setShowBuilder(true);
  }, [ready, missions.length]);

  return (
    <>
      <SiteNav />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-ink">Mission Control</h1>
            <p className="text-sm text-muted">Coordinate an agent team through redelegated authority.</p>
          </div>
          <div className="flex items-center gap-2">
            {account && <Badge tone="neutral">User {shortAddr(account)}</Badge>}
            <Button size="sm" variant={showBuilder ? "secondary" : "primary"} onClick={() => setShowBuilder((s) => !s)}>
              <Plus className="h-4 w-4" /> New mission
            </Button>
          </div>
        </div>

        {showBuilder && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <MissionBuilder onCreated={(id) => { setSelected(id); setShowBuilder(false); }} />
          </motion.div>
        )}

        {missions.length > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {missions.map((m) => (
              <button key={m.id} onClick={() => setSelected(m.id)}
                className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                  active?.id === m.id ? "border-brand/50 bg-brand/10 text-ink" : "border-border bg-surface-2 text-muted hover:text-ink"
                }`}>
                {m.name} · {m.budget} USDC
              </button>
            ))}
          </div>
        )}

        {!active ? (
          <div className="grid place-items-center rounded-2xl border border-dashed border-border py-20 text-center">
            <Inbox className="h-8 w-8 text-faint" />
            <p className="mt-2 text-sm text-muted">No mission yet. Create one to get started.</p>
          </div>
        ) : (
          <MissionView key={active.id} mission={active} charters={charters.filter((c) => c.missionId === active.id)} />
        )}
      </main>
    </>
  );
}

function MissionView({ mission, charters }: { mission: Mission; charters: ReturnType<typeof useStore>["charters"] }) {
  const { run, running, phase, veniceMeta } = useMissionRunner(mission, charters);

  return (
    <div className="space-y-6">
      {/* run bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-surface/70 p-4">
        <div>
          <div className="text-sm font-medium text-ink">{mission.name}</div>
          <div className="text-xs text-muted">{mission.goal}</div>
        </div>
        <div className="flex items-center gap-2">
          {veniceMeta && <Badge tone={veniceMeta.mode === "real" ? "good" : "warn"}><Sparkles className="h-3 w-3" /> Venice: {veniceMeta.model}</Badge>}
          <Badge tone={phase === "done" ? "good" : phase === "rejected" ? "bad" : running ? "violet" : "neutral"}>{phase}</Badge>
          <Button onClick={run} disabled={running} size="lg">
            {running ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
            {running ? "Agents working…" : phase === "done" || phase === "rejected" ? "Run again" : "Run mission"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <PermissionChain missionId={mission.id} />
          <AgentTeam missionId={mission.id} />
          <Timeline missionId={mission.id} />
        </div>
        <div className="space-y-6">
          <A2AConsole missionId={mission.id} />
          <FinalReport missionId={mission.id} />
        </div>
      </div>
    </div>
  );
}
