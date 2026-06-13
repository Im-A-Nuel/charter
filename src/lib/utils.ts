export function shortAddr(addr?: string, size = 4) {
  if (!addr) return "";
  return `${addr.slice(0, 2 + size)}…${addr.slice(-size)}`;
}

/** 6-decimal USDC <-> bigint base units */
export const USDC_DECIMALS = 6;
export function toUnits(amount: number | string, decimals = USDC_DECIMALS): bigint {
  const [whole, frac = ""] = String(amount).split(".");
  const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
  return BigInt(whole || "0") * 10n ** BigInt(decimals) + BigInt(fracPadded || "0");
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
