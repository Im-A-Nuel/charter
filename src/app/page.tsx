"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Network, ArrowRight, Crown, Search, ShieldAlert, CreditCard, PenTool,
  GitBranch, Eye, Sparkles, Users, ArrowDown,
} from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const fade = {
  hidden: { opacity: 0, y: 16 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.5 } }),
};

export default function Landing() {
  return (
    <>
      <SiteNav />

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="relative mx-auto max-w-6xl px-4 pt-20 pb-16 text-center">
          <motion.div initial="hidden" animate="show" variants={fade}>
            <Badge tone="violet" className="mx-auto mb-6">
              <Sparkles className="h-3 w-3" /> Best A2A Coordination · Best Agent · Venice AI
            </Badge>
          </motion.div>
          <motion.h1 custom={1} initial="hidden" animate="show" variants={fade}
            className="mx-auto max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-ink sm:text-6xl">
            Define the authority
            <br />
            <span className="bg-gradient-to-r from-brand to-brand-2 bg-clip-text text-transparent">of every agent.</span>
          </motion.h1>
          <motion.p custom={2} initial="hidden" animate="show" variants={fade}
            className="mx-auto mt-6 max-w-2xl text-lg text-muted">
            Charter is a coordination layer where a manager agent assigns scoped authority to specialist agents
            through <span className="text-ink">redelegated</span> ERC-7710 permissions. Every agent acts under a charter —
            and only receives the authority its role requires.
          </motion.p>
          <motion.div custom={3} initial="hidden" animate="show" variants={fade} className="mt-9 flex items-center justify-center gap-3">
            <Link href="/dashboard"><Button size="lg">Launch the demo <ArrowRight className="h-4 w-4" /></Button></Link>
            <Link href="#how"><Button size="lg" variant="secondary">How it works</Button></Link>
          </motion.div>

          <motion.div custom={4} initial="hidden" animate="show" variants={fade} className="mx-auto mt-14 max-w-md">
            <ChainPreview />
          </motion.div>
        </div>
      </section>

      <Section id="problem" title="Single agents aren't enough" kicker="The problem">
        <div className="grid gap-4 sm:grid-cols-3">
          <Feature icon={Users} title="Real workflows need teams" desc="One agent plans, one researches, one evaluates risk, one pays, one writes. Coordination is unavoidable." />
          <Feature icon={ShieldAlert} title="But not full access" desc="You can't hand every agent your wallet. The hard problem isn't talking — it's authority." />
          <Feature icon={GitBranch} title="Authority must be scoped" desc="Each agent should receive only the permission its role needs — and it should be visible and auditable." />
        </div>
      </Section>

      <Section id="how" title="How Charter works" kicker="Redelegated authority">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Feature icon={Crown} title="1 · Grant the Manager" desc="The user signs a root ERC-7710 delegation to the Manager Agent for the whole mission budget." />
          <Feature icon={GitBranch} title="2 · Redelegate" desc="The Manager redelegates a smaller scoped permission to the Payment Agent — never the full authority." />
          <Feature icon={ShieldAlert} title="3 · Coordinate" desc="Research finds data, Risk approves, Manager authorizes — all as visible agent-to-agent messages." />
          <Feature icon={CreditCard} title="4 · Execute & audit" desc="The Payment Agent redeems the chain to pay. The permission chain and timeline stay fully auditable." />
        </div>
      </Section>

      <Section id="team" title="The agent team" kicker="Every agent under a charter">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <RoleMini icon={Crown} role="Manager" cap="redelegates" />
          <RoleMini icon={Search} role="Research" cap="read-only" />
          <RoleMini icon={ShieldAlert} role="Risk" cap="approve / reject" />
          <RoleMini icon={CreditCard} role="Payment" cap="spend ≤ limit" />
          <RoleMini icon={PenTool} role="Writer" cap="report only" />
        </div>
      </Section>

      <Section id="tracks" title="Built for the tracks" kicker="Where Charter qualifies">
        <div className="grid gap-4 sm:grid-cols-2">
          <Track tone="violet" title="Best A2A Coordination" points={["Redelegation is the center of the product", "Visible, auditable permission chain", "MetaMask Smart Accounts Kit in the main flow"]} />
          <Track tone="brand" title="Best Agent" points={["Five agents do real, distinct work", "Manager plans, Risk decides, Payment pays", "Writer produces a real report"]} />
          <Track tone="good" title="Best use of Venice AI" points={["Manager planner", "Risk evaluator", "Writer report generator"]} />
          <Track tone="warn" title="x402 + ERC-7710" points={["Payment Agent pays an x402 service", "Under redelegated authority", "On-chain redemption"]} />
        </div>
      </Section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-surface-2 to-surface p-10 text-center">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="relative">
            <Network className="mx-auto h-10 w-10 text-brand" />
            <h2 className="mt-4 text-2xl font-semibold text-ink sm:text-3xl">Charter controls how agents coordinate.</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted">Create a mission, watch the manager redelegate scoped authority, and inspect the full chain.</p>
            <Link href="/dashboard" className="mt-7 inline-block"><Button size="lg">Open Mission Control <ArrowRight className="h-4 w-4" /></Button></Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-faint">
        Charter · Redelegated authority for agent teams · MetaMask Smart Accounts + ERC-7710 + Venice AI
      </footer>
    </>
  );
}

function ChainPreview() {
  const nodes = [
    { label: "User Wallet", budget: "5 USDC", tone: "neutral" as const },
    { label: "Manager Agent", budget: "5 USDC", tone: "brand" as const },
    { label: "Payment Agent", budget: "1 USDC", tone: "violet" as const },
  ];
  return (
    <div className="rounded-2xl border border-border bg-surface/70 p-4">
      {nodes.map((n, i) => (
        <div key={n.label}>
          <div className={`flex items-center justify-between rounded-xl border p-3 ${
            n.tone === "violet" ? "border-brand-2/40 bg-brand-2/10" : n.tone === "brand" ? "border-brand/40 bg-brand/10" : "border-border bg-surface-2"
          }`}>
            <span className="text-sm text-ink">{n.label}</span>
            <Badge tone={n.tone === "violet" ? "violet" : n.tone === "brand" ? "brand" : "neutral"}>{n.budget}</Badge>
          </div>
          {i < nodes.length - 1 && (
            <div className="flex items-center justify-center gap-2 py-1 text-[11px] text-faint">
              <ArrowDown className="h-3 w-3" /> {i === 0 ? "delegation" : "redelegation"}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Section({ id, title, kicker, children }: { id: string; title: string; kicker: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mx-auto max-w-6xl px-4 py-14">
      <div className="mb-7">
        <p className="text-xs font-medium uppercase tracking-wider text-brand">{kicker}</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Feature({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border bg-surface/70 p-5">
      <div className="grid h-9 w-9 place-items-center rounded-lg bg-surface-2 text-brand"><Icon className="h-4.5 w-4.5" /></div>
      <h3 className="mt-3 font-medium text-ink">{title}</h3>
      <p className="mt-1.5 text-sm text-muted">{desc}</p>
    </motion.div>
  );
}

function RoleMini({ icon: Icon, role, cap }: { icon: React.ElementType; role: string; cap: string }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/70 p-4 text-center">
      <div className="mx-auto grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-brand"><Icon className="h-5 w-5" /></div>
      <div className="mt-2 text-sm font-medium text-ink">{role}</div>
      <div className="text-[11px] text-faint">{cap}</div>
    </div>
  );
}

function Track({ title, points, tone }: { title: string; points: string[]; tone: "brand" | "violet" | "good" | "warn" }) {
  return (
    <div className="rounded-2xl border border-border bg-surface/70 p-5">
      <Badge tone={tone}>{title}</Badge>
      <ul className="mt-3 space-y-2">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-muted">
            <Eye className="mt-0.5 h-4 w-4 shrink-0 text-faint" /> {p}
          </li>
        ))}
      </ul>
    </div>
  );
}
