"use client";

import { motion } from "framer-motion";
import { Loader2, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useStore } from "@/lib/store";
import type { TimelineStep } from "@/lib/types";

export function Timeline({ missionId }: { missionId: string }) {
  const { timeline } = useStore();
  const rows = timeline.filter((t) => t.missionId === missionId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand" /> Execution Timeline</CardTitle>
        <CardDescription>Every step of the multi-agent workflow.</CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-faint">No steps yet.</p>
        ) : (
          <ol className="relative ml-2 space-y-4 border-l border-border pl-6">
            {rows.map((s, i) => (
              <motion.li key={s.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }} className="relative">
                <span className="absolute -left-[31px] grid h-6 w-6 place-items-center rounded-full border border-border bg-surface">
                  <Icon status={s.status} />
                </span>
                <div className="text-sm text-ink">{s.label}</div>
                {s.detail && <div className="mt-0.5 text-xs text-muted">{s.detail}</div>}
              </motion.li>
            ))}
          </ol>
        )}
      </CardContent>
    </Card>
  );
}

function Icon({ status }: { status: TimelineStep["status"] }) {
  if (status === "running") return <Loader2 className="h-3.5 w-3.5 animate-spin text-brand" />;
  if (status === "done") return <CheckCircle2 className="h-3.5 w-3.5 text-good" />;
  if (status === "blocked") return <XCircle className="h-3.5 w-3.5 text-bad" />;
  return <span className="h-2 w-2 rounded-full bg-faint" />;
}
