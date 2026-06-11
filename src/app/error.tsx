"use client";

import Link from "next/link";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="wrap" style={{ minHeight: "70vh", display: "grid", placeContent: "center", textAlign: "center", gap: 6 }}>
      <div className="kicker">Runtime error</div>
      <h1 style={{ fontSize: "clamp(34px, 5vw, 56px)", fontWeight: 800, letterSpacing: "-.03em", marginTop: 10 }}>
        Something broke on this mission
      </h1>
      <p style={{ color: "var(--ink-3)", marginTop: 12, fontSize: 17, maxWidth: 460, marginInline: "auto" }}>
        The permission chain is safe — nothing was signed. Try again, or head back home.
      </p>
      <div style={{ marginTop: 26, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
        <button className="btn btn-green" onClick={reset}>Try again</button>
        <Link className="btn btn-ghost" href="/">Back home</Link>
      </div>
    </main>
  );
}
