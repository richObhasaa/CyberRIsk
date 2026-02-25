type CIA = "High" | "Medium" | "Low";

const ciaBaseScore: Record<CIA, number> = {
  High: 5,
  Medium: 3,
  Low: 1,
};

export function calculateCriticality(
  ciaValue: CIA,
  exposureMultiplier: number = 1
) {
  const base = ciaBaseScore[ciaValue] ?? 3;

  const adjustedScore = Math.round(base * exposureMultiplier);

  let level: "Low" | "Medium" | "High";

  if (adjustedScore >= 5) level = "High";
  else if (adjustedScore >= 3) level = "Medium";
  else level = "Low";

  return {
    criticalityScore: adjustedScore,
    criticalityLevel: level,
  };
}