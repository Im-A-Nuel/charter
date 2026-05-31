"use client";

import { motion } from "framer-motion";
import { FileText, Sparkles, Link2, ShieldCheck, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { explorerTx } from "@/lib/chain";

export function FinalReport({ missionId }: { missionId: string }) {
  const { reports } = useStore();
  const report = reports.find((r) => r.missionId === missionId);
  if (!report) return null;

  const riskTone = report.riskLevel === "High" ? "bad" : report.riskLevel === "Medium" ? "warn" : "good";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2"><FileText className="h-4 w-4 text-brand" /> Final Report</CardTitle>
            <Badge tone="violet"><Sparkles className="h-3 w-3" /> {report.veniceModel}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Risk level"><Badge tone={riskTone}>{report.riskLevel}</Badge></Stat>
            <Stat label="Paid data"><span className="text-ink">{report.paidDataUsed ? "Yes" : "No"}</span></Stat>
            <Stat label="Total spent"><span className="text-ink">{report.totalSpent} USDC</span></Stat>
            <Stat label="Remaining"><span className="text-ink">{report.remaining} USDC</span></Stat>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-2/50 px-2.5 py-1 text-muted">
              <ShieldCheck className="h-3.5 w-3.5 text-good" /> Approved by {report.approvedBy}
            </span>
            <span className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-2/50 px-2.5 py-1 text-muted">
              <CreditCard className="h-3.5 w-3.5 text-brand" /> Paid by {report.paymentBy}
            </span>
            {report.txHash && (
              <a href={explorerTx(report.txHash)} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface-2/50 px-2.5 py-1 text-brand hover:underline">
                tx {report.txHash.slice(0, 10)}… <Link2 className="h-3 w-3" />
                <Badge tone={report.execMode === "real" ? "good" : "neutral"}>{report.execMode}</Badge>
              </a>
            )}
          </div>

          <div className="whitespace-pre-wrap rounded-xl border border-border bg-gradient-to-b from-surface-2/60 to-surface/60 p-5 text-sm leading-relaxed text-muted">
            {report.body}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function Stat({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-surface-2/40 p-3">
      <div className="text-[11px] text-faint">{label}</div>
      <div className="mt-1">{children}</div>
    </div>
  );
}
