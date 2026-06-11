import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Pay for missions, not seats. Build and simulate free; pay a platform fee only on missions that settle on-chain.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
