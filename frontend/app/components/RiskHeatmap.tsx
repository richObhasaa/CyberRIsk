"use client";

import { getRiskLevel, getRiskColor } from "./getRiskColor";

type Props = {
  likelihood: number; // 1–5
  impact: number;     // 1–5
  residualRisk: number;
};

export default function RiskHeatmap({
  likelihood,
  impact,
  residualRisk,
}: Props) {
  const level = getRiskLevel(residualRisk);
  const activeColor = getRiskColor(level);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold">Risk Heatmap</h3>
        <p className="text-sm text-gray-400">
          Residual Risk:{" "}
          <span className="font-bold text-white">
            {residualRisk} ({level})
          </span>
        </p>
      </div>

      {/* Heatmap Grid */}
      <div className="grid grid-cols-5 gap-2 w-max">
        {[5, 4, 3, 2, 1].map((row) =>
          [1, 2, 3, 4, 5].map((col) => {
            const isActive = row === likelihood && col === impact;

            return (
              <div
                key={`${row}-${col}`}
                className={[
                  "w-12 h-12 border rounded-lg transition-all duration-200",
                  isActive
                    ? `${activeColor} ring-2 ring-white scale-105 shadow-lg`
                    : "bg-gray-800 border-gray-700",
                ].join(" ")}
              />
            );
          })
        )}
      </div>

      {/* Axis Labels (important for auditor realism) */}
      <div className="flex justify-between text-xs text-gray-400 w-64">
        <span>Low Impact</span>
        <span>High Impact →</span>
      </div>
    </div>
  );
}