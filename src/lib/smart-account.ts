import {
  Implementation,
  toMetaMaskSmartAccount,
  type MetaMaskSmartAccount,
} from "@metamask/delegation-toolkit";
import type { Address, Hex } from "viem";
import { publicClient, getWalletClient } from "./chain";

export type SmartAccount = MetaMaskSmartAccount;

/**
 * Create a MetaMask Smart Account (ERC-7710 DeleGator) owned by `owner`.
 * Charter creates several: the user's account and one per agent that holds
 * authority (manager, payment agent). A different `deploySalt` yields a
 * different counterfactual address, all signable by the same connected EOA.
 */
export async function createSmartAccount(owner: Address, deploySalt: Hex = "0x"): Promise<SmartAccount> {
  return toMetaMaskSmartAccount({
    client: publicClient,
    implementation: Implementation.Hybrid,
    deployParams: [owner, [], [], []],
    deploySalt,
    signer: { walletClient: getWalletClient(owner) },
  });
}

/** Deterministic salts so each role maps to a stable address per owner. */
export const SALT = {
  user: "0x0000000000000000000000000000000000000000000000000000000000000000",
  manager: "0x0000000000000000000000000000000000000000000000000000000000000001",
  payment: "0x0000000000000000000000000000000000000000000000000000000000000002",
} as const;

export async function isDeployed(address: Address): Promise<boolean> {
  const code = await publicClient.getCode({ address });
  return !!code && code !== "0x";
}
