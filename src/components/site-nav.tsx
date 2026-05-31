"use client";

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

export function SiteNav() {
  const pathname = usePathname();
  const onDash = pathname?.startsWith("/dashboard");

  return (
    <nav className="nav">
      <div className="nav-inner">
        <Link className="brand" href="/">
          <BrandMark />
          charter
        </Link>
        <div className="nav-links">
          <Link className={onDash ? "" : "active"} href="/">
            <span className="dot" />Product
          </Link>
          <Link href="/#build">Framework</Link>
          <Link className={onDash ? "active" : ""} href="/dashboard">Mission Control</Link>
          <Link href="/#observe">Observability</Link>
          <Link href="/#faq">Docs</Link>
        </div>
        <div className="nav-right">
          <a className="gh" href="https://github.com/Im-A-Nuel/charter" target="_blank" rel="noreferrer">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.4 6.8 9.7.5.1.7-.2.7-.5v-1.7c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .8.1-.7.3-1.1.6-1.4-2.2-.3-4.6-1.2-4.6-5.1 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.7 1a9.3 9.3 0 0 1 5 0c1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.8-4.6 5.1.3.3.7 1 .7 2v2.9c0 .3.2.6.7.5A10.3 10.3 0 0 0 22 12.3C22 6.6 17.5 2 12 2Z" /></svg>
          </a>
          <WalletButton />
        </div>
      </div>
    </nav>
  );
}
