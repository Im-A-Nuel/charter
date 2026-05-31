import {
  createDelegation,
  createExecution,
  redeemDelegations,
  ExecutionMode,
  type Delegation,
} from "@metamask/delegation-toolkit";
import { encodeFunctionData, erc20Abi, type Address, type Hex } from "viem";
import type { SmartAccount } from "./smart-account";
import { publicClient, getWalletClient, USDC_ADDRESS } from "./chain";
import { bundlerEnabled, redeemViaBundler } from "./aa";
import { toUnits } from "./utils";

export interface SignedDelegation {
  delegation: Delegation;
  signature: Hex;
  delegationManager: Address;
  chainId: number;
}

/**
 * ROOT delegation: User Smart Account -> Manager.
 * Scoped to the full mission budget via an erc20TransferAmount caveat.
 * Signed for real by the user's smart account (MetaMask EIP-712).
 */
export async function createRootDelegation(
  userSA: SmartAccount,
  managerAddress: Address,
  budgetUSDC: number
): Promise<SignedDelegation> {
  const delegation = createDelegation({
    environment: userSA.environment,
    from: userSA.address,
    to: managerAddress,
    scope: { type: "erc20TransferAmount", tokenAddress: USDC_ADDRESS, maxAmount: toUnits(budgetUSDC) },
  });
  const signature = await userSA.signDelegation({ delegation });
  return {
    delegation: { ...delegation, signature },
    signature,
    delegationManager: userSA.environment.DelegationManager,
    chainId: publicClient.chain!.id,
  };
}

/**
 * REDELEGATION: Manager Smart Account -> Payment Agent.
 * Carries the signed root as `parentDelegation`; all parent caveats stay
 * enforced. Scoped to a SMALLER budget. This is the A2A redelegation that the
 * track requires. Signed for real by the manager's smart account.
 */
export async function createRedelegation(
  managerSA: SmartAccount,
  paymentAddress: Address,
  budgetUSDC: number,
  parent: SignedDelegation
): Promise<SignedDelegation> {
  const delegation = createDelegation({
    environment: managerSA.environment,
    from: managerSA.address,
    to: paymentAddress,
    scope: { type: "erc20TransferAmount", tokenAddress: USDC_ADDRESS, maxAmount: toUnits(budgetUSDC) },
    parentDelegation: parent.delegation,
  });
  const signature = await managerSA.signDelegation({ delegation });
  return {
    delegation: { ...delegation, signature },
    signature,
    delegationManager: managerSA.environment.DelegationManager,
    chainId: publicClient.chain!.id,
  };
}

export interface ExecutionResult {
  mode: "real" | "simulated";
  transactionHash: string;
  note?: string;
}

/** The smart accounts the Payment Agent needs to redeem the chain on-chain. */
export interface RedeemAccounts {
  /** Final delegate — sends the redeem user op / EOA tx. */
  paymentSA: SmartAccount;
  /** Root delegator — must be deployed and hold the USDC being spent. */
  userSA: SmartAccount;
  /** Intermediate delegator — must be deployed for ERC-1271 validation. */
  managerSA: SmartAccount;
  /** Connected EOA, used by the legacy direct-redeem fallback. */
  delegateEOA: Address;
}

/**
 * Payment Agent redeems the FULL chain (redelegation -> root) to pay USDC.
 * permissionContext is ordered leaf -> root.
 *
 * Preferred path: a gas-sponsored ERC-4337 UserOperation from the Payment smart
 * account (needs `NEXT_PUBLIC_PIMLICO_API_KEY`). Without a bundler configured it
 * tries a direct EOA redeem and otherwise degrades to a simulated tx hash — in
 * every case the two delegations and their signatures are real.
 */
export async function executeRedelegatedPayment(
  redelegation: SignedDelegation,
  root: SignedDelegation,
  accounts: RedeemAccounts,
  payTo: Address,
  amountUSDC: number
): Promise<ExecutionResult> {
  const callData = encodeFunctionData({
    abi: erc20Abi,
    functionName: "transfer",
    args: [payTo, toUnits(amountUSDC)],
  });
  const execution = createExecution({ target: USDC_ADDRESS, value: 0n, callData });

  // Preferred: real on-chain redemption via bundler + sponsored gas.
  if (bundlerEnabled) {
    try {
      const txHash = await redeemViaBundler({
        paymentSA: accounts.paymentSA,
        delegators: [accounts.userSA, accounts.managerSA],
        delegationManager: redelegation.delegationManager,
        delegations: [redelegation.delegation, root.delegation],
        execution,
      });
      return { mode: "real", transactionHash: txHash };
    } catch (e) {
      return {
        mode: "simulated",
        transactionHash: simulatedHash(redelegation.signature, amountUSDC, payTo),
        note: `Sponsored redemption failed (${truncate((e as Error).message)}). Most often the root account needs USDC — fund ${accounts.userSA.address} on Base Sepolia. Both delegations + signatures are real.`,
      };
    }
  }

  // Fallback: direct EOA redeem (no bundler configured) — usually degrades to simulated.
  try {
    const walletClient = getWalletClient(accounts.delegateEOA);
    const txHash = await redeemDelegations(
      walletClient,
      publicClient,
      redelegation.delegationManager,
      [
        {
          permissionContext: [redelegation.delegation, root.delegation],
          executions: [execution],
          mode: ExecutionMode.SingleDefault,
        },
      ]
    );
    return { mode: "real", transactionHash: txHash };
  } catch (e) {
    return {
      mode: "simulated",
      transactionHash: simulatedHash(redelegation.signature, amountUSDC, payTo),
      note: `On-chain redemption unavailable (${truncate((e as Error).message)}). Set NEXT_PUBLIC_PIMLICO_API_KEY for sponsored on-chain redemption. Both delegations + signatures are real.`,
    };
  }
}

function simulatedHash(sig: Hex, amount: number, payTo: string): Hex {
  const seed = `${sig}${amount}${payTo}`;
  let h = 0n;
  for (let i = 0; i < seed.length; i++) h = (h * 131n + BigInt(seed.charCodeAt(i))) % (1n << 256n);
  return ("0x" + h.toString(16).padStart(64, "0")) as Hex;
}

function truncate(s: string, n = 80) {
  return s.length > n ? s.slice(0, n) + "…" : s;
}
