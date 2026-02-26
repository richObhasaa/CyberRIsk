"use client";

type StatItem = {
  value: string;
  label: string;
};

export default function StatsBar() {
  const stats = [
    { value: "70%", label: "Less Manual Communication" },
    { value: "3–6X", label: "Higher Engagement" },
    { value: "50%", label: "More Customer Interaction" },
  ];

  return (
    <div
      className="
        w-full
        rounded-2xl
        border border-white/10
        bg-gradient-to-r
        from-[#3d0be0]/20
        via-[#6f3be8]/15
        to-cyan-500/10
        backdrop-blur-xl
        shadow-[0_0_40px_rgba(61,11,224,0.25)]
        px-8 py-6
      "
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
        {stats.map((s) => (
          <div key={s.label} className="space-y-1">
            <div className="text-3xl font-bold bg-gradient-to-r from-white to-[#a09eff] bg-clip-text text-transparent">
              {s.value}
            </div>
            <div className="text-xs text-gray-300">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}