import { Finding } from "../types";

export const analyzeHeaders = (headers: any): Finding[] => {
    const findings: Finding[] = [];

    const csp = headers["content-security-policy"];
    const hsts = headers["strict-transport-security"];
    const xframe = headers["x-frame-options"];
    const referrer = headers["referrer-policy"];

    // CSP
    if (!csp) {
        findings.push({
            type: "CSP_MISSING",
            severity: "Medium"
        });
    } else {
        if (csp.includes("*")) {
            findings.push({
                type: "CSP_WEAK_WILDCARD",
                severity: "Low"
            });
        }
        if (csp.includes("unsafe-inline")) {
            findings.push({
                type: "CSP_UNSAFE_INLINE",
                severity: "Medium"
            });
        }
    }

    // HSTS
    if (!hsts) {
        findings.push({
            type: "HSTS_MISSING",
            severity: "Medium"
        });
    }

    // X-Frame (avoid false positive if CSP frame-ancestors exists)
    if (!xframe && (!csp || !csp.includes("frame-ancestors"))) {
        findings.push({
            type: "XFRAME_MISSING",
            severity: "Low"
        });
    }

    // Referrer Policy
    if (!referrer) {
        findings.push({
            type: "REFERRER_POLICY_MISSING",
            severity: "Low"
        });
    }

    return findings;
};