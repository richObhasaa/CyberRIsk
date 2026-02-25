export type AuditOpinion =
  | "Secure"
  | "Acceptable Risk"
  | "Needs Immediate Action";

export function deriveAuditOpinion(params: {
  riskLevel: string;
  compliancePercent: number;
  highFindings?: number;
}): AuditOpinion {
  const { riskLevel, compliancePercent, highFindings = 0 } =
    params;

  // 🚨 kondisi kritis
  if (
    riskLevel === "Critical" ||
    compliancePercent < 50 ||
    highFindings > 0
  ) {
    return "Needs Immediate Action";
  }

  // ⚠️ kondisi menengah
  if (
    riskLevel === "High" ||
    compliancePercent < 75
  ) {
    return "Acceptable Risk";
  }

  // ✅ kondisi aman
  return "Secure";
}