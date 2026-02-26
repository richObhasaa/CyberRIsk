import { Finding } from "../types";

export const analyzeTLS = (tlsData: any): Finding[] => {
    const findings: Finding[] = [];

    if (!tlsData || !tlsData.cert) {
        findings.push({
            type: "TLS_ERROR",
            severity: "High"
        });
        return findings;
    }

    const now = new Date();
    const expiry = new Date(tlsData.cert.valid_to);

    if (expiry < now) {
        findings.push({
            type: "TLS_EXPIRED",
            severity: "High"
        });
    }

    const protocol = tlsData.protocol;

    if (protocol && protocol.includes("TLSv1.1")) {
        findings.push({
            type: "TLS_WEAK_VERSION",
            severity: "High"
        });
    }

    if (protocol && protocol.includes("TLSv1")) {
        findings.push({
            type: "TLS_LEGACY_VERSION",
            severity: "Critical"
        });
    }

    return findings;
};