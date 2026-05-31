"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MessagesSquare, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import type { AgentMessage } from "@/lib/types";

const kindTone: Record<AgentMessage["kind"], "brand" | "violet" | "good" | "warn" | "neutral"> = {
  instruct: "brand", request: "warn", approve: "good", execute: "violet", report: "neutral",
};

export function A2AConsole({ missionId }: { missionId: string }) {
  const { messages } = useStore();
  const rows = messages.filter((m) => m.missionId === missionId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MessagesSquare className="h-4 w-4 text-brand" /> A2A Coordination Console</CardTitle>
        <CardDescription>Live agent-to-agent messages.</CardDescription>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="py-8 text-center text-sm text-faint">No messages yet. Run the mission.</p>
        ) : (
          <div className="space-y-2">
            <AnimatePresence initial={false}>
              {rows.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-border bg-surface-2/40 p-3">
                  <div className="mb-1 flex items-center gap-2 text-xs">
                    <span className="font-medium text-ink">{m.from}</span>
                    <ArrowRight className="h-3 w-3 text-faint" />
                    <span className="font-medium text-ink">{m.to}</span>
                    <Badge tone={kindTone[m.kind]} className="ml-auto">{m.kind}</Badge>
                  </div>
                  <p className="text-sm text-muted">{m.message}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
