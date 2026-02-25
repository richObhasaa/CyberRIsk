"use client";

type Finding = {
  issue: string;
  risk: string;
  asset?: string;
  recommendation?: string;
  severity?: string;
};

export default function FindingsPanel({
  findings,
}: {
  findings: Finding[];
}) {
  if (!findings?.length) {
    return (
      <div className="text-sm text-gray-400">
        No audit findings generated.
      </div>
    );
  }

  const getColor = (sev?: string) => {
    if (sev === "High") return "border-red-500";
    if (sev === "Medium") return "border-yellow-500";
    if (sev === "Low") return "border-green-500";
    return "border-gray-600";
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        Audit Findings
      </h3>

      {findings.map((f, i) => (
        <div
          key={i}
          className={`border-l-4 p-4 rounded bg-gray-900 ${getColor(
            f.severity
          )}`}
        >
          <div className="font-semibold mb-1">
            {f.issue}
          </div>

          <div className="text-sm text-gray-300 mb-1">
            <span className="font-medium">Risk:</span>{" "}
            {f.risk}
          </div>

          {f.asset && (
            <div className="text-sm text-gray-300 mb-1">
              <span className="font-medium">
                Affected Asset:
              </span>{" "}
              {f.asset}
            </div>
          )}

          {f.recommendation && (
            <div className="text-sm text-blue-300 mt-2">
              💡 {f.recommendation}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}