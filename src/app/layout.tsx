import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Charter — Missions with accountable agents",
  description:
    "Charter is the mission-control framework for AI agents that delegate permission and pay on-chain — every action scoped, signed, and auditable via redelegated ERC-7710 permissions.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
