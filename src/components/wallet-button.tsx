"use client";

import { useWallet } from "@/lib/wallet";
import { shortAddr } from "@/lib/utils";
import { CHAIN } from "@/lib/chain";

export function WalletButton() {
  const { account, connecting, hasWallet, correctChain, connect, switchChain, disconnect } = useWallet();

  if (!account) {
    return (
      <button className="wallet" onClick={connect} disabled={connecting}>
        <span className="wd" />
        {connecting ? "Connecting…" : hasWallet ? "Connect wallet" : "Install MetaMask"}
      </button>
    );
  }
  if (!correctChain) {
    return (
      <button className="wallet warn" onClick={switchChain}>
        <span className="wd" />Switch to {CHAIN.name}
      </button>
    );
  }
  return (
    <button className="wallet connected" onClick={disconnect} title="Click to disconnect">
      <span className="wd" />{shortAddr(account)} · Base
    </button>
  );
}
