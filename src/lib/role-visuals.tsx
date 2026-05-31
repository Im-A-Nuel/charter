import * as React from "react";

/** Inline glyph paths (stroke-drawn, 24×24) matching the reference icon set. */
const PATHS: Record<string, React.ReactNode> = {
  user: (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5 20c0-3.3 3-6 7-6s7 2.7 7 6" />
    </>
  ),
  star: (
    <path d="M12 3c1.3 1.7 2.7 2.3 4.7 2.5-.2 2 .4 3.4 2 4.7-1.6 1.3-2.2 2.7-2 4.7-2 .2-3.4.8-4.7 2.5-1.3-1.7-2.7-2.3-4.7-2.5.2-2-.4-3.4-2-4.7 1.6-1.3 2.2-2.7 2-4.7 2-.2 3.4-.8 4.7-2.5Z" />
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4-4" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3l8 3v6c0 4-3 7-8 9-5-2-8-5-8-9V6l8-3Z" />
      <path d="M9 12l2 2 4-4" />
    </>
  ),
  coin: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v8M9.5 10c0-1 1.1-1.6 2.5-1.6S14.5 9 14.5 10s-1 1.4-2.5 1.4-2.5.5-2.5 1.6 1.1 1.6 2.5 1.6 2.5-.6 2.5-1.6" />
    </>
  ),
  pen: (
    <>
      <path d="M3 17 14 6l4 4L7 21H3v-4Z" />
      <path d="M14 6l3-3 4 4-3 3" />
    </>
  ),
};

export function Glyph({ name }: { name: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round">
      {PATHS[name] ?? PATHS.search}
    </svg>
  );
}

export interface Viz {
  color: string;
  glyph: string;
}

/** Per-role colour + glyph. Keyed by role name; matched as a substring of labels
 *  like "Manager Agent" / "User Wallet". */
export const ROLE_VIZ: Record<string, Viz> = {
  User: { color: "#5b9dff", glyph: "user" },
  Manager: { color: "#00e599", glyph: "star" },
  Research: { color: "#a78bfa", glyph: "search" },
  Risk: { color: "#f472b6", glyph: "shield" },
  Payment: { color: "#ffb347", glyph: "coin" },
  Writer: { color: "#5b9dff", glyph: "pen" },
};

export function vizFor(label: string): Viz {
  const key = Object.keys(ROLE_VIZ).find((k) => label.includes(k));
  return key ? ROLE_VIZ[key] : { color: "#a78bfa", glyph: "search" };
}
