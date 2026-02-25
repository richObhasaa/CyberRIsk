"use client";

export default function AuditOpinionCard({
  opinion,
}: {
  opinion: string;
}) {
  const getStyle = () => {
    if (opinion === "Secure")
      return "bg-emerald-600/20 border-emerald-500 text-emerald-300";

    if (opinion === "Acceptable Risk")
      return "bg-yellow-600/20 border-yellow-500 text-yellow-300";

    return "bg-red-600/20 border-red-500 text-red-200";
  };

  return (
    <div
      className={`rounded-xl border p-5 ${getStyle()} transition-all`}
    >
      <div className="text-xs uppercase tracking-wide opacity-80">
        Final Audit Opinion
      </div>

      <div className="text-lg font-bold mt-1">
        {opinion}
      </div>
    </div>
  );
}