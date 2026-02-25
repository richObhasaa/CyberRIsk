"use client";

import { WizardData } from "./RiskWizard";
import { useState, useRef } from "react";
import RiskHeatmap from "./RiskHeatmap";
import ComplianceCard from "./ComplianceCard";
import FindingsPanel from "./FindingsPanel";
import AuditOpinionCard from "./AuditOpinionCard";
import ExecutiveSummaryCard from "./ExecutiveSummaryCard";
import RiskLegend from "./RiskLegend";
import CsfInsightCard from "./CsfInsightCard";
import RiskTrendCard from "./RiskTrendCard";

/* ================================
   HELPERS
================================ */

function mapEmployeeRange(range?: string) {
  switch (range) {
    case "1-50":
      return 25;
    case "51-200":
      return 125;
    case "201-1000":
      return 500;
    case "1000+":
      return 1500;
    default:
      return 50;
  }
}

type CIA = "Low" | "Medium" | "High";

function getHighestCIA(assets: { ciaValue: CIA }[]) {
  if (!assets?.length) return "Medium";

  const priority: Record<CIA, number> = {
    Low: 1,
    Medium: 2,
    High: 3,
  };

  return assets.reduce<CIA>((highest, a) => {
    return priority[a.ciaValue] > priority[highest]
      ? a.ciaValue
      : highest;
  }, "Low");
}

/* ================================
   COMPONENT
================================ */

export default function StepReview({
  data,
  updateData,
}: {
  data: WizardData;
  updateData: (patch: Partial<WizardData>) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const resultsRef = useRef<HTMLDivElement | null>(null);

  /* ================================
     SUBMIT
  ================================= */

  const submit = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:4000/api/risk/assess",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            organizationSector: data.sector,
            employeeCount: mapEmployeeRange(data.employeeRange),
            systemType: data.systemType,

            // highest CIA snapshot
            ciaValue: getHighestCIA(data.assets),

            // full asset list
            assets: data.assets,

            // 🔥 IMPORTANT: raw vulnerabilities only
            vulnerabilities: data.vulnerabilities,

            // baseline risk (backend will refine)
            risks: {
              operational: {
                likelihood: 2,
                impact: 2,
                controlEffectiveness:
                  data.risks?.controlEffectiveness ?? 50,
              },
              financial: {
                likelihood: 2,
                impact: 2,
                controlEffectiveness:
                  data.risks?.controlEffectiveness ?? 50,
              },
              compliance: {
                likelihood: 2,
                impact: 2,
                controlEffectiveness:
                  data.risks?.controlEffectiveness ?? 50,
              },
              reputational: {
                likelihood: 2,
                impact: 2,
                controlEffectiveness:
                  data.risks?.controlEffectiveness ?? 50,
              },
              strategic: {
                likelihood: 2,
                impact: 2,
                controlEffectiveness:
                  data.risks?.controlEffectiveness ?? 50,
              },
            },
          }),
        }
      );

      const json = await res.json();
      setResult(json);

      //scroll to results
      setTimeout(() => {
  resultsRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}, 150);

      /* ================================
         INJECT CHECKLIST → WIZARD
      ================================= */

      if (json?.data?.auditChecklist) {
        updateData({
          auditChecklist: json.data.auditChecklist.map(
            (c: any, i: number) => ({
              id: String(i),
              control: c.controlText ?? c.title ?? "Audit Control",
              status: "Partial",
              evidence: "",
            })
          ),
        });
      }
    } catch (err) {
      console.error("Risk assessment failed:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ================================
     RENDER
  ================================= */

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Review & Calculate</h3>

      {!result && (
  <div className="text-sm text-slate-400 bg-slate-900/40 border border-slate-800 rounded-lg p-4">
    Run the assessment to generate risk analytics and audit insights.
  </div>
)}

{/* BUTTON */}
<div className="flex justify-end">
  <button
    onClick={submit}
    disabled={loading}
    className="px-4 py-2 bg-blue-600 text-white rounded"
  >
    {loading ? "Calculating..." : "Run Risk Assessment"}
  </button>
</div>

      {/* RESULTS WRAPPER */}
      <div ref={resultsRef} />

{/* EXECUTIVE SUMMARY */}
{result?.data?.summary && (
  <div className="mt-6">
          <ExecutiveSummaryCard
            riskLevel={result.data.summary.riskLevel}
            highestRisk={result.data.summary.highestRisk}
            exposureLevel={result.data.summary.exposureLevel}
            criticalityLevel={result.data.summary.criticalityLevel}
            riskReduction={result.data.summary.riskReduction}
          />
        </div>
      )}

      {/* FINAL AUDIT OPINION */}
      {result?.data?.summary?.auditOpinion && (
        <div className="mt-6">
          <AuditOpinionCard
            opinion={result.data.summary.auditOpinion}
          />
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={submit}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Calculating..." : "Run Risk Assessment"}
      </button>

      {/* HEATMAP */}
      {result?.data?.categories?.operational && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">
            Risk Matrix Heatmap
          </h4>

          <RiskHeatmap
            likelihood={
              result.data.categories.operational?.likelihood ??
              1
            }
            impact={
              result.data.categories.operational?.impact ?? 1
            }
            residualRisk={
              result.data.categories.operational
                ?.residualRisk ?? 0
            }
          />

          <div className="text-[11px] text-slate-500 mt-2">
  Matrix based on Likelihood × Impact (NIST-aligned model)
</div>

          <RiskLegend />
        </div>
      )}

      {/* ASSET BREAKDOWN */}
      {result?.data?.assetRisks?.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold mb-2">
            Asset Risk Breakdown
          </h4>

          <div className="space-y-2">
            {result.data.assetRisks.map(
              (a: any, idx: number) => (
                <div
                  key={idx}
                  className="border border-slate-700 bg-slate-900/40 rounded-lg p-3 flex justify-between"
                >
                  <span>
                    {a.assetName} ({a.ciaValue})
                  </span>
                  <span className="font-semibold">
                    {a.riskLevel} ({a.riskScore})
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* COMPLIANCE */}
      {result?.data?.summary?.compliancePercent !==
        undefined && (
        <div className="mt-6">
          <ComplianceCard
            percent={
              result.data.summary.compliancePercent
            }
            level={result.data.summary.complianceLevel}
          />
        </div>
      )}

      {result?.data?.summary?.treatment && (
  <div className="mt-4 text-xs text-slate-400">
    Recommended Treatment:{" "}
    <span className="font-semibold text-white">
      {result.data.summary.treatment}
    </span>
  </div>
)}

{/* ================================
   CSF INSIGHT
================================ */}
{result?.data?.summary?.csfAnalysis && (
  <div className="mt-6">
    <CsfInsightCard
      distribution={result.data.summary.csfAnalysis.distribution}
      dominant={result.data.summary.csfAnalysis.dominantFunction}
    />
  </div>
)}

{/* ================================
   RISK TREND
================================ */}
{result?.data?.categories && (
  <div className="mt-6">
    <RiskTrendCard categories={result.data.categories} />
  </div>
)}

      {/* FINDINGS */}
      {result?.data?.findings?.length > 0 && (
        <div className="mt-8">
          <FindingsPanel findings={result.data.findings} />
        </div>
      )}
    </div>
  );
}