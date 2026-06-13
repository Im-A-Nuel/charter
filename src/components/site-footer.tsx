"use client";

import Link from "next/link";
import { BrandMark } from "./site-nav";

export function SiteFooter() {
  return (
    <footer>
      <div className="wrap" style={{ padding: 0 }}>
        <div className="footer-shell">
          <div className="footer-glow" />
          <div className="footer-inner">
            <div className="f-top">
              <Link className="brand" href="/"><BrandMark />charter</Link>
              <p className="f-tagline">Missions with accountable agents — scoped, signed, on-chain.</p>
            </div>
            <div className="f-cols">
              <div className="f-col"><h5>Framework</h5><Link href="/docs#missions">Missions</Link><Link href="/docs#permission-chain">Permission Chain</Link><Link href="/docs#agent-team">Agent Team</Link><Link href="/docs#payments">Payments</Link></div>
              <div className="f-col"><h5>Product</h5><Link href="/dashboard">Mission Control</Link><Link href="/dashboard">A2A Console</Link><Link href="/dashboard">Timeline</Link><Link href="/dashboard">Reports</Link></div>
              <div className="f-col"><h5>Developers</h5><Link href="/docs">Docs</Link><Link href="/docs#quickstart">SDK</Link><Link href="/templates">Templates</Link><Link href="/pricing">Pricing</Link></div>
              <div className="f-col"><h5>Standards</h5><a href="https://eips.ethereum.org/EIPS/eip-7710" target="_blank" rel="noreferrer">ERC-7710</a><a href="https://x402.org" target="_blank" rel="noreferrer">x402</a><a href="https://base.org" target="_blank" rel="noreferrer">Base</a><a href="https://venice.ai" target="_blank" rel="noreferrer">Venice</a></div>
              <div className="f-col"><h5>Company</h5><Link href="/">About</Link><Link href="/pricing">Pricing</Link><Link href="/">Careers</Link><Link href="/">Contact</Link></div>
              <div className="f-col"><h5>Connect</h5><a href="https://github.com/Im-A-Nuel/charter" target="_blank" rel="noreferrer">GitHub</a><a href="#">Discord</a><a href="#">X (Twitter)</a><a href="#">YouTube</a></div>
            </div>
            <div className="f-bottom">
              <div className="f-status">
                <div className="st sec"><span className="pd" />SECURITY</div>
                <div className="st ok"><span className="pd" />ALL SYSTEMS OPERATIONAL</div>
              </div>
              <div className="f-legal"><a href="#">Privacy</a><a href="#">Terms</a><a href="#">llms.txt</a></div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
