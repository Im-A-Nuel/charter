"use client";

import * as React from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const SECTIONS = [
  { id: "intro", label: "Introduction" },
  { id: "quickstart", label: "Quickstart" },
  { id: "first-mission", label: "First mission" },
  { id: "missions", label: "Missions" },
  { id: "permission-chain", label: "Permission chain" },
  { id: "agent-team", label: "Agent team" },
  { id: "payments", label: "Payments & x402" },
  { id: "observability", label: "Observability" },
  { id: "simulated", label: "Simulated runs" },
];

export default function Docs() {
  const [active, setActive] = React.useState("intro");

  React.useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-80px 0px -65% 0px", threshold: 0 }
    );
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const cls = (id: string) => (active === id ? "active" : "");

  return (
    <>
      <SiteNav />
      <div className="wrap">
        <div className="docs-layout">
          {/* LEFT SIDEBAR */}
          <aside className="docs-side">
            <div className="ds-group">
              <h6>Getting started</h6>
              <a className={cls("intro")} href="#intro">Introduction</a>
              <a className={cls("quickstart")} href="#quickstart">Quickstart</a>
              <a className={cls("first-mission")} href="#first-mission">Your first mission</a>
            </div>
            <div className="ds-group">
              <h6>Core concepts</h6>
              <a className={cls("missions")} href="#missions">Missions</a>
              <a className={cls("permission-chain")} href="#permission-chain">Permission chain</a>
              <a className={cls("agent-team")} href="#agent-team">Agent team</a>
              <a className={cls("payments")} href="#payments">Payments &amp; x402</a>
            </div>
            <div className="ds-group">
              <h6>Reference</h6>
              <a className={cls("observability")} href="#observability">Observability</a>
              <a className={cls("simulated")} href="#simulated">Simulated runs</a>
            </div>
          </aside>

          {/* MAIN */}
          <main className="docs-main">
            <div className="crumb">Docs <span className="sep">/</span> Getting started <span className="sep">/</span> <span style={{ color: "var(--green)" }}>Introduction</span></div>

            <section id="intro" style={{ paddingTop: 0 }}>
              <h2 className="doc-h">Build missions with accountable agents</h2>
              <p className="doc-lede">Charter is the mission-control framework for AI agents that delegate permission and pay on-chain. You describe a goal and a budget; Charter assembles an agent team, signs a scoped permission chain, and runs the mission — every action auditable.</p>
              <div className="callout">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7}><circle cx="12" cy="12" r="9" /><path d="M12 8h.01M11 12h1v4h1" /></svg>
                <div className="ct"><b>New here?</b> Run a live mission in <Link className="ilink" href="/dashboard">Mission Control</Link> — no install required — then come back and wire it in code.</div>
              </div>
            </section>

            <section id="quickstart">
              <h3 className="sec-h"><span className="n">1</span>Quickstart</h3>
              <p>Clone the Charter workspace and run the dev console. It ships Mission Control, the API routes, and a starter mission — pointed at a simulated chain so nothing costs real funds.</p>
              <CodeBlock fn="terminal" copy="npx degit Im-A-Nuel/charter charter && cd charter && npm install && npm run dev">
                <span className="cl"><span className="c"># scaffold the Charter workspace</span></span>
                <span className="cl"><span className="f">npx</span> degit Im-A-Nuel/charter charter</span>
                <span className="cl">{" "}</span>
                <span className="cl"><span className="c"># install &amp; run the dev console</span></span>
                <span className="cl"><span className="f">cd</span> charter &amp;&amp; npm install</span>
                <span className="cl"><span className="f">npm</span> run dev</span>
              </CodeBlock>
              <p>Open <code>localhost:3000</code> and you&apos;ll land in Mission Control, pointed at a simulated chain so nothing costs real funds.</p>
            </section>

            <section id="first-mission">
              <h3 className="sec-h"><span className="n">2</span>Your first mission</h3>
              <p>A mission is a goal, a budget, and a set of roles. Charter turns that into a running, signed agent team. Here&apos;s the canonical market-scan mission:</p>
              <CodeBlock fn="mission.ts" copy={"import { Mission } from '@charter/core';"}>
                <span className="cl"><span className="k">import</span> {"{ Mission, erc7710 }"} <span className="k">from</span> <span className="s">&quot;@charter/core&quot;</span>;</span>
                <span className="cl">{" "}</span>
                <span className="cl"><span className="k">const</span> scan = <span className="k">new</span> <span className="f">Mission</span>({"{"}</span>
                <span className="cl">{"  "}id: <span className="s">&quot;market-scan&quot;</span>,</span>
                <span className="cl">{"  "}goal: <span className="s">&quot;Source 3 vendors, pay a deposit&quot;</span>,</span>
                <span className="cl">{"  "}budget: <span className="s">&quot;25 USDC&quot;</span>,</span>
                <span className="cl">{"  "}roles: [<span className="s">&quot;manager&quot;</span>, <span className="s">&quot;worker&quot;</span>, <span className="s">&quot;payer&quot;</span>],</span>
                <span className="cl">{"  "}permission: <span className="f">erc7710</span>({"{"} revocable: <span className="n">true</span> {"}"}),</span>
                <span className="cl">{"});"}</span>
                <span className="cl">{" "}</span>
                <span className="cl"><span className="k">await</span> scan.<span className="f">run</span>({"{"} simulated: <span className="n">true</span> {"}"});</span>
              </CodeBlock>
              <div className="callout amber">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7}><path d="M12 9v4M12 17h.01M10.3 3.9 2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" /></svg>
                <div className="ct">Keep <b>simulated: true</b> until you&apos;ve reviewed the permission chain. Flip it off only when you&apos;re ready to settle on Base with real funds.</div>
              </div>
            </section>

            <section id="missions">
              <h3 className="sec-h"><span className="n">3</span>Missions</h3>
              <p>A <code>Mission</code> is the top-level unit of work. It owns the goal, the budget cap, the roster of roles, and the permission model. Running a mission moves it through these phases:</p>
              <ul>
                <li><b>Planning</b> — the Manager decomposes the goal into role assignments.</li>
                <li><b>Delegating</b> — the User → Manager root delegation is signed.</li>
                <li><b>Research → Risk</b> — data is collected, then approved or rejected.</li>
                <li><b>Redelegating → Paying</b> — a smaller budget is redelegated and redeemed.</li>
                <li><b>Writing → Done</b> — a final report is written and the run settles.</li>
              </ul>
            </section>

            <section id="permission-chain">
              <h3 className="sec-h"><span className="n">4</span>Permission chain</h3>
              <p>Authority flows <code>User → Manager → Payment</code>. Each link is a scoped, budget-bounded delegation signed with ERC-7710 — so a manager agent can spend up to a cap without ever holding your keys, and the redelegation to the payment agent is strictly smaller than the parent.</p>
              <CodeBlock fn="permission.ts" copy="erc7710">
                <span className="cl"><span className="k">const</span> chain = <span className="f">erc7710</span>({"{"}</span>
                <span className="cl">{"  "}root: <span className="s">&quot;0x71C2…9a3&quot;</span>,        <span className="c">{"// you"}</span></span>
                <span className="cl">{"  "}links: [</span>
                <span className="cl">{"    "}{"{ "}to: <span className="s">&quot;manager&quot;</span>, cap: <span className="s">&quot;25 USDC&quot;</span> {"}"},</span>
                <span className="cl">{"    "}{"{ "}to: <span className="s">&quot;payment&quot;</span>, cap: <span className="s">&quot;5 USDC&quot;</span>, perTx: <span className="s">&quot;1 USDC&quot;</span> {"}"},</span>
                <span className="cl">{"  "}],</span>
                <span className="cl">{"  "}revocable: <span className="n">true</span>,</span>
                <span className="cl">{"});"}</span>
              </CodeBlock>
            </section>

            <section id="agent-team">
              <h3 className="sec-h"><span className="n">5</span>Agent team</h3>
              <p>Roles map to agents. Charter&apos;s built-in roles are <code>manager</code>, <code>research</code>, <code>risk</code>, <code>payment</code>, and <code>writer</code> — each with a default toolset and charter. Agents talk to each other over the A2A protocol with five message kinds: instruct, request, approve, execute, and report.</p>
            </section>

            <section id="payments">
              <h3 className="sec-h"><span className="n">6</span>Payments &amp; x402</h3>
              <p>Agents settle through the <code>x402</code> payment protocol on Base. Every transfer is budget-bounded and recorded with a txHash, so you can audit exactly what was spent and where. Metered APIs can be paid per-call without a subscription, redeemed through the redelegated permission chain.</p>
            </section>

            <section id="observability">
              <h3 className="sec-h"><span className="n">7</span>Observability</h3>
              <p>Each mission produces three live views: a <b>timeline</b> of execution steps, an <b>A2A console</b> of inter-agent messages, and a <b>final report</b> with risk level, total cost, and txHash. Nothing an agent does is a black box.</p>
            </section>

            <section id="simulated">
              <h3 className="sec-h"><span className="n">8</span>Simulated runs</h3>
              <p>Every mission can run in simulated mode. The full permission chain, A2A console, timeline, and report all work — payments are marked <code>simulated</code> until you connect a wallet for a signed on-chain run. It&apos;s the safest way to dry-run a new agent team.</p>
              <div className="callout">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7}><path d="M5 12l5 5L20 7" /></svg>
                <div className="ct">You&apos;re ready. <Link className="ilink" href="/dashboard">Open Mission Control</Link> or <Link className="ilink" href="/templates">start from a template</Link>.</div>
              </div>
            </section>
          </main>

          {/* RIGHT TOC */}
          <aside className="docs-toc">
            <h6>On this page</h6>
            {SECTIONS.map((s) => (
              <a key={s.id} className={cls(s.id)} href={`#${s.id}`}>{s.label}</a>
            ))}
          </aside>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}

function CodeBlock({ fn, copy, children }: { fn: string; copy: string; children: React.ReactNode }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div className="codeblock">
      <div className="cb-top">
        <span className="fn">{fn}</span>
        <button className="cb-copy" onClick={() => { navigator.clipboard?.writeText(copy); setCopied(true); setTimeout(() => setCopied(false), 1200); }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre><code>{children}</code></pre>
    </div>
  );
}
