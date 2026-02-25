import express from "express";
import { generateAuditChecklist } from "../engine/auditChecklistEngine";
import { calculateCompliance } from "../engine/complianceEngine";
import { generateFindings } from "../engine/findingEngine";

const router = express.Router();

router.post("/run", (req, res) => {
  try {
    const { vulnerabilities, assetName } = req.body;

    const checklist = generateAuditChecklist(vulnerabilities);
    const compliance = calculateCompliance(checklist);
    const findings = generateFindings(checklist, assetName);

    return res.json({
      success: true,
      data: {
        checklist,
        compliance,
        findings,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false });
  }
});

export default router;