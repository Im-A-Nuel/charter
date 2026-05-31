import { createBundlerClient } from "viem/account-abstraction";
import { http, type Address, type Hex } from "viem";
import {
  contracts,
  ExecutionMode,
  type Delegation,
  type ExecutionStruct,
} from "@metamask/delegation-toolkit";
import type { SmartAccount } from "./smart-account";
import { publicClient, CHAIN } from "./chain";

/**
 * ERC-4337 account-abstraction layer for REAL on-chain redemption.
 *
 * The delegate (Payment) is a smart account, so a redemption must be sent as a
 * UserOperation through a bundler — not as a plain EOA transaction. Gas is
 * sponsored by a paymaster so no role needs native ETH.
 *
 * Entirely gated on `NEXT_PUBLIC_PIMLICO_API_KEY`: without it `bundlerEnabled`
 * is false and `redelegation.ts` keeps its simulated-settlement fallback, so the
 * app's behaviour is unchanged. Pimlico's unified endpoint serves both the
 * bundler and the paymaster RPC, and sponsors gas for free on testnets.
 */

const PIMLICO_KEY = process.env.NEXT_PUBLIC_PIMLICO_API_KEY ?? "";
const SPONSORSHIP_POLICY = process.env.NEXT_PUBLIC_PIMLICO_SPONSORSHIP_POLICY || undefined;

/** Pimlico unified bundler + paymaster endpoint for the active chain (84532). */
const PIMLICO_URL = PIMLICO_KEY
  ? `https://api.pimlico.io/v2/${CHAIN.id}/rpc?apikey=${PIMLICO_KEY}`
  : "";

/** When false, callers keep the simulated-redemption fallback (no behaviour change). */
export const bundlerEnabled = !!PIMLICO_KEY;

const paymasterContext = SPONSORSHIP_POLICY ? { sponsorshipPolicyId: SPONSORSHIP_POLICY } : undefined;

function makeBundler() {
  return createBundlerClient({
    client: publicClient,
    transport: http(PIMLICO_URL),
    paymaster: true, // Pimlico's endpoint also serves the paymaster RPC methods
    paymasterContext,
  });
}

type Bundler = ReturnType<typeof makeBundler>;
type Fees = { maxFeePerGas: bigint; maxPriorityFeePerGas: bigint };

/** Pimlico-recommended user-op gas price, falling back to the public estimate. */
async function userOpFees(): Promise<Fees> {
  try {
    const res = await fetch(PIMLICO_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jsonrpc: "2.0", id: 1, method: "pimlico_getUserOperationGasPrice", params: [] }),
    });
    const j = (await res.json()) as { result?: { standard?: { maxFeePerGas: Hex; maxPriorityFeePerGas: Hex } } };
    if (j.result?.standard) {
      return {
        maxFeePerGas: BigInt(j.result.standard.maxFeePerGas),
        maxPriorityFeePerGas: BigInt(j.result.standard.maxPriorityFeePerGas),
      };
    }
  } catch {
    /* fall through to public estimate */
  }
  const fees = await publicClient.estimateFeesPerGas();
  return { maxFeePerGas: fees.maxFeePerGas, maxPriorityFeePerGas: fees.maxPriorityFeePerGas };
}

/**
 * Deploy a counterfactual smart account (sponsored, deploy-only user op) if it
 * has no code yet. Needed for every delegator in the chain so the
 * DelegationManager can validate its ERC-1271 signature and execute on its behalf.
 */
async function ensureDeployed(bundler: Bundler, account: SmartAccount, fees: Fees) {
  const code = await publicClient.getCode({ address: account.address });
  if (code && code !== "0x") return;
  const hash = await bundler.sendUserOperation({ account, callData: "0x", ...fees });
  await bundler.waitForUserOperationReceipt({ hash });
}

export interface RedeemViaBundlerArgs {
  /** Final delegate — sends the redeem user operation. */
  paymentSA: SmartAccount;
  /** Root + intermediate delegators — must be deployed for ERC-1271 validation. */
  delegators: SmartAccount[];
  delegationManager: Address;
  /** Signed chain, ordered leaf → root. */
  delegations: Delegation[];
  /** e.g. USDC.transfer(payTo, amount), executed by the root delegator. */
  execution: ExecutionStruct;
}

/**
 * Redeem the delegation chain on-chain via a gas-sponsored UserOperation.
 * Returns the settled transaction hash. Throws on any failure so the caller can
 * fall back to simulated mode.
 */
export async function redeemViaBundler(args: RedeemViaBundlerArgs): Promise<Hex> {
  const bundler = makeBundler();
  const fees = await userOpFees();

  for (const delegator of args.delegators) await ensureDeployed(bundler, delegator, fees);

  const data = contracts.DelegationManager.encode.redeemDelegations({
    delegations: [args.delegations],
    modes: [ExecutionMode.SingleDefault],
    executions: [[args.execution]],
  });

  const hash = await bundler.sendUserOperation({
    account: args.paymentSA,
    calls: [{ to: args.delegationManager, data }],
    ...fees,
  });
  const receipt = await bundler.waitForUserOperationReceipt({ hash });
  return receipt.receipt.transactionHash;
}
