import { Finding } from "../types";

export const evaluateRedirect = (redirectData: any): Finding[] => {
    const findings: Finding[] = [];

    if (!redirectData) {
        return findings;
    }

    const { original, final } = redirectData;

    if (original.startsWith("http://") && final.startsWith("http://")) {
        findings.push({
            type: "NO_HTTPS_REDIRECT",
            severity: "High",
            description: "Website tidak mengalihkan HTTP ke HTTPS."
        });
    }

    return findings;
};