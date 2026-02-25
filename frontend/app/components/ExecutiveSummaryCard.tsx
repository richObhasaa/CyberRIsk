"use client";

export default function ExecutiveSummaryCard({
  riskLevel,
  highestRisk,
  exposureLevel,
  criticalityLevel,
  riskReduction,
}: {
  riskLevel: string;
  highestRisk: string;
  exposureLevel: string;
  criticalityLevel: string;
  riskReduction?: number;
}) {
  const reduction = riskReduction ?? 0;

  const getReductionColor = () => {
    if (reduction >= 60) return "bg-emerald-500";
    if (reduction >= 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5 space-y-4">
      <h4 className="text-sm font-semibold text-slate-300">
        Executive Risk Summary
      </h4>

      {/* GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <SummaryItem label="Overall Risk" value={riskLevel} />
        <SummaryItem label="Highest Risk Area" value={highestRisk} />
        <SummaryItem label="Exposure Level" value={exposureLevel} />
        <SummaryItem label="Asset Criticality" value={criticalityLevel} />
      </div>

      {/* 🔥 RISK REDUCTION BAR */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Risk Reduction Effectiveness</span>
          <span className="font-semibold text-white">
            {reduction}%
          </span>
        </div>

        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${getReductionColor()} transition-all`}
            style={{ width: `${reduction}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-slate-400">{label}</div>
      <div className="font-semibold text-white capitalize">
        {value}
      </div>
    </div>
  );
}