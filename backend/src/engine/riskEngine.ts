import { vulnerabilityMap } from "./owaspMapper";

export type RiskInput = {
  likelihood: number; // 1–5
  impact: number; // 1–5
  controlEffectiveness: number; // 0–100
};

export type RiskOutput = {
  inherentRisk: number;
  residualRisk: number;
  riskLevel: "Low" | "Medium" | "High" | "Critical";
  riskMatrix: {
    likelihood: number;
    impact: number;
  };
};

export function calculateRisk(input: RiskInput): RiskOutput {
  const { likelihood, impact, controlEffectiveness } = input;

  // ✅ inherent risk (NIST style)
  const inherentRisk = likelihood * impact;

  // ✅ residual risk after controls
  const residualRisk = Math.round(
    inherentRisk * (1 - controlEffectiveness / 100)
  );

  // ✅ standardized risk level (1–25 matrix)
  let riskLevel: RiskOutput["riskLevel"] = "Low";

  if (residualRisk >= 16) riskLevel = "Critical";
  else if (residualRisk >= 10) riskLevel = "High";
  else if (residualRisk >= 5) riskLevel = "Medium";

  return {
    inherentRisk,
    residualRisk,
    riskLevel,
    riskMatrix: {
      likelihood,
      impact,
    },
  };
}

export function deriveRiskFromVulnerabilities(
  vulnerabilities: string[] = []
) {
  if (!vulnerabilities.length) {
    return { likelihood: 2, impact: 2 };
  }

  let maxLikelihood = 1;
  let maxImpact = 1;

  for (const v of vulnerabilities) {
    const info = vulnerabilityMap[v];
    if (!info) continue;

    maxLikelihood = Math.max(maxLikelihood, info.likelihood);
    maxImpact = Math.max(maxImpact, info.impact);
  }

  return {
    likelihood: Math.min(maxLikelihood, 5),
    impact: Math.min(maxImpact, 5),
  };
}