type ExposureInput = {
  organizationSector: string;
  employeeCount: number;
  systemType: string;
};

export function calculateExposure(input: ExposureInput) {
  let score = 0;

  // ======================
  // Sector risk
  // ======================
  const highRiskSectors = ["Finance", "Healthcare", "Government"];
  const mediumRiskSectors = ["Education", "Technology"];

  if (highRiskSectors.includes(input.organizationSector)) {
    score += 3;
  } else if (mediumRiskSectors.includes(input.organizationSector)) {
    score += 2;
  } else {
    score += 1;
  }

  // ======================
  // Company size
  // ======================
  if (input.employeeCount >= 1000) score += 3;
  else if (input.employeeCount >= 200) score += 2;
  else score += 1;

  // ======================
  // System exposure
  // ======================
  const internetFacing = ["Web", "Mobile", "Cloud"];

  if (internetFacing.includes(input.systemType)) {
    score += 3;
  } else {
    score += 1;
  }

  // ======================
  // Level mapping
  // ======================
  let level: "Low" | "Medium" | "High";
  let multiplier: number;

  if (score >= 8) {
    level = "High";
    multiplier = 1.3;
  } else if (score >= 5) {
    level = "Medium";
    multiplier = 1.15;
  } else {
    level = "Low";
    multiplier = 1;
  }

  return {
    exposureScore: score,
    exposureLevel: level,
    exposureMultiplier: multiplier,
  };
}