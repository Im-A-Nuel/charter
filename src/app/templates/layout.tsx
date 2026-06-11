import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Templates",
  description: "Start from a proven mission — each ships a goal, a budget cap, a role set, and a signed ERC-7710 permission chain.",
};

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
