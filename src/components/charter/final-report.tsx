"use client";

import { useStore } from "@/lib/store";
import { explorerTx } from "@/lib/chain";

export function FinalReport({ missionId }: { missionId: string }) {
  const { reports } = useStore();
  const report = reports.find((r) => r.missionId === missionId);
  const onChain = report?.execMode === "real";

  return (
    <section className="dpanel report">
      <div className="dp-h">
        <div className="t">
          <svg viewBox="0 0 24 24"><path d="M6 3h9l4 4v14H6V3Z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></svg>
          Final Report
        </div>
        <span className="sub">{!report ? "pending" : onChain ? "on-chain" : "simulated"}</span>
      </div>
      <div className="dp-b">
        {!report ? (
          <div className="locked">
            <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.7}><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
            <div className="t">Report locked</div>
            <div className="s">A Venice-written summary appears when the mission completes.</div>
          </div>
        ) : (
          <div className="rep-body">
            <div className={`rep-verdict${report.riskLevel === "Low" ? "" : " warn"}`}>
              <div className="rico">
                <svg viewBox="0 0 24 24" fill="none" strokeWidth={1.8}><path d="M9 12l2 2 4-4M5 7l7-4 7 4v6c0 4-3 7-7 8-4-1-7-4-7-8V7Z" /></svg>
              </div>
              <div>
                <div className="rt">Risk · {report.riskLevel}</div>
                <div className="rs">{report.paidDataUsed ? "All actions stayed inside the signed budget." : "No payment was required for this mission."}</div>
              </div>
            </div>

            <div className="rep-stats">
              <div className="rep-stat"><div className="k">Total spent</div><div className="v green">{report.totalSpent} USDC</div></div>
              <div className="rep-stat"><div className="k">Remaining</div><div className="v">{report.remaining} USDC</div></div>
              <div className="rep-stat"><div className="k">Approved by</div><div className="v" style={{ fontSize: 15 }}>{report.approvedBy}</div></div>
              <div className="rep-stat"><div className="k">Settlement</div><div className="v" style={{ fontSize: 15 }}>{onChain ? "Base" : "dry-run"}</div></div>
            </div>

            <div className="rep-summary">
              <span className="q">Venice summary · {report.veniceModel}</span>
              {report.body}
            </div>

            <div className="rep-foot">
              <span className={`badge ${onChain ? "green" : "amber"}`}>
                <span className="bd" />{onChain ? "On-chain · Base" : "Simulated run"}
              </span>
              {report.txHash && (
                <span className="tx">
                  txHash <a href={explorerTx(report.txHash)} target="_blank" rel="noreferrer">{report.txHash.slice(0, 12)}… ↗</a>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
