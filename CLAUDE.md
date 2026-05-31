@AGENTS.md

# Charter

Redelegated authority for coordinated agent teams. A **Manager Agent** receives authority from the
user and **redelegates** smaller, scoped **ERC-7710** permissions to specialist agents, so every agent
acts under a charter and only holds the authority its role needs. Hackathon target: **Best A2A
Coordination** (also Best Agent, Best use of Venice AI, x402 + ERC-7710).

Full product spec: `../Charter_Project_Document.md`. Verified Delegation Toolkit API:
`../REFERENCE_delegation-toolkit.md`.

## Commands

```bash
npm run dev            # dev server
npm run dev -- -p 3001 # use another port (if Covenant holds 3000)
npm run build          # production build (also runs full typecheck)
npm start              # serve the production build
npm run lint           # eslint (flat config: eslint.config.mjs)
npx tsc --noEmit       # typecheck only
```

There is **no test runner** configured — the project is lint + typecheck only.

## Architecture

Single fullstack Next.js 16 app (App Router, `src/` dir). No separate backend or custom Solidity — the
backend is Next.js API routes; on-chain contracts (DelegationManager, DeleGator smart account) are
MetaMask's audited, pre-deployed ones on Base Sepolia.

**The chain of authority is the whole point:** `User Wallet → Manager Agent → Payment Agent`, where the
second edge is a **redelegation** (`createDelegation` with `parentDelegation`) scoped to a SMALLER
budget. Parent caveats stay enforced.

**One mission run (the orchestrator):**
1. Manager (Venice) decomposes the goal into role assignments.
2. Root delegation User→Manager is signed (real MetaMask EIP-712).
3. Research Agent calls an x402 service and surfaces paid data.
4. Risk Agent (Venice) approves/rejects.
5. Manager→Payment redelegation is signed (smaller budget).
6. Payment Agent redeems the `[redelegation, root]` chain to pay (leaf→root order is mandatory — see Gotchas).
7. Writer Agent (Venice) produces the report.

**Two branches off this happy path** (don't assume payment always runs): if Research finds no paid
data, the runner calls `finishNoPayment()` and jumps straight to the Writer (no redelegation/payment);
if Risk rejects, the run ends in the terminal `rejected` phase. The phase machine is
`idle → planning → delegating → research → risk → redelegating → paying → writing → done` (or `rejected`).

### Layout
- `src/app/page.tsx` — landing. `src/app/dashboard/page.tsx` — Mission Control (selects a mission, renders `MissionView` which calls `useMissionRunner`).
- `src/app/api/venice/route.ts`, `src/app/api/x402/sentiment/route.ts` — same backend as Covenant (Venice proxy + x402 paid service).
- `src/lib/`:
  - `redelegation.ts` — **the core A2A piece**: `createRootDelegation`, `createRedelegation` (uses `parentDelegation`), `executeRedelegatedPayment` (redeems the chain; real-via-bundler → EOA → simulated fallback).
  - `aa.ts` — ERC-4337 layer: `redeemViaBundler` sends the redemption as a gas-sponsored UserOperation from the Payment smart account (Pimlico bundler+paymaster). Gated on `NEXT_PUBLIC_PIMLICO_API_KEY`; deploys delegator accounts on first use.
  - `orchestrator.tsx` — `useMissionRunner(mission, charters)`: the multi-agent runner that drives the whole flow and writes to the store (messages, timeline, links, report).
  - `smart-account.ts` — `createSmartAccount(owner, deploySalt)`; `SALT` map gives each role a stable address (user/manager/payment) from the same EOA.
  - `venice.ts` — `managerPlan`, `riskEvaluate`, `writerReport`.
  - `x402.ts`, `chain.ts`, `wallet.tsx`, `store.tsx`, `types.ts`, `utils.ts` (mirror Covenant; `store` holds missions/charters/links/messages/timeline/reports).
- `src/components/charter/` — `mission-builder`, `permission-chain` (the star visual), `agent-team`, `timeline`, `a2a-console`, `final-report`.
- `src/components/ui/` — shared primitives.

## Conventions
- Tailwind v4 `@theme` palette in `globals.css`; Charter's accent is violet→magenta (`brand`/`brand-2`). Use the tokens, not raw hex.
- `"use client"` for stateful components; secrets stay in API routes.
- Data model lives in `types.ts`: `Mission`, `AgentCharter`, `PermissionLink` (a chain edge), `AgentMessage`, `TimelineStep`, `FinalReport`, `ROLE_LIBRARY`. UI reads everything from `useStore`; during a run the orchestrator is the only writer (`MissionBuilder` creates the mission beforehand).
- **Persistence split:** store state persists to `localStorage` (`charter_state_v1`), but **signed delegations are kept in-memory only** (`signedRef` in `store.tsx`) — they do not survive a page refresh.

## Real vs simulated (important)
With a wallet on Base Sepolia, **both** the root delegation and the redelegation are signed for real
(two MetaMask signatures). **Redemption** then has three tiers (`executeRedelegatedPayment`):
1. **Real on-chain** — with `NEXT_PUBLIC_PIMLICO_API_KEY`, `aa.ts` sends a gas-sponsored UserOp from the
   Payment smart account. Requires the **User (root) smart account to hold the USDC** being spent
   (delegator accounts are auto-deployed on first use; gas is sponsored, so no ETH needed).
2. **Direct EOA redeem** — no bundler key; almost always fails to tier 3.
3. **Simulated tx hash** — fallback; the two signatures + the delegation chain are still real.

Without a wallet, the whole chain is built in simulated mode. Badges everywhere show `ERC-7710 signed`
vs `simulated` — keep that honesty; never label a simulated hash as on-chain.

## Gotchas
- **Next.js 16 / React 19 / Tailwind v4.** See AGENTS.md; read `node_modules/next/dist/docs/` for current behavior. `params` is async.
- **tsconfig `target` must stay `ES2020`+** (BigInt literals).
- **`publicClient` is cast to `PublicClient`** in `chain.ts` (baseSepolia OP-stack formatter friction vs the toolkit's expected type). Runtime identical.
- **lucide-react is v1** — verify icon names are exported before importing (a wrong name, e.g. a non-existent `Rotateccw`, fails the build).
- Toolkit `@metamask/delegation-toolkit@0.13.0`: factory param is `signer: { walletClient }`; redelegation = pass signed `parentDelegation`; redeem `permissionContext` is ordered leaf→root. See `../REFERENCE_delegation-toolkit.md`.

## Env (`.env.local`, all optional)
- `VENICE_API_KEY`, `VENICE_MODEL` (default `llama-3.3-70b`), `VENICE_BASE_URL`
- `NEXT_PUBLIC_RPC_URL` (default `https://sepolia.base.org`)
- `NEXT_PUBLIC_PIMLICO_API_KEY` — enables real on-chain redemption (Pimlico bundler+paymaster, Base
  Sepolia free tier). `NEXT_PUBLIC_PIMLICO_SPONSORSHIP_POLICY` (optional `sp_…`). Client-exposed by design.
- `X402_PAY_TO` (demo seller address)
