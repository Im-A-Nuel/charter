# Charter — Redelegated Authority for Coordinated Agent Teams

> Define the authority of every agent.

Charter is a multi-agent coordination layer. A **Manager Agent** receives authority from the user and
then **redelegates** smaller, scoped **ERC-7710** permissions to specialist agents — so every agent
acts under a charter and only ever holds the authority its role requires. The chain of authority is
visible and auditable.

**Tracks:** Best A2A Coordination · Best Agent · Best use of Venice AI · x402 + ERC-7710

## The chain of authority

```
User Wallet ──delegation (5 USDC)──▶ Manager Agent ──redelegation (1 USDC)──▶ Payment Agent
                                          │
                 ┌────────────┬───────────┼───────────┬────────────┐
              Research       Risk      (coordination) Payment     Writer
              read-only   approve/reject              spend ≤ 1   report only
```

The Payment Agent never receives the user's full authority — only a smaller permission redelegated
by the Manager, with all parent caveats still enforced.

## The flow (one mission)

1. **Manager** (Venice AI) decomposes the mission goal into role assignments.
2. **User → Manager** root ERC-7710 delegation is signed (real MetaMask EIP-712 signature).
3. **Research** Agent calls an x402 service and surfaces a paid data source.
4. **Risk** Agent (Venice AI) approves or rejects the payment.
5. **Manager → Payment** redelegation is signed — scoped to a smaller budget.
6. **Payment** Agent redeems the *redelegation → root* chain to pay the x402 service.
7. **Writer** Agent (Venice AI) produces the final report.

Watch it live in the **Permission Chain**, **A2A Console**, **Execution Timeline**, and **Final Report**.

## Where each requirement is met

| Requirement | Implementation |
| --- | --- |
| Redelegation (A2A) | `src/lib/redelegation.ts` — `createRedelegation` with `parentDelegation` |
| MetaMask Smart Accounts Kit | `src/lib/smart-account.ts` — `toMetaMaskSmartAccount` (one per role) |
| ERC-7710 chain redemption | `src/lib/redelegation.ts` — `redeemDelegations([redelegation, root])` |
| x402 | `src/app/api/x402/sentiment/route.ts` + `src/lib/x402.ts` |
| Venice AI | `src/lib/venice.ts` — Manager planner, Risk evaluator, Writer report |
| Orchestration | `src/lib/orchestrator.tsx` — the multi-agent runner |

## Run

```bash
npm install
cp .env.example .env.local   # optional: add VENICE_API_KEY for real AI
npm run dev
```

Open http://localhost:3000 → **Launch the demo**. Connect MetaMask (Base Sepolia), create a mission,
then **Run mission**. With a wallet connected you'll sign the root delegation *and* the redelegation.

### Graceful degradation

The app always runs. Without a Venice key it uses a deterministic mock; without a wallet the chain is
built in *simulated* mode. Whenever a wallet is connected, the delegation + redelegation signatures are
real. Badges everywhere show `ERC-7710 signed` vs `simulated`.

## Stack

Next.js 16 · React 19 · Tailwind v4 · viem · `@metamask/delegation-toolkit` · Venice AI · Base Sepolia
