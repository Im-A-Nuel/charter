import Link from "next/link";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main className="wrap" style={{ padding: "110px 0 90px", textAlign: "center" }}>
        <div className="kicker">Error 404</div>
        <h1 style={{ fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 800, letterSpacing: "-.035em", marginTop: 12 }}>
          Mission not found
        </h1>
        <p style={{ color: "var(--ink-3)", marginTop: 14, fontSize: 18, maxWidth: 460, marginInline: "auto" }}>
          That route drifted off the permission chain. Pick a signed path below.
        </p>
        <div style={{ marginTop: 30, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link className="btn btn-green" href="/">Back home</Link>
          <Link className="btn btn-ghost" href="/dashboard">Open Mission Control</Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
