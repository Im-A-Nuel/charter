"use client";

import { useWallet } from "@/lib/wallet";
import { shortAddr } from "@/lib/utils";
import { CHAIN } from "@/lib/chain";

export function WalletButton() {
  const { account, connecting, hasWallet, correctChain, connect, switchChain, disconnect, error } = useWallet();

  if (!account) {
    return (
      <button
        className={`wallet${error ? " warn" : ""}`}
        onClick={connect}
        disabled={connecting}
        title={error || undefined}
      >
        <span className="wd" />
        {connecting ? "Connecting…" : error ? "Retry connect" : hasWallet ? "Connect wallet" : "Install MetaMask"}
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
