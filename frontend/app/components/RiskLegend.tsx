"use client";

export default function RiskLegend() {
  const items = [
    { label: "Low", color: "bg-green-600" },
    { label: "Medium", color: "bg-yellow-500" },
    { label: "High", color: "bg-orange-500" },
    { label: "Critical", color: "bg-red-600" },
  ];

  return (
    <div className="flex gap-3 text-xs mt-3">
      {items.map((i) => (
        <div key={i.label} className="flex items-center gap-1">
          <div className={`w-3 h-3 rounded ${i.color}`} />
          <span>{i.label}</span>
        </div>
      ))}
    </div>
  );
}