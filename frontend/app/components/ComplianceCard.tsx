"use client";

export default function ComplianceCard({
  percent,
  level,
}: {
  percent: number;
  level: string;
}) {
  const getColor = () => {
    if (percent >= 80) return "text-emerald-400";
    if (percent >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getBar = () => {
    if (percent >= 80) return "bg-emerald-500";
    if (percent >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
      <div className="text-sm font-semibold text-slate-300 mb-3">
        Compliance Maturity
      </div>

      <div className={`text-3xl font-bold ${getColor()}`}>
        {percent}%
      </div>

      <div className="text-xs text-slate-400 mb-3">
        Status: {level}
      </div>

      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${getBar()}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}