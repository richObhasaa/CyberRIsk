"use client";

type Props = {
  distribution?: Record<string, number>;
  dominant?: string;
};

export default function CsfInsightCard({
  distribution,
  dominant,
}: Props) {
  if (!distribution) return null;

  const total = Object.values(distribution).reduce(
    (a, b) => a + b,
    0
  );

  const items = Object.entries(distribution);

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/60 p-5">
      <div className="text-sm font-semibold text-slate-300 mb-3">
        NIST CSF Function Analysis
      </div>

      {/* dominant */}
      <div className="text-xs text-slate-400 mb-4">
        Dominant Function:{" "}
        <span className="text-white font-semibold capitalize">
          {dominant ?? "Identify"}
        </span>
      </div>

      {/* bars */}
      <div className="space-y-2">
        {items.map(([key, value]) => {
          const percent =
            total > 0 ? Math.round((value / total) * 100) : 0;

          return (
            <div key={key} className="space-y-1">
              <div className="flex justify-between text-xs text-slate-400">
                <span className="capitalize">{key}</span>
                <span>{percent}%</span>
              </div>

              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}