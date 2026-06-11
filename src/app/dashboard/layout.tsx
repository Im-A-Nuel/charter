import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mission Control",
  description: "Coordinate an agent team through redelegated authority — sign the permission chain, watch the A2A console, and read the final report.",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
