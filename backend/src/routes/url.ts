import { Router, Request, Response } from "express";

// Existing core services
import { checkDNS } from "../../url/services/dns.service";
import { fetchHeaders } from "../../url/services/header.service";
import { fetchTLSInfo } from "../../url/services/tls.service";
import { scanCommonPorts } from "../../url/services/port.service";

// Analyzers
import { analyzeHeaders } from "../../url/analyzers/header.analyzer";
import { analyzeTLS } from "../../url/analyzers/tls.analyzer";
import { analyzePorts } from "../../url/analyzers/port.analyzer";
import { analyzeRedirectChain } from "../../url/services/redirect.service";
import { evaluateRedirect } from "../../url/analyzers/redirect.analyzer";

// Scoring & Mapping
import { mapFindings } from "../../url/engine/nist.mapper";
import { calculateScore } from "../../url/engine/risk.engine";

// AI Summary
import { generateAISummary } from "../../url/services/ai.service";

const router = Router();

/**
 * POST /api/url/audit
 */
router.post("/audit", async (req: Request, res: Response) => {
    try {
        const { url } = req.body;

        if (!url || typeof url !== "string") {
            return res.status(400).json({
                success: false,
                message: "Valid URL is required"
            });
        }

        // ─────────────────────────────────────────────
        // 1️⃣ DNS Check (existing feature)
        // ─────────────────────────────────────────────
        const dnsFindings = await checkDNS(url);

        // ─────────────────────────────────────────────
        // 2️⃣ Header Fetch + Analyze
        // ─────────────────────────────────────────────
        const headerData = await fetchHeaders(url);
        const headerFindings = analyzeHeaders(headerData.headers);

        // ─────────────────────────────────────────────
        // 3️⃣ TLS Fetch + Analyze
        // ─────────────────────────────────────────────
        const tlsData = await fetchTLSInfo(url);
        const tlsFindings = analyzeTLS(tlsData);

        // ─────────────────────────────────────────────
        // 4️⃣ Port Scan + Analyze
        // ─────────────────────────────────────────────
        const portData = await scanCommonPorts(url);
        const portFindings = analyzePorts(portData);

        // ─────────────────────────────────────────────
        // 5️⃣ Redirect Analysis (NEW)
        // ─────────────────────────────────────────────
        const redirectData = await analyzeRedirectChain(url);
        const redirectFindings = evaluateRedirect(redirectData);

        // ─────────────────────────────────────────────
        // 6️⃣ Combine All Findings
        // ─────────────────────────────────────────────
        const findings = [
            ...dnsFindings,
            ...headerFindings,
            ...tlsFindings,
            ...portFindings,
            ...redirectFindings
        ];

        // ─────────────────────────────────────────────
        // 7️⃣ Map to NIST
        // ─────────────────────────────────────────────
        const mappedFindings = mapFindings(findings);

        // ─────────────────────────────────────────────
        // 8️⃣ Risk Scoring + Breakdown
        // ─────────────────────────────────────────────
        const scoring = calculateScore(mappedFindings);

        // ─────────────────────────────────────────────
        // 9️⃣ AI Summary (DeepSeek)
        // ─────────────────────────────────────────────
        const aiSummary = await generateAISummary(
            mappedFindings,
            scoring.overall
        );

        // ─────────────────────────────────────────────
        // 🔟 Final Response
        // ─────────────────────────────────────────────
        return res.json({
            success: true,
            url,
            overallScore: scoring.overall,
            scorePercentage: `${scoring.overall}%`,
            totalDeductions: scoring.totalDeductions,
            scoreBreakdown: scoring.breakdown,
            scoreExplanation: scoring.explanation,
            nistBreakdown: scoring.breakdown,
            findings: mappedFindings,
            portScan: portData,
            redirect: redirectData,
            aiSummary,
            explanation: {
                Identify:
                    "The Identify function aims to understand assets, systems, and potential risk exposure.",
                Protect:
                    "The Protect function focuses on protecting systems from threats and exploitation.",
                Detect:
                    "The Detect function helps in detecting suspicious activities or security vulnerabilities."
            },
            timestamp: new Date().toISOString()
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

export default router;