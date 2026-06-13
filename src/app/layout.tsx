import type { Metadata } from "next";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SITE_URL } from "@/lib/site";

const sans = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans-f",
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-f",
  weight: ["400", "500", "700"],
  display: "swap",
});

const DESCRIPTION =
  "Charter is the mission-control framework for AI agents that delegate permission and pay on-chain — every action scoped, signed, and auditable via redelegated ERC-7710 permissions.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
    <html lang="en" className={`${sans.variable} ${mono.variable}`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
