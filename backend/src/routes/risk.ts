import express from "express";
import { riskSchema } from "../validators/riskValidator";
import { calculateRisk } from "../engine/riskEngine";
import { vulnerabilityMap } from "../engine/owaspMapper";
import { ciaScoreMap } from "../engine/ciaMapper";
import { calculateExposure } from "../engine/exposureEngine";
import { calculateCriticality } from "../engine/criticalityEngine";
import { csfFunctionMap } from "../engine/csfMapper";
import { deriveCsfFromVulnerabilities } from "../engine/csfAggregator";
import { generateAuditChecklist } from "../engine/auditChecklistEngine";
import { calculateComplianceScore } from "../engine/complianceEngine";
import { deriveAuditOpinion } from "../engine/auditOpinionEngine";
import { generateFindings } from "../engine/findingEngine";

const router = express.Router();
console.log("🔥 risk router LOADED");

type VulnScore = {
  likelihood: number;
  impact: number;
};

router.post("/assess", async (req, res) => {
  try {
    // ================================
    // 🧪 VALIDATION
    // ================================
    const parsed = riskSchema.safeParse(req.body);

    if (!parsed.success) {
      console.error("VALIDATION ERROR:", parsed.error.format());
      return res.status(400).json({
        success: false,
        message: "Invalid input",
      });
    }

    const data = parsed.data;

    type CIA = "Low" | "Medium" | "High";

type AssetItem = {
  name: string;
  owner?: string;
  location?: string;
  type: string;
  ciaValue: CIA;
};

const assets: AssetItem[] =
  (data as any).assets &&
  Array.isArray((data as any).assets)
    ? ((data as any).assets as AssetItem[])
    : [];

    // ================================
    // 🔥 AUTO RISK FROM OWASP
    // ================================
if (data.vulnerabilities?.length) {
  const mapped = (data.vulnerabilities ?? [])
    .map(
      (v) =>
        vulnerabilityMap[
          v as keyof typeof vulnerabilityMap
        ]
    )
    .filter(Boolean) as VulnScore[];

  if (mapped.length) {
    const avgLikelihood =
      mapped.reduce((a, b) => a + b.likelihood, 0) /
      mapped.length;

    const avgImpact =
      mapped.reduce((a, b) => a + b.impact, 0) /
      mapped.length;

    (Object.keys(data.risks) as Array<
      keyof typeof data.risks
    >).forEach((key) => {
      const risk = data.risks[key];
      if (!risk) return;

      risk.likelihood = Math.min(
        5,
        Math.max(1, Math.round(avgLikelihood))
      );

      risk.impact = Math.min(
        5,
        Math.max(1, Math.round(avgImpact))
      );
    });
  }
}

    // ================================
    // 🧠 DERIVE CSF FROM VULNERABILITIES
    // ================================
    const csfFromVuln = deriveCsfFromVulnerabilities(
      data.vulnerabilities ?? []
    );

    const auditChecklist = generateAuditChecklist(
      data.vulnerabilities ?? []
    ) as any[];

    const compliance = calculateComplianceScore(
      auditChecklist
    );

    const findings = generateFindings(
      auditChecklist,
      assets?.[0]?.name ?? "Primary Asset"
    );

    // ================================
    // 🌐 EXPOSURE ENGINE
    // ================================
    const exposure = calculateExposure({
      organizationSector:
        data.organizationSector ?? "Technology",
      employeeCount: data.employeeCount ?? 50,
      systemType: data.systemType ?? "Internal Network",
    });

    // ================================
    // 🧠 CRITICALITY
    // ================================
    const criticality = calculateCriticality(
      (data.ciaValue as "High" | "Medium" | "Low") ??
        "Medium"
    );

    const ciaMultiplier =
      ciaScoreMap[
        data.ciaValue as keyof typeof ciaScoreMap
      ] ?? 1;

    // ================================
    // 🔥 APPLY GLOBAL MULTIPLIERS
    // ================================
    (Object.keys(data.risks) as Array<
      keyof typeof data.risks
    >).forEach((key) => {
      const risk = data.risks[key];
      const weight = csfFunctionMap[key];

      // CIA boost
      risk.impact = Math.min(
        5,
        Math.round(risk.impact * ciaMultiplier)
      );

      // Exposure boost
      risk.likelihood = Math.min(
        5,
        Math.round(
          risk.likelihood * exposure.exposureMultiplier
        )
      );

      // CSF weighting
      if (weight) {
        risk.likelihood = Math.min(
          5,
          Math.round(
            risk.likelihood * weight.likelihoodWeight
          )
        );

        risk.impact = Math.min(
          5,
          Math.round(risk.impact * weight.impactWeight)
        );
      }
    });

    // ================================
    // 🧠 PER CATEGORY
    // ================================
    type RiskCategory = keyof typeof csfFunctionMap;

    const results: Record<RiskCategory, any> = {
      operational: {
        ...calculateRisk(data.risks.operational),
        csfFunction:
          csfFunctionMap.operational?.function ??
          "Protect",
      },
      financial: {
        ...calculateRisk(data.risks.financial),
        csfFunction:
          csfFunctionMap.financial?.function ??
          "Identify",
      },
      compliance: {
        ...calculateRisk(data.risks.compliance),
        csfFunction:
          csfFunctionMap.compliance?.function ??
          "Detect",
      },
      reputational: {
        ...calculateRisk(data.risks.reputational),
        csfFunction:
          csfFunctionMap.reputational?.function ??
          "Respond",
      },
      strategic: {
        ...calculateRisk(data.risks.strategic),
        csfFunction:
          csfFunctionMap.strategic?.function ??
          "Recover",
      },
    };

    // ================================
    // 🔥 PER-ASSET RISK (REALISTIC)
    // ================================
const assetRiskResults = assets.map((asset) => {
  const assetCiaMultiplier =
    ciaScoreMap[asset.ciaValue as keyof typeof ciaScoreMap] ?? 1;

  const adjustRisk = (base: any) => ({
    ...base,
    impact: Math.min(
      5,
      Math.round(base.impact * assetCiaMultiplier)
    ),
  });

  const perCategory = {
    operational: calculateRisk(adjustRisk(data.risks.operational)),
    financial: calculateRisk(adjustRisk(data.risks.financial)),
    compliance: calculateRisk(adjustRisk(data.risks.compliance)),
    reputational: calculateRisk(adjustRisk(data.risks.reputational)),
    strategic: calculateRisk(adjustRisk(data.risks.strategic)),
  };

  const residualValues = Object.values(perCategory).map(
    (r) => r.residualRisk
  );

  const avgResidual =
    residualValues.reduce((a, b) => a + b, 0) /
    residualValues.length;

  return {
    assetName: asset.name,
    assetType: asset.type,
    ciaValue: asset.ciaValue,
    riskScore: Math.round(avgResidual),
    riskLevel:
      avgResidual >= 16
        ? "Critical"
        : avgResidual >= 10
        ? "High"
        : avgResidual >= 5
        ? "Medium"
        : "Low",
  };
});

    // ================================
// 📊 CATEGORY AVERAGES
// ================================
const inherentValues = Object.values(results).map(
  (r) => r.inherentRisk
);

const residualValues = Object.values(results).map(
  (r) => r.residualRisk
);

const avgInherent =
  inherentValues.reduce((a, b) => a + b, 0) /
  inherentValues.length;

const avgResidual =
  residualValues.reduce((a, b) => a + b, 0) /
  residualValues.length;

// ================================
// 🔥 AGGREGATED ASSET RISK
// ================================
const overallAssetResidual =
  assetRiskResults.length > 0
    ? assetRiskResults.reduce<number>(
        (sum, a) => sum + a.riskScore,
        0
      ) / assetRiskResults.length
    : avgResidual;

    // ================================
    // 🏆 HIGHEST CATEGORY
    // ================================
    let highestRisk = "";
    let highestValue = -Infinity;

    for (const [key, value] of Object.entries(results)) {
      if (value.residualRisk > highestValue) {
        highestValue = value.residualRisk;
        highestRisk = key;
      }
    }

    // ================================
    // 🚦 OVERALL LEVEL
    // ================================
    let overallLevel:
      | "Low"
      | "Medium"
      | "High"
      | "Critical";

    if (overallAssetResidual >= 16) overallLevel = "Critical";
    else if (overallAssetResidual >= 10) overallLevel = "High";
    else if (overallAssetResidual >= 5) overallLevel = "Medium";
    else overallLevel = "Low";

    // ================================
// 🏁 FINAL AUDIT OPINION
// ================================
const highFindingsCount =
  findings?.filter((f: any) => f.severity === "High").length ?? 0;

const finalOpinion = deriveAuditOpinion({
  riskLevel: overallLevel,
  compliancePercent: compliance.compliancePercent,
  highFindings: highFindingsCount,
});

// ================================
// 📉 RISK REDUCTION
// ================================
const riskReduction =
  avgInherent > 0
    ? Math.round(
        ((avgInherent - overallAssetResidual) / avgInherent) * 100
      )
    : 0;

// ================================
// 🧭 TREATMENT GUIDANCE
// ================================
const treatment =
  overallLevel === "Critical"
    ? "Immediate remediation required"
    : overallLevel === "High"
    ? "Mitigation plan recommended"
    : "Monitor and review";

// ================================
// ✅ RESPONSE
// ================================
return res.json({
  success: true,
  data: {
    categories: results,
    assetRisks: assetRiskResults,
    findings,
    summary: {
      avgInherent: Math.round(avgInherent),
      avgResidual: Math.round(overallAssetResidual),

      // 🔥 derived metrics
      riskReduction,

      highestRisk,
      riskLevel: overallLevel,

      // 📊 criticality
      criticalityScore: criticality.criticalityScore,
      criticalityLevel: criticality.criticalityLevel,

      // 🌐 exposure
      exposureLevel: exposure.exposureLevel,
      exposureScore: exposure.exposureScore,

      // 🧠 CSF mapping
      csfAnalysis: csfFromVuln,
      detectedVulnerabilities: data.vulnerabilities ?? [],

      // 💡 recommendations
      recommendations: (data.vulnerabilities ?? [])
        .map(
          (v) =>
            vulnerabilityMap[v as keyof typeof vulnerabilityMap]
              ?.recommendation
        )
        .filter(Boolean),

      auditChecklist,

      // 🎯 treatment guidance
      treatment,

      // ✅ compliance
      compliancePercent: compliance.compliancePercent,
      complianceLevel: compliance.complianceLevel,

      // 🏁 final opinion
      auditOpinion: finalOpinion,
    },
  },
});
  } catch (err) {
    console.error("Risk assess error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

export default router;