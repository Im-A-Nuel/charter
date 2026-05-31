"use client";

import * as React from "react";
import { Rocket, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Field } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/lib/wallet";
import { useStore } from "@/lib/store";
import { ROLE_LIBRARY, type Mission, type AgentCharter, type Role } from "@/lib/types";
import { uid } from "@/lib/utils";

const ALL_ROLES: Role[] = ["Manager", "Research", "Risk", "Payment", "Writer"];

export function MissionBuilder({ onCreated }: { onCreated?: (id: string) => void }) {
  const { account, correctChain } = useWallet();
  const { createMission } = useStore();

  const [name, setName] = React.useState("Token Risk Report");
  const [goal, setGoal] = React.useState("Generate a risk report for a new token. Use paid data if needed.");
  const [budget, setBudget] = React.useState("5");
  const [duration, setDuration] = React.useState("24");
  const [roles, setRoles] = React.useState<Role[]>(["Manager", "Research", "Risk", "Payment", "Writer"]);

  function toggle(r: Role) {
    if (r === "Manager") return; // manager is mandatory
    setRoles((p) => (p.includes(r) ? p.filter((x) => x !== r) : [...p, r]));
  }

  function create() {
    const id = uid("mission");
    const mission: Mission = {
      id, name, goal,
      budget: Number(budget), token: "USDC",
      durationHours: Number(duration),
      roles: ALL_ROLES.filter((r) => roles.includes(r)),
      status: "draft",
      createdAt: new Date().toISOString(),
      user: account ?? "0xSIMULATED",
    };
    const charters: AgentCharter[] = mission.roles.map((role) => {
      const lib = ROLE_LIBRARY[role];
      return {
        id: uid("charter"), missionId: id,
        agent: `${role} Agent`, role, description: lib.description,
        canSpend: lib.canSpend, canApprove: lib.canApprove, canRedelegate: lib.canRedelegate,
        budget: role === "Payment" ? Math.min(1, Number(budget) * 0.2) : 0,
        allowedServices: role === "Payment" ? ["verified-x402-api.demo"] : [],
      };
    });
    createMission(mission, charters);
    onCreated?.(id);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2"><Rocket className="h-4 w-4 text-brand" /> Mission Builder</CardTitle>
            <CardDescription>Define a multi-agent mission and its required roles.</CardDescription>
          </div>
          <Badge tone={account && correctChain ? "good" : "warn"}>{account && correctChain ? "On-chain redelegation" : "Simulated"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Mission name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Total budget (USDC)"><Input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} /></Field>
        </div>
        <Field label="Goal"><Textarea rows={2} value={goal} onChange={(e) => setGoal(e.target.value)} /></Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Duration (hours)"><Input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} /></Field>
          <Field label="Manager agent"><Input value="Manager Agent (mandatory)" disabled /></Field>
        </div>

        <div>
          <span className="text-xs font-medium text-muted">Specialist roles</span>
          <div className="mt-2 flex flex-wrap gap-2">
            {ALL_ROLES.map((r) => {
              const on = roles.includes(r);
              const locked = r === "Manager";
              return (
                <button
                  key={r}
                  onClick={() => toggle(r)}
                  disabled={locked}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                    on ? "border-brand/50 bg-brand/10 text-ink" : "border-border bg-surface-2 text-muted hover:text-ink"
                  } ${locked ? "opacity-80" : ""}`}
                >
                  {r} {locked && "·"}
                </button>
              );
            })}
          </div>
        </div>

        <Button onClick={create} className="w-full" size="lg"><Plus className="h-4 w-4" /> Create mission charter</Button>
      </CardContent>
    </Card>
  );
}
