export function calculateComplianceScore(
  checklist: { status?: string }[] = []
) {
  if (!checklist.length) {
    return {
      compliancePercent: 0,
      complianceLevel: "Not Measured",
    };
  }

  // exclude N/A
  const applicable = checklist.filter(
    (c) => c.status !== "Not Applicable"
  );

  // 🔥 critical edge case
  if (applicable.length === 0) {
    return {
      compliancePercent: 0,
      complianceLevel: "Not Measured",
    };
  }

  // ✅ weighted scoring (NIST-style realism)
  let score = 0;

  for (const c of applicable) {
    if (c.status === "Compliant") score += 1;
    else if (c.status === "Partial") score += 0.5;
  }

  const percent = Math.round(
    (score / applicable.length) * 100
  );

  let level: string;

  if (percent >= 80) level = "Compliant";
  else if (percent >= 60) level = "Needs Improvement";
  else level = "Non-Compliant";

  return {
    compliancePercent: percent,
    complianceLevel: level,
  };
}