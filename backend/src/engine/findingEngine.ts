import { AuditItem } from "./auditChecklistEngine";
import { vulnerabilityMap } from "./owaspMapper";

export function generateFindings(
  items: AuditItem[],
  assetName: string
) {
  return items
    .filter((i) => i.status === "Non-Compliant")
    .map((i) => {
      // 🔍 match vulnerability by controlId (robust)
      const vulnEntry = Object.entries(vulnerabilityMap).find(
        ([, v]) => v.controlId === i.controlId
      );

      const businessImpact =
        vulnEntry?.[1]?.businessImpact ||
        "Security control weakness may expose the system";

      // 🔥 HITUNG SEVERITY DULU (DI LUAR RETURN)
      let severity: "Low" | "Medium" | "High";

      if (i.controlId?.startsWith("PR")) severity = "High";
      else if (i.controlId?.startsWith("DE")) severity = "Medium";
      else severity = "Medium";

      // ✅ baru return object
      return {
        issue: i.title,
        risk: businessImpact,
        affectedAsset: assetName,
        recommendation:
          vulnEntry?.[1]?.recommendation ||
          "Implement the missing security control and verify effectiveness",
        severity,
      };
    });
}