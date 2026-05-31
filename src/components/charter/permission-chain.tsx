"use client";

import { motion } from "framer-motion";
import { User, Bot, CreditCard, ArrowDown, ShieldCheck, GitBranch, Link2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { shortAddr } from "@/lib/utils";
import { explorerAddr } from "@/lib/chain";
import type { PermissionLink } from "@/lib/types";

export function PermissionChain({ missionId }: { missionId: string }) {
  const { links } = useStore();
  const rows = links.filter((l) => l.missionId === missionId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><GitBranch className="h-4 w-4 text-brand" /> Permission Chain</CardTitle>
        <CardDescription>How authority flows — and shrinks — from user to agent.</CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-faint">Run the mission to build the chain of authority.</p>
        ) : (
          <div className="space-y-0">
            <Node icon={User} label="User Wallet" sub={addr(rows[0]?.from)} tone="neutral" />
            {rows.map((l, i) => (
              <div key={l.id}>
                <Edge link={l} />
                <Node
                  icon={l.isRedelegation ? CreditCard : Bot}
                  label={l.toLabel}
                  sub={addr(l.to)}
                  tone={l.isRedelegation ? "violet" : "brand"}
                  budget={l.budget}
                  last={i === rows.length - 1}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function addr(a?: string) {
  if (!a) return "";
  return a.startsWith("0x") && a.length > 12 ? shortAddr(a, 5) : a;
}

function Node({
  icon: Icon, label, sub, tone, budget, last,
}: {
  icon: React.ElementType; label: string; sub: string; tone: "neutral" | "brand" | "violet"; budget?: number; last?: boolean;
}) {
  const ring =
    tone === "violet" ? "border-brand-2/40 bg-brand-2/10 text-brand-2"
    : tone === "brand" ? "border-brand/40 bg-brand/10 text-brand"
    : "border-border bg-surface-2 text-muted";
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 rounded-xl border p-3 ${ring} ${last ? "animate-none" : ""}`}>
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-bg/40"><Icon className="h-4.5 w-4.5" /></div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-ink">{label}</div>
        {sub && (
          sub.startsWith("0x") ? (
            <a href={explorerAddr(sub)} target="_blank" rel="noreferrer" className="flex items-center gap-1 font-mono text-[11px] text-muted hover:text-brand">
              {sub} <Link2 className="h-3 w-3" />
            </a>
          ) : <div className="font-mono text-[11px] text-faint">{sub}</div>
        )}
      </div>
      {budget !== undefined && <Badge tone={tone === "violet" ? "violet" : "brand"}>{budget} USDC</Badge>}
    </motion.div>
  );
}

function Edge({ link }: { link: PermissionLink }) {
  return (
    <div className="flex items-center gap-3 py-1 pl-4">
      <div className="flex w-9 justify-center"><ArrowDown className="h-4 w-4 text-faint" /></div>
      <div className="flex flex-1 flex-wrap items-center gap-2 text-xs">
        <Badge tone={link.isRedelegation ? "violet" : "brand"}>
          {link.isRedelegation ? <GitBranch className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
          {link.isRedelegation ? "redelegation" : "delegation"}
        </Badge>
        <span className="text-muted">{link.authority}</span>
        <span className="text-faint">· {link.scope}</span>
        <Badge tone={link.mode === "real" ? "good" : "neutral"}>{link.mode === "real" ? "ERC-7710 signed" : "simulated"}</Badge>
        {link.signature && <span className="font-mono text-faint">{shortAddr(link.signature, 6)}</span>}
      </div>
    </div>
  );
}
