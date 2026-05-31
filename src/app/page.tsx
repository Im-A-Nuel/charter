"use client";

import * as React from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export default function Landing() {
  return (
    <>
      <SiteNav />

      {/* ============================ HERO ============================ */}
      <header className="hero">
        <div className="wrap hero-grid">
          <div className="hero-copy">
            <div className="kicker">Now in preview</div>
            <div className="announce">
              <div className="a-title">Charter Mission Control — agents that earn permission, on-chain</div>
              <div className="a-sub"><b>Launch the demo →</b>&nbsp; Define a mission, then watch the chain sign itself.</div>
            </div>
            <h1 className="hero-h">Missions with<br />accountable agents</h1>
            <p className="hero-sub">Charter is the mission-control framework for AI agents that delegate permission and pay on-chain — every action scoped, signed, and auditable.</p>
            <div className="hero-cta">
              <CopyCmd />
              <Link className="demo-link" href="/dashboard">Launch the demo
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M7 17 17 7M9 7h8v8" /></svg>
              </Link>
            </div>
          </div>

          <div className="hero-graphic">
            <div className="hero-orbit"><div className="hero-blob" /></div>
            <HeroNode color="#5b9dff" glyph={<><circle cx="12" cy="8" r="3.4" /><path d="M5 20c0-3.3 3-6 7-6s7 2.7 7 6" /></>} label="User" top="8%" left="50%" />
            <HeroNode color="#00e599" glyph={<path d="M12 3c1.3 1.7 2.7 2.3 4.7 2.5-.2 2 .4 3.4 2 4.7-1.6 1.3-2.2 2.7-2 4.7-2 .2-3.4.8-4.7 2.5-1.3-1.7-2.7-2.3-4.7-2.5.2-2-.4-3.4-2-4.7 1.6-1.3 2.2-2.7 2-4.7 2-.2 3.4-.8 4.7-2.5Z" />} label="Manager" top="50%" left="10%" />
            <HeroNode color="#ffb347" glyph={<><circle cx="12" cy="12" r="8" /><path d="M12 8v8M9.5 10c0-1 1.1-1.6 2.5-1.6S14.5 9 14.5 10" /></>} label="Payment" top="50%" left="90%" />
            <HeroNode color="#a78bfa" glyph={<><circle cx="11" cy="11" r="6" /><path d="M20 20l-4-4" /></>} label="Research" top="88%" left="32%" />
            <HeroNode color="#f472b6" glyph={<><path d="M3 17 14 6l4 4L7 21H3v-4Z" /><path d="M14 6l3-3 4 4-3 3" /></>} label="Writer" top="88%" left="68%" />
          </div>
        </div>

        <div className="wrap cloud">
          <div className="cloud-h">Built on open standards for agentic payments</div>
          <div className="cloud-row">
            <div className="logo-item"><span className="wm mono">ERC-7710</span><span className="rs">Delegation</span></div>
            <div className="logo-item"><span className="wm mono">x402</span><span className="rs">Payments</span></div>
            <div className="logo-item"><span className="wm">Base</span><span className="rs">Settlement</span></div>
            <div className="logo-item"><span className="wm">Venice</span><span className="rs">Inference</span></div>
            <div className="logo-item"><span className="wm">MetaMask</span><span className="rs">Toolkit</span></div>
            <div className="logo-item"><span className="wm mono">viem</span><span className="rs">On-chain</span></div>
          </div>
        </div>
      </header>

      {/* ============================ BUILD ============================ */}
      <section className="feat" id="build">
        <div className="wrap">
          <div className="panel intro-panel">
            <div className="pill"><span className="pd" />Mission Builder</div>
            <div className="intro-art">
              <div className="spec mono" style={{ position: "absolute", left: 0, top: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 13.5, lineHeight: 2.05, color: "var(--ink-3)" }}>
                <SpecLine k="Mission created" /><br />
                <SpecLine k="Roles to assign" v="Manager, Worker, Payer" /><br />
                <SpecLine k="Permission model" v="ERC-7710" /><br />
                <SpecLine k="Budget cap" v="25 USDC" />
              </div>
            </div>
            <h2 className="feat-h">Build your mission</h2>
            <p className="feat-sub">Missions. Roles. Budgets. Permissions. Charter takes you from a one-line goal to a running, signed agent team.</p>
          </div>

          <IconTabs />

          <div className="duo">
            <div className="cardx">
              <div className="code-wrap code mono">
                <div className="ln"><span className="k">import</span> {"{ Mission }"} <span className="k">from</span> <span className="s">&quot;@charter/core&quot;</span>;</div>
                <div className="ln">&nbsp;</div>
                <div className="ln"><span className="k">const</span> mission = <span className="k">new</span> <span className="f">Mission</span>({"{"}</div>
                <div className="ln">&nbsp;&nbsp;id: <span className="s">&quot;token-risk-report&quot;</span>,</div>
                <div className="ln">&nbsp;&nbsp;goal: <span className="s">&quot;Risk-score a token, pay if needed&quot;</span>,</div>
                <div className="ln">&nbsp;&nbsp;budget: <span className="s">&quot;5 USDC&quot;</span>,</div>
                <div className="ln">&nbsp;&nbsp;roles: [<span className="s">&quot;manager&quot;</span>, <span className="s">&quot;research&quot;</span>, <span className="s">&quot;risk&quot;</span>, <span className="s">&quot;payment&quot;</span>],</div>
                <div className="ln">&nbsp;&nbsp;permission: <span className="f">erc7710</span>({"{"} revocable: <span className="k">true</span> {"}"}),</div>
                <div className="ln">{"});"}</div>
              </div>
              <div className="foot">
                <h3>Compose a mission in code</h3>
                <p className="meta">Set the goal, budget, duration, and roles — Charter wires the rest.</p>
              </div>
            </div>

            <div className="cardx">
              <div className="pcv">
                <div className="pc-head">
                  <span className="mono">PERMISSION CHAIN</span>
                  <span className="pc-stat"><span className="d" />signed · on-chain</span>
                </div>
                <div className="pchain">
                  <div className="pc-node" style={{ ["--nc" as string]: "var(--blue)" }}>
                    <span className="av"><svg viewBox="0 0 24 24" strokeWidth={1.7}><circle cx="12" cy="8" r="3.4" /><path d="M5 20c0-3.3 3-6 7-6s7 2.7 7 6" /></svg></span>
                    <span className="nm">User</span><span className="rl">owner</span>
                  </div>
                  <div className="pc-link"><span className="cap">5 USDC</span><span className="wire" /></div>
                  <div className="pc-node" style={{ ["--nc" as string]: "var(--green)" }}>
                    <span className="av"><svg viewBox="0 0 24 24" strokeWidth={1.7}><path d="M12 3c1 1.3 2 1.8 3.6 2-.1 1.5.3 2.6 1.5 3.6-1.2 1-1.6 2.1-1.5 3.6-1.6.2-2.6.7-3.6 2-1-1.3-2-1.8-3.6-2 .1-1.5-.3-2.6-1.5-3.6 1.2-1 1.6-2.1 1.5-3.6 1.6-.2 2.6-.7 3.6-2Z" /></svg></span>
                    <span className="nm">Manager</span><span className="rl">approve</span>
                  </div>
                  <div className="pc-link"><span className="cap">≤ 1</span><span className="wire" /></div>
                  <div className="pc-node" style={{ ["--nc" as string]: "var(--amber)" }}>
                    <span className="av"><svg viewBox="0 0 24 24" strokeWidth={1.7}><circle cx="12" cy="12" r="8" /><path d="M12 8v8M9.5 10c0-1 1.1-1.6 2.5-1.6S14.5 9 14.5 10" /></svg></span>
                    <span className="nm">Payment</span><span className="rl">spend</span>
                  </div>
                </div>
                <div className="pc-foot">
                  <span className="badge green"><svg className="bi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="M5 12l5 5L20 7" /></svg>ERC-7710 signed</span>
                  <span className="badge violet">redelegation</span>
                  <span className="badge neutral">explorer ↗</span>
                </div>
              </div>
              <div className="foot">
                <h3>Watch the permission chain</h3>
                <p className="meta">User → Manager → Payment, each link signed and budget-scoped.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================ OBSERVE ============================ */}
      <section className="feat" id="observe">
        <div className="wrap">
          <div className="panel intro-panel" style={{ minHeight: 320 }}>
            <div className="pill"><span className="pd" />Observability</div>
            <h2 className="feat-h">Observe every step</h2>
            <p className="feat-sub">Trace the conversation. Replay the spend. See exactly what your agents did, when, and for how much — until you trust them with production.</p>
          </div>

          <div className="bento">
            <div className="col">
              <div className="bcell">
                <h4>A2A Console</h4>
                <p className="meta">Inter-agent messages, live — instruct, request, approve, execute, report.</p>
                <div className="chart">
                  <svg viewBox="0 0 520 170" preserveAspectRatio="none">
                    <polyline points="0,150 60,150 60,135 120,135 120,118 180,118 180,128 240,128 240,98 300,98 300,80 360,80 360,55 420,55 420,38 510,38" stroke="#00e599" strokeWidth={2.4} fill="none" />
                    <polyline points="0,160 70,160 70,148 140,148 140,140 210,140 210,150 280,150 280,122 350,122 350,105 420,105 420,75 510,68" stroke="#ff7a45" strokeWidth={2.4} fill="none" />
                    <circle cx="510" cy="38" r="4.5" fill="#00e599" /><circle cx="510" cy="68" r="4.5" fill="#ff7a45" />
                  </svg>
                  <div className="legend">
                    <div className="ttl">market-scan</div>
                    <div className="row"><span className="nm"><span className="sw" style={{ background: "#00e599" }} />Approvals</span><span className="v" style={{ color: "#00e599" }}>14</span></div>
                    <div className="row"><span className="nm"><span className="sw" style={{ background: "#ff7a45" }} />Spend·USDC</span><span className="v" style={{ color: "#ff7a45" }}>5.8</span></div>
                  </div>
                </div>
                <h4 style={{ marginTop: 14 }}>Replay agent conversations</h4>
                <p className="meta">Every instruct / approve / execute, timestamped.</p>
              </div>
              <div className="bcell trace">
                <h4 style={{ marginBottom: 14 }}>Built-in timeline</h4>
                <TraceRow label="Token-risk mission" w="100%" ms="5.53 s" />
                <TraceRow label="Sign delegation" w="62%" ms="2.86 s" indent />
                <TraceRow label="Assign agents" w="12%" ms="0.14 s" indent2 />
                <TraceRow label="Risk evaluation" w="30%" ms="0.30 s" indent2 />
                <TraceRow label="x402 settle" w="22%" ms="0.21 s" indent2 />
              </div>
            </div>

            <div className="col">
              <SmallCell title="Risk scoring" body="Score every mission's output with model-graded, rule-based, and on-chain checks before funds move."
                icon={<path d="M12 3v18M5 7l7-2 7 2M5 7l-2 6a4 4 0 0 0 8 0L9 7M19 7l-2 6a4 4 0 0 0 8 0l-2-6" />} />
              <SmallCell title="Human-in-the-loop" body="Hold any step for approval, sanitize inputs, and block prompt-injection before an agent acts."
                icon={<path d="M12 11V4a2 2 0 1 1 4 0v7M8 11V7a2 2 0 1 1 4 0v4M16 11a2 2 0 1 1 4 0v3a7 7 0 0 1-7 7h-1a6 6 0 0 1-6-6v-1l-1.5-2a1.6 1.6 0 0 1 2.5-2L8 12" />} />
              <SmallCell title="Final Report" body="A Venice-written summary with risk level, total cost, txHash, and an on-chain / simulated badge."
                icon={<><path d="M6 3h9l4 4v14H6V3Z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></>} />
            </div>
          </div>
        </div>
      </section>

      {/* ============================ SETTLE ============================ */}
      <section className="feat">
        <div className="wrap">
          <div className="panel intro-panel" style={{ minHeight: 300 }}>
            <div className="pill"><span className="pd" />Payments</div>
            <h2 className="feat-h">Settle on-chain</h2>
            <p className="feat-sub">Agents pay through x402 and settle on Base. Every transfer is budget-bounded, signed, and visible on the explorer — or run it simulated until you&apos;re ready.</p>
          </div>

          <div className="duo" style={{ marginTop: 24 }}>
            <div className="cardx">
              <div className="pledger">
                <div className="pl-top">
                  <div className="pl-titles">
                    <span className="pl-kicker">Payment Ledger</span>
                    <span className="pl-mission"><span className="md" />token-risk</span>
                  </div>
                  <span className="pl-audit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}><path d="M12 3l8 3v6c0 4-3 7-8 9-5-2-8-5-8-9V6l8-3Z" /><path d="M9 12l2 2 4-4" /></svg>Auditable</span>
                </div>
                <div className="pl-meter">
                  <div className="pl-meter-head">
                    <span className="pl-mh-k">Spent this mission</span>
                    <span className="pl-mh-v"><b>1.00</b> / 5 USDC</span>
                  </div>
                  <div className="pl-bar"><i className="seg green" style={{ width: "16%" }} /><i className="seg amber" style={{ width: "4%" }} /></div>
                  <div className="pl-legend">
                    <span><span className="d green" />0.80 settled</span>
                    <span><span className="d amber" />0.20 pending</span>
                    <span className="right">4.00 headroom</span>
                  </div>
                </div>
                <div className="pl-rows">
                  <PlRow color="var(--blue)" name="Data API · x402" who="Research agent" hx="0xc8b7…83f4" amt="0.80" status="settled"
                    icon={<path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" />} />
                  <PlRow color="var(--amber)" name="Compute · Venice" who="Manager agent" hx="simulated" amt="0.20" status="pending"
                    icon={<path d="M12 3l2.2 5.5L20 9l-4.2 3.6L17 18l-5-3-5 3 1.2-5.4L4 9l5.8-.5L12 3Z" />} />
                </div>
              </div>
              <div className="foot">
                <h3>Track every transfer</h3>
                <p className="meta">A live ledger of what each agent spent, with txHash and status.</p>
              </div>
            </div>

            <div className="cardx">
              <div className="modeflow">
                <span className="mf-cap">On-chain · Base</span>
                <span className="mf-pill" style={{ ["--c" as string]: "var(--green)" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="M5 12l5 5L20 7" /></svg>signed</span>
                <span className="mf-wire top" />
                <span className="mf-core"><svg viewBox="0 0 48 48"><path d="M24 5c2 2.6 4 3.4 7 3.7-.3 3 .6 5 3 7-2.4 2-3.3 4-3 7-3 .3-5 1.1-7 3.7-2-2.6-4-3.4-7-3.7.3-3-.6-5-3-7 2.4-2 3.3-4 3-7 3-.3 5-1.1 7-3.7Z" /></svg></span>
                <span className="mf-wire bot" />
                <span className="mf-pill" style={{ ["--c" as string]: "var(--amber)" }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}><path d="M4 7h16v10H4zM4 11h16" /></svg>dry-run</span>
                <span className="mf-cap">Simulated · local</span>
                <Link href="/dashboard" className="btn btn-green" style={{ marginTop: 24 }}><span style={{ width: 7, height: 7, borderRadius: "50%", background: "#04130d" }} />Run mission</Link>
              </div>
              <div className="foot">
                <h3>Signed or simulated</h3>
                <p className="meta">Flip a mission between a real on-chain run and a safe dry-run.</p>
              </div>
            </div>
          </div>

          <div className="inline-cta">
            Start your first mission with
            <Link className="ip" href="/dashboard"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M4 5h16v14H4zM4 9h16" /></svg>Mission Control</Link>
            inspect the
            <Link className="ip" href="/#observe"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}><path d="M5 4h11l3 3v13H5z" /></svg>permission chain</Link>
            and ship with our
            <b>agent mission platform.</b>
          </div>

          <div className="templates">
            <Template tone="#0b1a14" title="Token Risk Report" meta="Risk-score a token and pay for data only if needed."
              chips={[{ ic: <><circle cx="11" cy="11" r="6" /><path d="M20 20l-4-4" /></>, t: "research" }, { ic: <path d="M12 3l8 3v6c0 4-3 7-8 9-5-2-8-5-8-9V6l8-3Z" />, t: "risk gate" }]} />
            <Template tone="#1a130b" title="Procurement Agent" meta="Source vendors and pay a deposit within budget."
              chips={[{ ic: <path d="M4 18l5-6 4 4 7-9" />, t: "source" }, { ic: <><circle cx="12" cy="12" r="8" /><path d="M12 4v8h8" /></>, t: "pay deposit" }]} />
            <Template tone="#0b121f" title="Ledger Query" meta="Ask questions about your settlements in plain language."
              chips={[{ ic: <path d="M5 7h14M5 12h14M5 17h9" />, t: "query on-chain" }]} />
          </div>

          <div className="faq" id="faq">
            <div className="faq-h">Frequently asked questions</div>
            <div className="faq-list">
              {FAQS.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} defaultOpen={i === 0} />)}
            </div>
          </div>
        </div>
      </section>

      {/* ============================ CTA + FOOTER ============================ */}
      <div className="bigcta">
        <div className="wrap">
          <h2>Ship missions you trust</h2>
          <div className="row">
            <Link className="btn btn-ghost" href="/dashboard">Get Started</Link>
            <Link className="btn btn-ghost" href="/#faq">Documentation</Link>
          </div>
        </div>
      </div>

      <SiteFooter />
    </>
  );
}

/* ---------------------------------------------------------------- helpers */

function HeroNode({ color, glyph, label, top, left }: { color: string; glyph: React.ReactNode; label: string; top: string; left: string }) {
  return (
    <div className="hero-node" style={{ ["--nc" as string]: color, top, left }}>
      <div className="ring"><svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">{glyph}</svg></div>
      <div className="lbl">{label}</div>
    </div>
  );
}

function CopyCmd() {
  const [copied, setCopied] = React.useState(false);
  const cmd = "npm create charter@latest";
  return (
    <div className="cmd mono">
      <span><span className="prompt">$</span>&nbsp; {cmd}</span>
      <span className="copy" title="Copy" onClick={() => { navigator.clipboard?.writeText(cmd); setCopied(true); setTimeout(() => setCopied(false), 1400); }}>
        {copied ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth={2.2}><path d="M5 12l5 5L20 7" /></svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V5a2 2 0 0 1 2-2h10" /></svg>
        )}
      </span>
    </div>
  );
}

function SpecLine({ k, v }: { k: string; v?: string }) {
  return (
    <>
      <span style={{ color: "var(--ink)", marginRight: 8 }}>◆ {k}</span>
      {v && <span style={{ color: "var(--green)" }}>&nbsp;{v}</span>}
    </>
  );
}

const TAB_ICONS: React.ReactNode[] = [
  <path key="0" d="M12 3c1.3 1.7 2.7 2.3 4.7 2.5-.2 2 .4 3.4 2 4.7-1.6 1.3-2.2 2.7-2 4.7-2 .2-3.4.8-4.7 2.5-1.3-1.7-2.7-2.3-4.7-2.5.2-2-.4-3.4-2-4.7 1.6-1.3 2.2-2.7 2-4.7 2-.2 3.4-.8 4.7-2.5Z" />,
  <path key="1" d="M9 11a3 3 0 0 1 3-3h1a3 3 0 0 1 0 6M15 13a3 3 0 0 1-3 3h-1a3 3 0 0 1 0-6" />,
  <><circle key="2a" cx="7" cy="7" r="2" /><circle key="2b" cx="14" cy="7" r="2" /><circle key="2c" cx="7" cy="14" r="2" /><circle key="2d" cx="17" cy="17" r="2" /><path key="2e" d="M19 19l2 2" /></>,
  <><path key="3a" d="M5 18V9a7 7 0 0 1 14 0v9M5 18h14" /><circle key="3b" cx="9" cy="13" r="1" /></>,
  <path key="4" d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3Z" />,
  <path key="5" d="M6 12c0-4 3-7 7-7s5 2 5 4-2 3-4 3-3 1-3 3 2 4 5 4" />,
];

function IconTabs() {
  const [active, setActive] = React.useState(0);
  return (
    <div className="tabs">
      {TAB_ICONS.map((ic, i) => (
        <button key={i} type="button" className={`tab${active === i ? " active" : ""}`} onClick={() => setActive(i)}>
          <svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6} fill="none">{ic}</svg>
        </button>
      ))}
    </div>
  );
}

function TraceRow({ label, w, ms, indent, indent2 }: { label: string; w: string; ms: string; indent?: boolean; indent2?: boolean }) {
  return (
    <div className="trow">
      <span className={`tl${indent ? " indent" : ""}${indent2 ? " indent2" : ""}`}>
        <svg viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h10" /></svg>{label}
      </span>
      <span className="bar-wrap"><div className="bar" style={{ width: w }} /><div className="ms">{ms}</div></span>
    </div>
  );
}

function SmallCell({ title, body, icon }: { title: string; body: string; icon: React.ReactNode }) {
  return (
    <div className="bcell small">
      <svg className="ic" viewBox="0 0 24 24" strokeWidth={1.6} fill="none" stroke="currentColor">{icon}</svg>
      <h4>{title}</h4>
      <p>{body}</p>
    </div>
  );
}

function PlRow({ color, name, who, hx, amt, status, icon }: { color: string; name: string; who: string; hx: string; amt: string; status: "settled" | "pending"; icon: React.ReactNode }) {
  return (
    <div className="pl-row">
      <span className="pl-ic" style={{ ["--c" as string]: color }}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>{icon}</svg></span>
      <span className="pl-meat">
        <span className="pl-nm">{name}</span>
        <span className="pl-sub">{who} <span className="dotsep">·</span> <span className="hx">{hx}</span></span>
      </span>
      <span className="pl-right">
        <span className="pl-amt">{amt}<em>USDC</em></span>
        {status === "settled" ? (
          <span className="pl-badge green"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}><path d="M5 12l5 5L20 7" /></svg>settled</span>
        ) : (
          <span className="pl-badge amber"><span className="bd" />pending</span>
        )}
      </span>
    </div>
  );
}

function Template({ tone, title, meta, chips }: { tone: string; title: string; meta: string; chips: { ic: React.ReactNode; t: string }[] }) {
  return (
    <Link href="/dashboard" className="tpl">
      <div className="thumb" style={{ background: `linear-gradient(150deg, ${tone}, #06100c)` }}>
        <div className="chiprow">
          {chips.map((c, i) => (
            <span key={i} className="flowchip"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>{c.ic}</svg>{c.t}</span>
          ))}
        </div>
      </div>
      <div className="tbody"><h4>{title}</h4><p className="meta">{meta}</p></div>
    </Link>
  );
}

const FAQS = [
  { q: "What is Charter?", a: "Charter is a mission-control framework for autonomous AI agents. You define a mission with a goal and a budget, Charter assembles an agent team, and the agents coordinate, act, and pay — with every permission scoped and signed on-chain." },
  { q: "What is a permission chain?", a: "A permission chain is the User → Manager → Payment delegation that lets agents act on your behalf. Each link carries a budget cap and is signed using ERC-7710, so authority is explicit, bounded, and revocable." },
  { q: "What is ERC-7710?", a: "ERC-7710 is the delegation standard Charter uses to grant scoped, revocable permissions between accounts. A manager agent can redelegate a smaller budget to a payment agent without ever holding your keys." },
  { q: "How do agents pay for things?", a: "Agents settle through the x402 payment protocol on Base. Every transfer is budget-bounded and recorded with a txHash, so you can audit exactly what was spent and where." },
  { q: "What models does Charter use?", a: "Charter runs on Venice models for planning, risk evaluation, and report generation, and is model-agnostic at the framework level — bring your own provider for any role in the chain." },
  { q: "Can I run a mission without spending real funds?", a: "Yes. Every mission can run in simulated mode — the full permission chain, A2A console, timeline, and report all work, with payments marked as simulated until you connect a wallet for a signed on-chain run." },
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
