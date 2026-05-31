"use client";

import { Bot, CreditCard, Search, ShieldAlert, PenTool, Crown, Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import type { AgentCharter, Role } from "@/lib/types";

const roleIcon: Record<Role, React.ElementType> = {
  Manager: Crown, Research: Search, Risk: ShieldAlert, Payment: CreditCard, Writer: PenTool,
};

export function AgentTeam({ missionId }: { missionId: string }) {
  const { charters } = useStore();
  const rows = charters.filter((c) => c.missionId === missionId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Bot className="h-4 w-4 text-brand" /> Agent Team</CardTitle>
        <CardDescription>Each agent acts under a scoped charter.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map((c) => <RoleCard key={c.id} charter={c} />)}
        </div>
      </CardContent>
    </Card>
  );
}

function RoleCard({ charter: c }: { charter: AgentCharter }) {
  const Icon = roleIcon[c.role];
  return (
    <div className="rounded-xl border border-border bg-surface-2/40 p-4">
      <div className="flex items-center gap-2">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-bg/50 text-brand"><Icon className="h-4 w-4" /></div>
        <div className="font-medium text-ink">{c.agent}</div>
        {c.role === "Manager" && <Badge tone="violet" className="ml-auto">coordinator</Badge>}
      </div>
      <p className="mt-2 text-xs text-muted">{c.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        <Cap on={c.canSpend} label={c.canSpend ? `spend ≤ ${c.budget} USDC` : "cannot spend"} />
        <Cap on={c.canApprove} label="approve" />
        <Cap on={c.canRedelegate} label="redelegate" />
      </div>
    </div>
  );
}

function Cap({ on, label }: { on: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] ${
      on ? "border-good/30 bg-good/10 text-good" : "border-border bg-surface text-faint"
    }`}>
      {on ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />} {label}
    </span>
  );
}
