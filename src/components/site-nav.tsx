"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletButton } from "./wallet-button";

export function BrandMark() {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden>
      <path d="M16 2.5c2.6 3.4 5.4 4.6 9.4 5-0.4 4 0.8 6.8 4.1 9.4-3.3 2.6-4.5 5.4-4.1 9.4-4 0.4-6.8 1.6-9.4 5-2.6-3.4-5.4-4.6-9.4-5 .4-4-0.8-6.8-4.1-9.4 3.3-2.6 4.5-5.4 4.1-9.4 4-.4 6.8-1.6 9.4-5Z" fill="#00e599" />
      <circle cx="16" cy="16.9" r="3.4" fill="#04130d" />
    </svg>
  );
}

const LINKS = [
  { href: "/", label: "Product", dot: true },
  { href: "/templates", label: "Templates" },
  { href: "/dashboard", label: "Mission Control" },
  { href: "/pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
];

export function SiteNav() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = React.useState(false);
  const is = (p: string) => (p === "/" ? pathname === "/" : pathname.startsWith(p));

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link className="brand" href="/" onClick={() => setOpen(false)}>
          <BrandMark />
          charter
        </Link>
        <div className="nav-links">
          {LINKS.map((l) => (
            <Link key={l.href} className={is(l.href) ? "active" : ""} href={l.href} aria-current={is(l.href) ? "page" : undefined}>
              {l.dot && <span className="dot" />}{l.label}
            </Link>
          ))}
        </div>
        <div className="nav-right">
          <a className="gh" href="https://github.com/Im-A-Nuel/charter" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.4 6.8 9.7.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .8.1-.7.3-1.1.6-1.4-2.2-.3-4.6-1.2-4.6-5.1 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.8-4.6 5.1.3.3.7 1 .7 2v2.9c0 .3.2.6.7.5A10.3 10.3 0 0 0 22 12.3C22 6.6 17.5 2 12 2Z" /></svg>
          </a>
          <WalletButton />
          <button className="nav-toggle" onClick={() => setOpen((o) => !o)} aria-label="Toggle menu" aria-expanded={open}>
            {open ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 6l12 12M18 6 6 18" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
            )}
          </button>
        </div>
      </div>

      <div className={`nav-mobile${open ? " open" : ""}`}>
        {LINKS.map((l) => (
          <Link key={l.href} className={is(l.href) ? "active" : ""} href={l.href} onClick={() => setOpen(false)} aria-current={is(l.href) ? "page" : undefined}>
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
