"use client";

export default function RiskTrendCard({
  categories,
}: {
  categories?: Record<string, any>;
}) {
  if (!categories) return null;

  const items = Object.entries(categories);

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
      <div className="text-sm font-semibold text-slate-300 mb-4">
        Residual Risk by Domain
      </div>

      <div className="space-y-3">
        {items.map(([name, value]) => {
          const score = value?.residualRisk ?? 0;
          const width = Math.min(100, score * 4);

          return (
            <div key={name} className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span className="capitalize">{name}</span>
                <span className="text-white font-semibold">
                  {score}
                </span>
              </div>

              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500"
                  style={{ width: `${width}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}