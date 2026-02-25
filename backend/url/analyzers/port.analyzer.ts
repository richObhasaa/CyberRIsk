import { Finding } from "../types";

export const analyzePorts = (ports: Record<number, boolean>): Finding[] => {
    const findings: Finding[] = [];

    if (ports[22]) {
        findings.push({
            type: "SSH_PORT_OPEN",
            severity: "High",
            description: "Port SSH (22) terbuka dan dapat diakses publik."
        });
    }

    if (ports[21]) {
        findings.push({
            type: "FTP_PORT_OPEN",
            severity: "High",
            description: "Port FTP (21) terbuka dan berisiko."
        });
    }

    return findings;
};