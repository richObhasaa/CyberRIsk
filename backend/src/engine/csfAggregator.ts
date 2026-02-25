import { vulnerabilityMap } from "./owaspMapper";

export function deriveCsfFromVulnerabilities(
  vulnerabilities: string[] = []
) {
  const counts: Record<string, number> = {};

  vulnerabilities.forEach((v) => {
    const info = vulnerabilityMap[v];
    if (!info) return;

    counts[info.nistFunction] =
      (counts[info.nistFunction] || 0) + 1;
  });

// ambil function paling dominan
let dominant = "Identify";
let max = 0;

for (const [func, count] of Object.entries(counts)) {
  if (count > max) {
    dominant = func;
    max = count;
  }
}

// 🔥 defensive fallback
if (!Object.keys(counts).length) {
  return {
    dominantFunction: "Identify",
    distribution: {},
  };
}

return {
  dominantFunction: dominant || "Identify",
  distribution: counts,
};
}