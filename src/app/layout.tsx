import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";

const DESCRIPTION =
  "Charter is the mission-control framework for AI agents that delegate permission and pay on-chain — every action scoped, signed, and auditable via redelegated ERC-7710 permissions.";

export const metadata: Metadata = {
  metadataBase: new URL("https://charter.local"),
  title: {
    default: "Charter — Missions with accountable agents",
    template: "%s · Charter",
  },
  description: DESCRIPTION,
  applicationName: "Charter",
  keywords: ["ERC-7710", "redelegation", "A2A", "MetaMask Smart Accounts", "x402", "Base", "Venice AI", "AI agents"],
  openGraph: {
    title: "Charter — Missions with accountable agents",
    description: DESCRIPTION,
    siteName: "Charter",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Charter — Missions with accountable agents",
    description: DESCRIPTION,
  },
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
