"use client";

import * as React from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const Check = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M5 12l5 5L20 7" /></svg>;
const Cross = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 6l12 12M18 6 6 18" /></svg>;

export default function Pricing() {
  const [yearly, setYearly] = React.useState(false);

  return (
    <>
      <SiteNav />
      <header className="page-head" style={{ textAlign: "center", paddingBottom: 8 }}>
        <div className="wrap">
          <div className="ph-kicker">Pricing</div>
          <h1 style={{ maxWidth: 760, margin: "16px auto 0" }}>Pay for missions, not seats</h1>
          <p className="lede" style={{ marginLeft: "auto", marginRight: "auto" }}>Charter is free to build on. You only pay the platform fee on missions that settle on-chain — gas and agent spend are always your own wallet.</p>
        </div>
      </header>

      <div className="price-toggle">
        <span className={`lab${!yearly ? " on" : ""}`}>Monthly</span>
        <button type="button" className={`ptog${yearly ? " year" : ""}`} onClick={() => setYearly((y) => !y)} role="switch" aria-checked={yearly} aria-label="Toggle yearly billing" />
        <span className={`lab${yearly ? " on" : ""}`}>Yearly <span className="save">2 months free</span></span>
      </div>

      <main className="wrap">
        <div className="price-grid">
          {/* BUILDER */}
          <div className="ptier">
            <div className="pt-name">Builder</div>
            <div className="pt-desc">For solo developers prototyping agent missions in simulation.</div>
            <div className="pt-price"><span className="amt">$0</span><span className="per">/ forever</span></div>
            <div className="pt-cta"><Link className="btn btn-ghost" href="/dashboard">Start building</Link></div>
            <div className="pt-feats">
              <div className="ftitle">Includes</div>
              <Feat>Unlimited <b>simulated</b> missions</Feat>
              <Feat>Full Mission Control console</Feat>
              <Feat>A2A console, timeline &amp; reports</Feat>
              <Feat>Community templates</Feat>
              <Feat off>On-chain settlement</Feat>
              <Feat off>Team workspaces</Feat>
            </div>
          </div>

          {/* TEAM */}
          <div className="ptier feat-tier">
            <div className="badge-top">Most popular</div>
            <div className="pt-name">Team</div>
            <div className="pt-desc">For teams running real on-chain missions in production.</div>
            <div className="pt-price"><span className="amt">{yearly ? "$490" : "$49"}</span><span className="per">{yearly ? "/ yr" : "/ mo"}</span></div>
            <div className="pt-cta"><Link className="btn btn-green" href="/dashboard">Launch a mission</Link></div>
            <div className="pt-feats">
              <div className="ftitle">Everything in Builder, plus</div>
              <Feat><b>On-chain settlement</b> on Base</Feat>
              <Feat>x402 metered payments</Feat>
              <Feat><b>1.5%</b> platform fee per settled mission</Feat>
              <Feat>Up to 10 team members</Feat>
              <Feat>Revocable permission chains</Feat>
              <Feat>Email &amp; Discord support</Feat>
            </div>
          </div>

          {/* ENTERPRISE */}
          <div className="ptier">
            <div className="pt-name">Enterprise</div>
            <div className="pt-desc">For organizations with custom standards, SLAs, and on-prem inference.</div>
            <div className="pt-price"><span className="custom">Custom</span></div>
            <div className="pt-cta"><Link className="btn btn-ghost" href="/">Contact sales</Link></div>
            <div className="pt-feats">
              <div className="ftitle">Everything in Team, plus</div>
              <Feat>Negotiated <b>platform fee</b></Feat>
              <Feat>Self-hosted Venice inference</Feat>
              <Feat>SSO, audit log &amp; SCIM</Feat>
              <Feat>Custom permission standards</Feat>
              <Feat>Dedicated solutions engineer</Feat>
              <Feat>99.9% uptime SLA</Feat>
            </div>
          </div>
        </div>

        <section className="cmp">
          <h2>Compare every plan</h2>
          <div className="cmp-table">
            <div className="cmp-row head">
              <div className="feature" style={{ fontFamily: "'JetBrains Mono',monospace", color: "var(--ink-3)", fontSize: 13 }}>Capability</div>
              <div className="ch">Builder</div>
              <div className="ch feat">Team</div>
              <div className="ch">Enterprise</div>
            </div>

            <Group label="Missions" />
            <Row feature="Simulated missions" cells={["Unlimited", "Unlimited", "Unlimited"]} />
            <Row feature="On-chain missions / mo" cells={[null, "500", "Unlimited"]} />
            <Row feature="Platform fee per settled mission" cells={[null, "1.5%", "Custom"]} />
            <Row feature="Concurrent agents" cells={["3", "25", "Unlimited"]} />

            <Group label="Permission & payments" />
            <Row feature="ERC-7710 permission chains" cells={[true, true, true]} />
            <Row feature="x402 metered payments" cells={[null, true, true]} />
            <Row feature="On-chain settlement (Base)" cells={[null, true, true]} />
            <Row feature="Custom permission standards" cells={[null, null, true]} />

            <Group label="Observability & support" />
            <Row feature="A2A console, timeline & reports" cells={[true, true, true]} />
            <Row feature="Report retention" cells={["7 days", "1 year", "Custom"]} />
            <Row feature="SSO & audit log" cells={[null, null, true]} />
            <Row feature="Support" cells={["Community", "Email + Discord", "Dedicated SE"]} />
          </div>
        </section>

        <div className="faq" style={{ marginTop: 64 }}>
          <div className="faq-h">Pricing questions</div>
          <div className="faq-list">
            {PFAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} defaultOpen={i === 0} />)}
          </div>
        </div>
      </main>

      <div className="bigcta">
        <div className="wrap">
          <h2>Run your first mission free</h2>
          <div className="row">
            <Link className="btn btn-ghost" href="/dashboard">Open Mission Control</Link>
            <Link className="btn btn-ghost" href="/docs">Read the docs</Link>
          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}

function Feat({ children, off }: { children: React.ReactNode; off?: boolean }) {
  return <div className={`feat${off ? " off" : ""}`}>{off ? <Cross /> : <Check />}{children}</div>;
}

function Group({ label }: { label: string }) {
  return <div className="cmp-row group"><span className="gl">{label}</span></div>;
}

function Row({ feature, cells }: { feature: string; cells: (string | boolean | null)[] }) {
  return (
    <div className="cmp-row">
      <div className="feature">{feature}</div>
      {cells.map((c, i) => (
        <div key={i} className="cell">
          {c === true ? <Check /> : c === null ? <span className="no">—</span> : <span>{c}</span>}
        </div>
      ))}
    </div>
  );
}

const PFAQS = [
  { q: "What counts as a settled mission?", a: "A settled mission is one that completes at least one real on-chain payment on Base. Simulated dry-runs never count toward your quota or incur a platform fee, no matter how many you run." },
  { q: "Do I pay gas and agent spend separately?", a: "Yes. Gas and the funds your agents actually spend always come from your own connected wallet. The platform fee is charged only on the value a mission settles, on top of those costs." },
  { q: "Can I start on Builder and upgrade later?", a: "Absolutely. Build and dry-run for free on Builder for as long as you like. The moment you want a mission to settle on-chain, upgrade to Team — your missions, templates, and permission chains carry over untouched." },
  { q: "Is there a discount for yearly billing?", a: "Yes — paying yearly gives you two months free versus monthly billing. Toggle the switch above the plans to see the yearly price." },
  { q: "What models power the agents?", a: "Charter runs on Venice models for inference and report generation, and is model-agnostic at the framework level. Enterprise plans can self-host inference for full data control." },
];

function FaqItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = React.useState(!!defaultOpen);
  return (
    <div className={`qa${open ? " open" : ""}`}>
      <button onClick={() => setOpen((o) => !o)}>
        {q}
        <svg className="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M9 6l6 6-6 6" /></svg>
      </button>
      <div className="ans"><p>{a}</p></div>
    </div>
  );
}
