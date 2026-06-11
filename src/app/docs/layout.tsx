import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Docs",
  description: "Quickstart, missions, the permission chain, agent team, payments, and observability — build accountable agent missions with Charter.",
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
