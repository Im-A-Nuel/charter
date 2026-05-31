"use client";

import * as React from "react";
import type { Mission, AgentCharter, PermissionLink, AgentMessage, TimelineStep, FinalReport } from "./types";
import type { SignedDelegation } from "./redelegation";

interface SignedSet {
  root?: SignedDelegation;
  redelegation?: SignedDelegation;
}

interface StoreState {
  missions: Mission[];
  charters: AgentCharter[];
  links: PermissionLink[];
  messages: AgentMessage[];
  timeline: TimelineStep[];
  reports: FinalReport[];
  ready: boolean;
  createMission: (m: Mission, charters: AgentCharter[]) => void;
  updateMission: (id: string, patch: Partial<Mission>) => void;
  addLink: (l: PermissionLink) => void;
  addMessage: (m: AgentMessage) => void;
  addTimeline: (t: TimelineStep) => void;
  patchTimeline: (id: string, patch: Partial<TimelineStep>) => void;
  setReport: (r: FinalReport) => void;
  setSigned: (missionId: string, key: "root" | "redelegation", d: SignedDelegation) => void;
  getSigned: (missionId: string) => SignedSet;
  clearMissionRuntime: (missionId: string) => void;
  reset: () => void;
}

const Ctx = React.createContext<StoreState | null>(null);
const KEY = "charter_state_v1";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [missions, setMissions] = React.useState<Mission[]>([]);
  const [charters, setCharters] = React.useState<AgentCharter[]>([]);
  const [links, setLinks] = React.useState<PermissionLink[]>([]);
  const [messages, setMessages] = React.useState<AgentMessage[]>([]);
  const [timeline, setTimeline] = React.useState<TimelineStep[]>([]);
  const [reports, setReports] = React.useState<FinalReport[]>([]);
  const [ready, setReady] = React.useState(false);
  const signedRef = React.useRef<Map<string, SignedSet>>(new Map());

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const p = JSON.parse(raw);
        setMissions(p.missions ?? []); setCharters(p.charters ?? []); setLinks(p.links ?? []);
        setMessages(p.messages ?? []); setTimeline(p.timeline ?? []); setReports(p.reports ?? []);
      }
    } catch { /* ignore */ }
    setReady(true);
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify({ missions, charters, links, messages, timeline, reports }));
  }, [missions, charters, links, messages, timeline, reports, ready]);

  const value: StoreState = {
    missions, charters, links, messages, timeline, reports, ready,
    createMission: React.useCallback((m, ch) => {
      setMissions((p) => [m, ...p]);
      setCharters((p) => [...ch, ...p]);
    }, []),
    updateMission: React.useCallback((id, patch) => setMissions((p) => p.map((m) => (m.id === id ? { ...m, ...patch } : m))), []),
    addLink: React.useCallback((l) => setLinks((p) => [...p, l]), []),
    addMessage: React.useCallback((m) => setMessages((p) => [...p, m]), []),
    addTimeline: React.useCallback((t) => setTimeline((p) => [...p, t]), []),
    patchTimeline: React.useCallback((id, patch) => setTimeline((p) => p.map((t) => (t.id === id ? { ...t, ...patch } : t))), []),
    setReport: React.useCallback((r) => setReports((p) => [r, ...p.filter((x) => x.missionId !== r.missionId)]), []),
    setSigned: React.useCallback((missionId, k, d) => {
      const cur = signedRef.current.get(missionId) ?? {};
      signedRef.current.set(missionId, { ...cur, [k]: d });
    }, []),
    getSigned: React.useCallback((missionId) => signedRef.current.get(missionId) ?? {}, []),
    clearMissionRuntime: React.useCallback((missionId) => {
      setLinks((p) => p.filter((l) => l.missionId !== missionId));
      setMessages((p) => p.filter((m) => m.missionId !== missionId));
      setTimeline((p) => p.filter((t) => t.missionId !== missionId));
      setReports((p) => p.filter((r) => r.missionId !== missionId));
      signedRef.current.delete(missionId);
    }, []),
    reset: React.useCallback(() => {
      setMissions([]); setCharters([]); setLinks([]); setMessages([]); setTimeline([]); setReports([]);
      signedRef.current.clear();
      localStorage.removeItem(KEY);
    }, []),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
