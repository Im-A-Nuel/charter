"use client";

import * as React from "react";
import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

const ICONS: Record<string, React.ReactNode> = {
  cart: <><circle cx="9" cy="20" r="1.4" /><circle cx="18" cy="20" r="1.4" /><path d="M2 3h3l2.2 12.4a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3L21 7H6" /></>,
  search: <><circle cx="11" cy="11" r="6" /><path d="M20 20l-4-4" /></>,
  chart: <path d="M4 19V5M4 19h16M8 16v-5M12 16V8M16 16v-7" />,
  coin: <><circle cx="12" cy="12" r="8" /><path d="M12 8v8M9.5 10c0-1 1.1-1.6 2.5-1.6S14.5 9 14.5 10s-1 1.4-2.5 1.4-2.5.5-2.5 1.6 1.1 1.6 2.5 1.6 2.5-.6 2.5-1.6" /></>,
  doc: <><path d="M6 3h9l4 4v14H6V3Z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  shield: <><path d="M12 3l8 3v6c0 4-3 7-8 9-5-2-8-5-8-9V6l8-3Z" /><path d="M9 12l2 2 4-4" /></>,
  bolt: <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7Z" />,
  star: <path d="M12 3c1.3 1.7 2.7 2.3 4.7 2.5-.2 2 .4 3.4 2 4.7-1.6 1.3-2.2 2.7-2 4.7-2 .2-3.4.8-4.7 2.5-1.3-1.7-2.7-2.3-4.7-2.5.2-2-.4-3.4-2-4.7 1.6-1.3 2.2-2.7 2-4.7 2-.2 3.4-.8 4.7-2.5Z" />,
};

const CATC: Record<string, string> = { commerce: "#ffb347", research: "#a78bfa", finance: "#5b9dff", ops: "#f472b6" };
const RC: Record<string, string> = { manager: "#00e599", worker: "#5b9dff", payer: "#ffb347", researcher: "#a78bfa", analyst: "#f472b6" };

interface Tpl { id: string; cat: string; ic: string; name: string; desc: string; budget: string; steps: number; roles: string[]; flow: string[]; }

const TEMPLATES: Tpl[] = [
  { id: "procurement", cat: "commerce", ic: "cart", name: "Procurement Agent", desc: "Source vendors, shortlist by price and lead time, and pay a refundable deposit to the top pick.", budget: "25 USDC", steps: 6, roles: ["manager", "worker", "payer"], flow: ["Source 3 vendors", "Shortlist + score", "Pay deposit"] },
  { id: "market-scan", cat: "research", ic: "search", name: "Market Scan", desc: "Survey a market segment, gather competitor data, and return a ranked briefing with sources.", budget: "12 USDC", steps: 5, roles: ["manager", "researcher", "analyst"], flow: ["Crawl sources", "Extract + rank", "Write briefing"] },
  { id: "budget-analyst", cat: "finance", ic: "chart", name: "Budget Analyst", desc: "Forecast and reconcile a mission's spend with Venice, flagging anything over its cap.", budget: "8 USDC", steps: 5, roles: ["manager", "analyst"], flow: ["Pull ledger", "Forecast spend", "Flag overage"] },
  { id: "ledger-query", cat: "finance", ic: "coin", name: "Ledger Query", desc: "Ask questions about your on-chain settlements in plain language and get cited txHashes.", budget: "4 USDC", steps: 4, roles: ["worker", "analyst"], flow: ["Parse question", "Query on-chain", "Cite txHash"] },
  { id: "report-writer", cat: "ops", ic: "doc", name: "Report Writer", desc: "Turn a completed mission's timeline and A2A log into a shareable executive summary.", budget: "6 USDC", steps: 4, roles: ["manager", "analyst"], flow: ["Read timeline", "Summarize", "Publish report"] },
  { id: "outreach", cat: "commerce", ic: "mail", name: "Outreach Sequencer", desc: "Draft, schedule, and pay for a multi-touch outreach run within a fixed campaign budget.", budget: "20 USDC", steps: 6, roles: ["manager", "worker", "payer"], flow: ["Draft sequence", "Schedule sends", "Settle spend"] },
  { id: "compliance", cat: "ops", ic: "shield", name: "Compliance Sweep", desc: "Run rule-based and model-graded checks across a mission before any funds are released.", budget: "5 USDC", steps: 5, roles: ["manager", "analyst"], flow: ["Load policy", "Grade actions", "Gate payout"] },
  { id: "data-pull", cat: "research", ic: "bolt", name: "Data Pull · x402", desc: "Buy a metered dataset through x402, normalize it, and hand it to downstream agents.", budget: "10 USDC", steps: 5, roles: ["worker", "payer"], flow: ["Negotiate x402", "Pay per call", "Normalize data"] },
];

const FILTERS = [
  { cat: "all", label: "All missions", c: "var(--green)" },
  { cat: "commerce", label: "Commerce", c: "var(--amber)" },
  { cat: "research", label: "Research", c: "var(--violet)" },
  { cat: "finance", label: "Finance", c: "var(--blue)" },
  { cat: "ops", label: "Ops", c: "var(--pink)" },
];

function shade(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16), g = parseInt(hex.slice(3, 5), 16), b = parseInt(hex.slice(5, 7), 16);
  const m = (x: number) => Math.round(x * 0.13 + 8);
  return `rgb(${m(r)},${m(g)},${m(b)})`;
}

function roleGlyph(r: string) {
  return r === "manager" ? "star" : r === "payer" ? "coin" : r === "researcher" ? "search" : r === "analyst" ? "chart" : "bolt";
}

export default function Templates() {
  const [cat, setCat] = React.useState("all");
  const list = TEMPLATES.filter((t) => cat === "all" || t.cat === cat);

  return (
    <>
      <SiteNav />
      <header className="page-head">
        <div className="wrap">
          <div className="ph-kicker">Templates</div>
          <h1>Start from a proven mission</h1>
          <p className="lede">Every template ships a goal, a budget cap, a role set, and a signed ERC-7710 permission chain. Pick one, tweak it in Mission Control, and run.</p>
        </div>
      </header>

      <main className="wrap" style={{ paddingBottom: 40 }}>
        <div className="tpl-toolbar">
          <div className="filterpills">
            {FILTERS.map((f) => (
              <button key={f.cat} type="button" className={`fpill${cat === f.cat ? " on" : ""}`} onClick={() => setCat(f.cat)}>
                <span className="c" style={{ ["--fc" as string]: f.c }} />{f.label}
              </button>
            ))}
          </div>
          <span className="count">{list.length} template{list.length === 1 ? "" : "s"}</span>
        </div>

        <div className="tgrid">
          {list.map((t) => {
            const c = CATC[t.cat];
            return (
              <Link key={t.id} className="tcard" href={`/dashboard?template=${t.id}`}>
                <div className="tc-thumb" style={{ background: `linear-gradient(150deg, ${shade(c)}, #06080c)` }}>
                  <div className="tc-ico" style={{ ["--tc" as string]: c }}>
                    <svg viewBox="0 0 24 24" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" fill="none">{ICONS[t.ic]}</svg>
                  </div>
                  <span className="tc-cat" style={{ ["--tc" as string]: c }}>{t.cat}</span>
                  <div className="tc-flow">
                    {t.flow.map((f, i) => (
                      <React.Fragment key={i}>
                        <span className="flowstep">
                          <svg viewBox="0 0 24 24" strokeWidth={1.8} fill="none">{i === 0 ? ICONS.search : i === t.flow.length - 1 ? ICONS.coin : ICONS.bolt}</svg>{f}
                        </span>
                        {i < t.flow.length - 1 && <svg className="flowarrow" viewBox="0 0 24 24" strokeWidth={2} fill="none"><path d="M12 5v14M6 13l6 6 6-6" /></svg>}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
                <div className="tc-body">
                  <h3>{t.name}</h3>
                  <p>{t.desc}</p>
                  <div className="tc-meta">
                    <span className="m"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="8" /><path d="M12 8v8M9.5 10c0-1 1.1-1.6 2.5-1.6" /></svg>{t.budget}</span>
                    <span className="m"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h10" /></svg>{t.steps} steps</span>
                  </div>
                </div>
                <div className="tc-foot">
                  <div className="tc-roles">
                    {t.roles.slice(0, 4).map((r, i) => (
                      <span key={i} className="roledot" style={{ ["--rdc" as string]: RC[r] }} title={r}>
                        <svg viewBox="0 0 24 24" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" fill="none">{ICONS[roleGlyph(r)]}</svg>
                      </span>
                    ))}
                  </div>
                  <span className="tc-use">Use template<svg viewBox="0 0 24 24" strokeWidth={2} fill="none"><path d="M5 12h14M13 6l6 6-6 6" /></svg></span>
                </div>
              </Link>
            );
          })}

          <Link className="tcard blank" href="/dashboard">
            <div className="bk">
              <div className="plus"><svg viewBox="0 0 24 24" strokeWidth={2} fill="none" stroke="currentColor" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg></div>
              <h3>Blank mission</h3>
              <p>Start from scratch in Mission Control and define every role yourself.</p>
            </div>
          </Link>
        </div>
      </main>

      <div className="bigcta">
        <div className="wrap">
          <h2>Ship missions you trust</h2>
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
